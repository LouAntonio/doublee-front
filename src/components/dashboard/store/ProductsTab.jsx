import React, { useState, useEffect } from 'react';
import {
	IoAddOutline,
	IoTrashOutline,
	IoPencilOutline,
	IoCloseOutline,
	IoImageOutline,
	IoCheckmarkOutline,
	IoRemoveOutline,
	IoGitBranchOutline,
	IoCameraOutline,
} from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import http from '../../../services/http';
import { notyf } from '../../../utils/notyf';
import { formatCurrency } from '../../../utils/currency';
import { isPromotionActive, toDateInputValue, minDateLuanda } from '../../../utils/date';
import { uploadToCloudinary } from './constants';
import ImagePicker from './ui/ImagePicker';
import EmptyState from './ui/EmptyState';
import SectionTitle from './ui/SectionTitle';
import DashboardModal from '../DashboardModal';
import OptimizedImage from '../../ui/OptimizedImage';
import Pagination from '../../ui/Pagination';
import { cleanupUploads } from '../../../utils/cleanupUploads';

const usePlatformSettings = () =>
	useQuery({
		queryKey: ['platform-settings'],
		queryFn: async () => {
			const res = await http.get('/platform/settings');
			if (!res?.success) throw new Error('Erro ao carregar configurações da plataforma');
			return res.data || {};
		},
		staleTime: 1000 * 60 * 10,
		refetchOnMount: 'always',
	});

const EMPTY_PRODUCT = {
	name: '', description: '', price: '', promotionalPrice: '',
	promotionalEndDate: '', stock: '',
};

const normalizeChars = raw => {
	if (!raw || typeof raw !== 'object') return [];
	if (Array.isArray(raw)) return raw.filter(r => r.key || r.value);
	return Object.entries(raw).map(([key, value]) => ({ key, value: String(value) }));
};

// ProductStatus do schema
const PRODUCT_STATUS_MAP = {
	active: { label: 'Activo', cls: 'bg-green-50 text-green-700 border-green-200' },
	inactive: { label: 'Inactivo', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
	outOfStock: { label: 'Sem stock', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
	discontinued: { label: 'Descontinuado', cls: 'bg-red-50 text-red-600 border-red-200' },
	suspended: { label: 'Suspenso', cls: 'bg-red-100 text-red-700 border-red-300' },
	pending: { label: 'Pendente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const isPromoValid = product => {
	if (!product.promotionalPrice) return false;
	return isPromotionActive(product.promotionalEndDate);
};

const ProductsTab = ({ products, pagination, onPageChange, onRefresh }) => {
	const [saving, setSaving] = useState(false);
	const [savingProgress, setSavingProgress] = useState('');
	const [deleting, setDeleting] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	const { data: platformSettings } = usePlatformSettings();
	const retentionFee = platformSettings?.platformRetentionFee ?? 0;

	// Categories
	const [allCategories, setAllCategories] = useState([]);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

	useEffect(() => {
		http.get('/categories')
			.then(res => { if (res?.success) setAllCategories(res.data?.categories || []); })
			.catch(() => { });
	}, []);

	// Main form fields
	const [form, setForm] = useState(EMPTY_PRODUCT);

	// Cover image
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');

	// Gallery
	const [galleryFiles, setGalleryFiles] = useState([]); // new File objects
	const [galleryPreviews, setGalleryPreviews] = useState([]); // preview URLs (new files)
	const [existingGallery, setExistingGallery] = useState([]); // already-uploaded URLs
	const [existingGalleryIds, setExistingGalleryIds] = useState([]); // Cloudinary ids (paralelo) das imagens já carregadas
	const [imageCloudinaryId, setImageCloudinaryId] = useState(null); // public_id da imagem principal

	// Characteristics
	const [chars, setChars] = useState([{ key: '', value: '' }]);

	// Variantes
	const [hasVariants, setHasVariants] = useState(false);
	const [optionGroups, setOptionGroups] = useState([]); // [{ name: '', values: [''] }]
	const [variants, setVariants] = useState([]);        // [{ options, sku, price, promotionalPrice, promotionalEndDate, stock, image, imageFile }]

	const resetModal = () => {
		setForm(EMPTY_PRODUCT);
		setImageFile(null);
		setImagePreview('');
		setGalleryFiles([]);
		setGalleryPreviews([]);
		setExistingGallery([]);
		setExistingGalleryIds([]);
		setImageCloudinaryId(null);
		setChars([{ key: '', value: '' }]);
		setSelectedCategoryIds([]);
		setHasVariants(false);
		setOptionGroups([]);
		setVariants([]);
	};

	const openNew = () => {
		setEditingProduct(null);
		resetModal();
		setModalOpen(true);
	};

	const openEdit = product => {
		setEditingProduct(product);
		setForm({
			name: product.name || '',
			description: product.description || '',
			price: product.price || '',
			promotionalPrice: product.promotionalPrice || '',
			promotionalEndDate: product.promotionalEndDate
				? toDateInputValue(product.promotionalEndDate)
				: '',
			stock: product.stock || '',
		});
		setImageFile(null);
		setImagePreview(product.image || '');
		setImageCloudinaryId(product.imageCloudinaryId || null);
		setGalleryFiles([]);
		setGalleryPreviews([]);
		setExistingGallery(Array.isArray(product.gallery) ? product.gallery : []);
		setExistingGalleryIds(Array.isArray(product.galleryCloudinaryIds) ? product.galleryCloudinaryIds : []);
		setChars(normalizeChars(product.characteristics).length > 0
			? normalizeChars(product.characteristics)
			: [{ key: '', value: '' }]);
		setSelectedCategoryIds(Array.isArray(product.categories) ? product.categories.map(c => c.id) : []);

		// Variantes — carregar se o produto já tem
		const productGroups = Array.isArray(product.optionGroups) ? product.optionGroups : [];
		const productVariants = Array.isArray(product.variants) ? product.variants : [];
		if (productGroups.length > 0 || productVariants.length > 0) {
			setHasVariants(true);
			setOptionGroups(productGroups.map(g => ({ name: g.name || '', values: g.values || [] })));
			setVariants(productVariants.map(v => ({
				id: v.id || null,
				options: v.options || {},
				sku: v.sku || '',
				price: v.price !== null && v.price !== undefined ? v.price : '',
				promotionalPrice: v.promotionalPrice || '',
				promotionalEndDate: v.promotionalEndDate ? toDateInputValue(v.promotionalEndDate) : '',
				stock: String(v.stock ?? '0'),
				image: v.image || null,
				imageCloudinaryId: v.imageCloudinaryId || null,
				imageFile: null,
			})));
		} else {
			setHasVariants(false);
			setOptionGroups([]);
			setVariants([]);
		}

		setModalOpen(true);
	};

	const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (!file) return;
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const handleGalleryAdd = e => {
		const files = Array.from(e.target.files);
		if (!files.length) return;
		const totalImages = existingGallery.length + galleryFiles.length + files.length;
		if (totalImages > 8) return notyf.error('Máximo de 8 imagens na galeria.');
		setGalleryFiles(prev => [...prev, ...files]);
		setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
		e.target.value = '';
	};

	const removeExistingGalleryImage = idx => {
		setExistingGallery(prev => prev.filter((_, i) => i !== idx));
		setExistingGalleryIds(prev => prev.filter((_, i) => i !== idx));
	};

	const removeNewGalleryImage = idx => {
		setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
		setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
	};

	// Characteristics handlers
	const handleCharChange = (idx, field, value) => {
		setChars(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
	};
	const addChar = () => setChars(prev => [...prev, { key: '', value: '' }]);
	const removeChar = idx => setChars(prev => prev.filter((_, i) => i !== idx));

	// Variantes handlers
	const handleGroupNameChange = (idx, value) => {
		setOptionGroups(prev => prev.map((g, i) => i === idx ? { ...g, name: value } : g));
	};
	const handleGroupValueChange = (gIdx, vIdx, value) => {
		setOptionGroups(prev => prev.map((g, i) => {
			if (i !== gIdx) return g;
			const values = g.values.map((val, j) => j === vIdx ? value : val);
			return { ...g, values };
		}));
	};
	const addOptionGroup = () => setOptionGroups(prev => [...prev, { name: '', values: [''] }]);
	const addGroupValue = gIdx => setOptionGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, values: [...g.values, ''] } : g));
	const removeGroupValue = (gIdx, vIdx) => setOptionGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, values: g.values.filter((_, j) => j !== vIdx) } : g));
	const removeOptionGroup = gIdx => setOptionGroups(prev => prev.filter((_, i) => i !== gIdx));

	const generateCombinations = () => {
		const validGroups = optionGroups
			.filter(g => g.name.trim())
			.map(g => ({ name: g.name.trim(), values: g.values.filter(v => v.trim()).map(v => v.trim()) }))
			.filter(g => g.values.length > 0);

		if (validGroups.length === 0) {
			notyf.error('Adicione pelo menos um grupo de opções com valores.');
			return;
		}

		let combos = [{}];
		for (const group of validGroups) {
			combos = combos.flatMap(combo =>
				group.values.map(value => ({ ...combo, [group.name]: value }))
			);
		}

		setVariants(combos.map(options => ({
			id: null,
			options,
			sku: '',
			price: '',
			promotionalPrice: '',
			promotionalEndDate: '',
			stock: '0',
			image: null,
			imageFile: null,
		})));
	};

	const handleVariantFieldChange = (idx, field, value) => {
		setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
	};

	const handleRemoveVariant = idx => {
		setVariants(prev => prev.filter((_, i) => i !== idx));
	};

	const handleVariantImageChange = (idx, e) => {
		const file = e.target.files[0];
		if (!file) return;
		setVariants(prev => prev.map((v, i) => i === idx ? { ...v, imageFile: file, image: URL.createObjectURL(file) } : v));
	};

	const removeVariants = () => {
		setHasVariants(false);
		setOptionGroups([]);
		setVariants([]);
	};

	// Category toggle
	const toggleCategory = id => {
		setSelectedCategoryIds(prev =>
			prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
		);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!form.name.trim()) return notyf.error('O nome do produto é obrigatório.');
		if (!form.price) return notyf.error('O preço é obrigatório.');
		if (!hasVariants && (form.stock === '' || form.stock === null)) return notyf.error('O stock é obrigatório.');
		if (form.promotionalPrice && parseFloat(form.promotionalPrice) >= parseFloat(form.price))
			return notyf.error('O preço promocional deve ser inferior ao preço normal.');

		setSaving(true);
		const uploadedPublicIds = [];
		try {
			const payload = {
				name: form.name.trim(),
				description: form.description.trim() || null,
				price: parseFloat(form.price),
				promotionalPrice: form.promotionalPrice ? parseFloat(form.promotionalPrice) : null,
				promotionalEndDate: form.promotionalEndDate || null,
			};

			// Se é com variantes, o stock do produto é a soma (backend recalcula);
			// envia mesmo assim o stock do form como fallback quando desactiva variantes
			if (!hasVariants) payload.stock = parseInt(form.stock);

			// Cover image
			if (imageFile) {
				setSavingProgress('A carregar imagem principal...');
				const imageUpload = await uploadToCloudinary(imageFile, 'products');
				payload.image = imageUpload.url;
				payload.imageCloudinaryId = imageUpload.publicId;
				uploadedPublicIds.push(imageUpload.publicId);
			} else {
				payload.image = imagePreview || null;
				payload.imageCloudinaryId = payload.image ? imageCloudinaryId : null;
			}

			// Gallery — upload new files
			const uploadedGallery = [];
			const uploadedGalleryIds = [];
			for (let i = 0; i < galleryFiles.length; i++) {
				setSavingProgress(`A carregar galeria (${i + 1}/${galleryFiles.length})...`);
				const upload = await uploadToCloudinary(galleryFiles[i], 'products');
				uploadedGallery.push(upload.url);
				uploadedGalleryIds.push(upload.publicId);
				uploadedPublicIds.push(upload.publicId);
			}
			payload.gallery = [...existingGallery, ...uploadedGallery];
			payload.galleryCloudinaryIds = [...existingGalleryIds.slice(0, existingGallery.length), ...uploadedGalleryIds];

			// Characteristics — filter out blank rows, convert to object
			const filledChars = chars.filter(c => c.key.trim() && c.value.trim());
			payload.characteristics = filledChars.length > 0
				? Object.fromEntries(filledChars.map(c => [c.key.trim(), c.value.trim()]))
				: null;

			payload.categoryIds = selectedCategoryIds;

			// Variantes — enviar sempre (vazio ao desactivar, para o backend eliminar as antigas)
			const validGroups = hasVariants
				? optionGroups
					.filter(g => g.name.trim())
					.map(g => ({
						name: g.name.trim(),
						values: g.values.filter(v => v.trim()).map(v => v.trim()),
					}))
					.filter(g => g.values.length > 0)
				: [];
			payload.optionGroups = validGroups;

			if (hasVariants) {
				if (variants.length === 0) {
					notyf.error('Crie as combinações de variantes antes de guardar.');
					setSaving(false);
					return;
				}

				for (const v of variants) {
					if (v.promotionalPrice && v.price !== '' && parseFloat(v.promotionalPrice) >= parseFloat(v.price)) {
						notyf.error(`O preço promocional da variante deve ser inferior ao preço dela.`);
						setSaving(false);
						return;
					}
				}

				const variantPayloads = [];
				for (let i = 0; i < variants.length; i++) {
					const v = variants[i];
					let image = v.image;
					let imageCloudinaryId = v.imageCloudinaryId || null;
					if (v.imageFile) {
						setSavingProgress(`A carregar imagem da variante (${i + 1}/${variants.length})...`);
						const imageUpload = await uploadToCloudinary(v.imageFile, 'products');
						image = imageUpload.url;
						imageCloudinaryId = imageUpload.publicId;
						uploadedPublicIds.push(imageUpload.publicId);
					}
					variantPayloads.push({
						options: v.options,
						sku: v.sku || null,
						price: v.price !== '' ? parseFloat(v.price) : null,
						promotionalPrice: v.promotionalPrice ? parseFloat(v.promotionalPrice) : null,
						promotionalEndDate: v.promotionalEndDate || null,
						stock: parseInt(v.stock) || 0,
						image: image || null,
						imageCloudinaryId: image ? imageCloudinaryId : null,
						gallery: [],
					});
				}
				payload.variants = variantPayloads;
			} else {
				payload.variants = [];
			}

			setSavingProgress('A guardar produto...');
			const data = editingProduct
				? await http.put(`/products/${editingProduct.id}`, payload)
				: await http.post('/products', payload);

			if (data?.success) {
				notyf.success(editingProduct ? 'Produto actualizado!' : 'Produto adicionado!');
				setModalOpen(false);
				onRefresh();
			} else {
				notyf.error(data?.msg || 'Erro ao guardar produto.');
			}
		} catch {
			cleanupUploads(uploadedPublicIds);
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setSaving(false);
			setSavingProgress('');
		}
	};

	const handleDelete = async id => {
		if (!window.confirm('Tem a certeza que quer eliminar este produto?')) return;
		setDeleting(id);
		try {
			const data = await http.delete(`/products/${id}`);
			if (data?.success) {
				notyf.success('Produto eliminado.');
				onRefresh();
			} else {
				notyf.error(data?.msg || 'Erro ao eliminar produto.');
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setDeleting(null);
		}
	};

	const productLabel = () => {
		const total = pagination?.total ?? products.length;
		return `${total} produto${total !== 1 ? 's' : ''} na sua loja.`;
	};

	return (
		<div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-bold text-[#1C1917] font-display">Produtos</h2>
					<p className="text-sm text-[#78716C]">{productLabel()}</p>
				</div>
				<button onClick={openNew}
					className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-dark transition-all cursor-pointer shadow-lg shadow-accent/20">
					<IoAddOutline className="w-4 h-4" /> Adicionar Produto
				</button>
			</div>

			{products.length === 0 ? (
				<EmptyState emoji="🛍️" title="Nenhum produto ainda" description="Adicione o seu primeiro produto para começar a vender."
					action={
						<button onClick={openNew} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-dark transition-colors">
							<IoAddOutline className="w-4 h-4" /> Adicionar Produto
						</button>
					} />
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
						{products.map((product, idx) => (
							<div key={product.id} className="bg-white rounded-2xl border border-accent/10 shadow-md overflow-hidden hover:border-accent/30 hover:shadow-lg transition-all group opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.05 * (idx + 1)}s`, animationFillMode: 'forwards' }}>
								<div className="relative h-40 bg-sand">
									{product.image ? (
										<OptimizedImage src={product.image} alt={product.name} w={600} fit="fill" loading="lazy" decoding="async" className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center text-[#78716C]/30">
											<IoImageOutline className="w-12 h-12" />
										</div>
									)}
									<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<button onClick={() => openEdit(product)}
											className="p-1.5 bg-white rounded-lg shadow text-[#78716C] hover:text-accent hover:bg-orange-50 transition-colors">
											<IoPencilOutline className="w-3.5 h-3.5" />
										</button>
										<button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
											className="p-1.5 bg-white rounded-lg shadow text-[#78716C] hover:text-red-600 hover:bg-red-50 transition-colors">
											{deleting === product.id ? '...' : <IoTrashOutline className="w-3.5 h-3.5" />}
										</button>
									</div>
								</div>
								<div className="p-3">
									<div className="flex items-start justify-between gap-2 mb-1">
										<p className="font-semibold text-[#1C1917] text-sm truncate">{product.name}</p>
										{(() => {
											const st = PRODUCT_STATUS_MAP[product.status] || PRODUCT_STATUS_MAP.pending;
											return <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${st.cls}`}>{st.label}</span>;
										})()}
									</div>
									<div className="flex items-center justify-between mt-1">
										<div>
											{isPromoValid(product) ? (
												<>
													<span className="text-xs text-[#78716C] line-through mr-1">{formatCurrency(product.price)}</span>
													<span className="text-sm font-bold text-green-600">{formatCurrency(product.promotionalPrice)}</span>
												</>
											) : (
												<span className="text-sm font-bold text-[#1C1917]">{formatCurrency(product.price)}</span>
											)}
											{retentionFee > 0 && (
												<p className="text-[10px] text-[#78716C] mt-0.5">
													Taxa {retentionFee}% • Recebe {formatCurrency((product.promotionalPrice && isPromoValid(product) ? product.promotionalPrice : product.price) * ((100 - retentionFee) / 100))}
												</p>
											)}
										</div>
										<span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
										}`}>
											{product.stock > 0 ? `${product.stock} em stock` : 'Sem stock'}
										</span>
									</div>
									{product.promotionalPrice && !isPromoValid(product) && (
										<p className="text-xs text-amber-600 mt-1">⚠ Promoção expirada</p>
									)}
									<div className="flex items-center gap-2 mt-3 pt-3 border-t border-accent/10">
										<button type="button" onClick={() => openEdit(product)}
											className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-accent/20 text-xs font-semibold text-[#78716C] hover:text-accent hover:bg-orange-50 transition-colors cursor-pointer">
											<IoPencilOutline className="w-3.5 h-3.5" /> Editar
										</button>
										<button type="button" onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
											className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
											<IoTrashOutline className="w-3.5 h-3.5" /> {deleting === product.id ? '...' : 'Eliminar'}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					<Pagination page={pagination?.page ?? 1} totalPages={pagination?.totalPages ?? 1} onChange={onPageChange} />
				</>
			)}

			<DashboardModal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="md">
				<div className="flex items-center justify-between px-6 py-4 border-b border-accent/10 sticky top-0 bg-white rounded-t-2xl z-10">
					<h3 className="font-bold text-[#1C1917] font-display">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
					<button type="button" onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-sand transition-colors cursor-pointer">
						<IoCloseOutline className="w-5 h-5 text-[#78716C]" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-7">

					{/* Aviso ao Vendedor */}
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
						<div className="flex gap-3">
							<div className="shrink-0 mt-0.5">
								<svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold text-amber-800">Aviso: Responsabilidade de Entrega</p>
								<p className="text-xs text-amber-700 mt-1">
									Como vendedor, é da sua responsabilidade fazer o produto chegar até à sede da plataforma Kuvangana (quando forem comprados).
									Os custos de transporte até à sede são por sua conta. A plataforma trata da entrega final ao cliente.
								</p>
							</div>
						</div>
					</div>

					{/* Imagens */}
					<div>
						<SectionTitle>Imagens</SectionTitle>
						<div className="space-y-4">
							<ImagePicker label="Imagem Principal" name="productImage" preview={imagePreview}
								onChange={handleImageChange} aspectHint="Recomendado: 800×800 px" />

							{/* Gallery */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#1C1917]">
									Galeria <span className="text-[#78716C] font-normal">(até 8 imagens)</span>
								</label>
								<div className="flex flex-wrap gap-2">
									{/* Existing uploaded images */}
									{existingGallery.map((url, idx) => (
										<div key={`ex-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-accent/10 group/thumb">
											<OptimizedImage src={url} alt="" w={240} fit="fill" loading="lazy" decoding="async" className="w-full h-full object-cover" />
											<button type="button" onClick={() => removeExistingGalleryImage(idx)}
												className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white">
												<IoTrashOutline className="w-4 h-4" />
											</button>
										</div>
									))}
									{/* New files pending upload */}
									{galleryPreviews.map((url, idx) => (
										<div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-accent/30 group/thumb">
											<img src={url} alt="" className="w-full h-full object-cover" />
											<button type="button" onClick={() => removeNewGalleryImage(idx)}
												className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white">
												<IoTrashOutline className="w-4 h-4" />
											</button>
										</div>
									))}
									{/* Add button */}
									{(existingGallery.length + galleryFiles.length) < 8 && (
										<label className="w-20 h-20 rounded-xl border-2 border-dashed border-accent/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-orange-50 transition-all text-[#78716C] text-xs gap-1">
											<IoAddOutline className="w-5 h-5" />
											<span>Adicionar</span>
											<input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryAdd} />
										</label>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Informações Gerais */}
					<div>
						<SectionTitle>Informações Gerais</SectionTitle>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-[#1C1917]">Nome <span className="text-red-500">*</span></label>
								<input type="text" name="name" value={form.name} onChange={handleChange} required
									className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white" placeholder="Nome do produto" />
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-[#1C1917]">Descrição</label>
								<textarea name="description" value={form.description} onChange={handleChange} rows="3"
									className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white resize-none" placeholder="Descreva o produto com detalhes..." />
							</div>
						</div>
					</div>

					{/* Preço & Stock */}
					<div>
						<SectionTitle>Preço & Stock</SectionTitle>
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-sm font-medium text-[#1C1917]">Preço (Kz) <span className="text-red-500">*</span></label>
									<input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01"
										className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white" placeholder="0.00" />
								</div>
								<div className="space-y-1.5">
									<label className="text-sm font-medium text-[#1C1917]">Preço Promocional (Kz)</label>
									<input type="number" name="promotionalPrice" value={form.promotionalPrice} onChange={handleChange} min="0" step="0.01"
										className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white" placeholder="Opcional" />
								</div>
							</div>

							{form.promotionalPrice && (
								<div className="space-y-1.5">
									<label className="text-sm font-medium text-[#1C1917]">Data de fim da promoção</label>
									<input type="date" name="promotionalEndDate" value={form.promotionalEndDate} onChange={handleChange}
										min={minDateLuanda()}
										className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white" />
								</div>
							)}

							<div className="space-y-1.5">
								<label className="text-sm font-medium text-[#1C1917]">Stock <span className="text-red-500">*</span></label>
								<input type="number" name="stock" value={form.stock} onChange={handleChange} required={!hasVariants} min="0"
									disabled={hasVariants}
									className={`w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white ${hasVariants ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="Quantidade disponível" />
								{hasVariants && (
									<p className="text-xs text-accent mt-1">O stock do produto é a soma automática do stock de todas as variantes.</p>
								)}
							</div>
						</div>
					</div>

					{/* Variantes */}
					<div>
						<SectionTitle>Variantes</SectionTitle>
						<div className="space-y-4">
							<label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all bg-white ${hasVariants ? 'border-accent bg-accent/5' : 'border-accent/20 hover:border-accent/40'}`}>
								<input type="checkbox" checked={hasVariants} onChange={e => {
									if (!e.target.checked) removeVariants();
									else setHasVariants(true);
								}} className="w-4 h-4 accent-accent" />
								<div>
									<p className="text-sm font-semibold text-[#1C1917]">Este produto tem variações</p>
									<p className="text-xs text-[#78716C]">Ex: Cor e Tamanho. Cada combinação terá o seu stock, preço e foto.</p>
								</div>
							</label>

							{hasVariants && (
								<>
									{/* Grupos de opções */}
									<div className="space-y-3">
										{optionGroups.map((group, gIdx) => (
											<div key={gIdx} className="bg-sand/50 rounded-2xl p-4 border border-accent/10 space-y-3">
												<div className="flex items-center gap-2">
													<input type="text" value={group.name} onChange={e => handleGroupNameChange(gIdx, e.target.value)}
														className="flex-1 px-3 py-2.5 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm transition-all bg-white" placeholder="Nome do grupo, ex: Cor" />
													<button type="button" onClick={() => removeOptionGroup(gIdx)}
														className="p-2 rounded-xl text-[#78716C] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
														<IoTrashOutline className="w-4 h-4" />
													</button>
												</div>
												<div className="space-y-2">
													{group.values.map((value, vIdx) => (
														<div key={vIdx} className="flex items-center gap-2">
															<input type="text" value={value} onChange={e => handleGroupValueChange(gIdx, vIdx, e.target.value)}
																className="flex-1 px-3 py-2 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm transition-all bg-white" placeholder="Valor, ex: Vermelho" />
															<button type="button" onClick={() => removeGroupValue(gIdx, vIdx)} disabled={group.values.length === 1}
																className="p-2 rounded-xl text-[#78716C] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
																<IoRemoveOutline className="w-4 h-4" />
															</button>
														</div>
													))}
													<button type="button" onClick={() => addGroupValue(gIdx)}
														className="flex items-center gap-1.5 text-sm text-accent font-medium hover:text-accent-dark transition-colors cursor-pointer">
														<IoAddOutline className="w-4 h-4" /> Adicionar valor
													</button>
												</div>
											</div>
										))}
										<button type="button" onClick={addOptionGroup}
											className="flex items-center gap-1.5 text-sm text-accent font-medium hover:text-accent-dark transition-colors cursor-pointer">
											<IoAddOutline className="w-4 h-4" /> Adicionar grupo de opções
										</button>
									</div>

									{/* Gerar combinações */}
									<button type="button" onClick={generateCombinations}
										className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-accent/30 text-sm font-semibold text-accent hover:bg-accent/5 hover:border-accent transition-all cursor-pointer">
										<IoGitBranchOutline className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
									Gerar combinações de variantes
									</button>

									{variants.length > 0 && (
										<p className="text-xs text-[#78716C]">
											{variants.length} {variants.length === 1 ? 'combinação gerada' : 'combinações geradas'} — apague as que não existem.
										</p>
									)}

									{/* Tabela de variantes */}
									{variants.length > 0 && (
										<div className="overflow-x-auto rounded-2xl border border-accent/10">
											<table className="w-full text-sm">
												<thead>
													<tr className="bg-sand text-left text-xs uppercase tracking-wide text-[#78716C]">
														<th className="px-3 py-2">Opções</th>
														<th className="px-2 py-2">Foto</th>
														<th className="px-2 py-2">SKU</th>
														<th className="px-2 py-2">Preço (Kz)</th>
														<th className="px-2 py-2">Promo</th>
														<th className="px-2 py-2">Fim promo</th>
														<th className="px-2 py-2">Stock</th>
														<th className="px-2 py-2"></th>
													</tr>
												</thead>
												<tbody>
													{variants.map((v, idx) => (
														<tr key={idx} className="border-t border-accent/10 align-middle">
															<td className="px-3 py-2 font-medium text-[#1C1917] text-xs">
																{Object.entries(v.options).map(([k, val]) => (
																	<span key={k} className="block">{k}: <span className="text-accent">{val}</span></span>
																))}
															</td>
															<td className="px-2 py-2">
																<div className="relative w-12 h-12 rounded-lg overflow-hidden border border-accent/10 bg-sand">
																	{v.image ? (
																		<OptimizedImage src={v.image} alt="" w={140} fit="fill" loading="lazy" decoding="async" className="w-full h-full object-cover" />
																	) : (
																		<div className="w-full h-full flex items-center justify-center text-[#78716C]/30">
																			<IoImageOutline className="w-5 h-5" />
																		</div>
																	)}
																	<label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
																		<IoCameraOutline className="w-4 h-4 text-white" />
																		<input type="file" accept="image/*" className="hidden" onChange={e => handleVariantImageChange(idx, e)} />
																	</label>
																</div>
															</td>
															<td className="px-2 py-2">
																<input type="text" value={v.sku} onChange={e => handleVariantFieldChange(idx, 'sku', e.target.value)}
																	className="w-20 px-2 py-1.5 rounded-lg border border-accent/20 focus:outline-none focus:border-accent text-xs bg-white" placeholder="SKU" />
															</td>
															<td className="px-2 py-2">
																<input type="number" value={v.price} onChange={e => handleVariantFieldChange(idx, 'price', e.target.value)} min="0" step="0.01"
																	className="w-24 px-2 py-1.5 rounded-lg border border-accent/20 focus:outline-none focus:border-accent text-xs bg-white" placeholder="Herda" />
															</td>
															<td className="px-2 py-2">
																<input type="number" value={v.promotionalPrice} onChange={e => handleVariantFieldChange(idx, 'promotionalPrice', e.target.value)} min="0" step="0.01"
																	className="w-24 px-2 py-1.5 rounded-lg border border-accent/20 focus:outline-none focus:border-accent text-xs bg-white" placeholder="Opcional" />
															</td>
															<td className="px-2 py-2">
																<input type="date" value={v.promotionalEndDate} onChange={e => handleVariantFieldChange(idx, 'promotionalEndDate', e.target.value)} min={minDateLuanda()}
																	className="w-28 px-2 py-1.5 rounded-lg border border-accent/20 focus:outline-none focus:border-accent text-xs bg-white" />
															</td>
															<td className="px-2 py-2">
																<input type="number" value={v.stock} onChange={e => handleVariantFieldChange(idx, 'stock', e.target.value)} min="0"
																	className="w-20 px-2 py-1.5 rounded-lg border border-accent/20 focus:outline-none focus:border-accent text-xs bg-white" />
															</td>
															<td className="px-2 py-2 text-center">
																<button type="button" onClick={() => handleRemoveVariant(idx)}
																	title="Remover esta combinação"
																	className="p-2 rounded-xl text-[#78716C] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
																	<IoTrashOutline className="w-4 h-4" />
																</button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									)}
								</>
							)}
						</div>
					</div>

					{/* Características */}
					<div>
						<SectionTitle>Características</SectionTitle>
						<div className="space-y-2">
							{chars.map((c, idx) => (
								<div key={idx} className="flex gap-2 items-center">
									<input type="text" value={c.key} onChange={e => handleCharChange(idx, 'key', e.target.value)}
										className="flex-1 px-3 py-2.5 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm transition-all bg-white" placeholder="Ex: Cor" />
									<input type="text" value={c.value} onChange={e => handleCharChange(idx, 'value', e.target.value)}
										className="flex-1 px-3 py-2.5 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 text-sm transition-all bg-white" placeholder="Ex: Vermelho" />
									<button type="button" onClick={() => removeChar(idx)} disabled={chars.length === 1}
										className="p-2 rounded-xl text-[#78716C] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
										<IoTrashOutline className="w-4 h-4" />
									</button>
								</div>
							))}
							<button type="button" onClick={addChar}
								className="flex items-center gap-1.5 text-sm text-accent font-medium hover:text-accent-dark transition-colors mt-1 cursor-pointer">
								<IoAddOutline className="w-4 h-4" /> Adicionar característica
							</button>
						</div>
					</div>

					{/* Categorias */}
					<div>
						<SectionTitle>Categorias</SectionTitle>
						{allCategories.length === 0 ? (
							<p className="text-sm text-[#78716C]">Nenhuma categoria disponível.</p>
						) : (
							<div className="flex flex-wrap gap-2">
								{allCategories.map(cat => {
									const selected = selectedCategoryIds.includes(cat.id);
									return (
										<button
											key={cat.id}
											type="button"
											onClick={() => toggleCategory(cat.id)}
											className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer
												${selected
											? 'bg-accent text-white border-accent shadow-sm'
											: 'bg-white text-[#78716C] border-accent/20 hover:border-accent hover:text-accent'
										}`}
										>
											{selected && <IoCheckmarkOutline className="w-3.5 h-3.5" />}
											{cat.name}
										</button>
									);
								})}
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="flex items-center gap-3 pt-1">
						<button type="button" onClick={() => setModalOpen(false)}
							className="flex-1 px-4 py-3 rounded-full border border-accent/20 text-[#78716C] font-medium hover:bg-sand transition-all cursor-pointer">
							Cancelar
						</button>
						<button type="submit" disabled={saving}
							className="flex-1 px-4 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-accent/20">
							{saving ? (savingProgress || 'A guardar...') : (editingProduct ? 'Guardar Alterações' : 'Adicionar Produto')}
						</button>
					</div>
				</form>
			</DashboardModal>
		</div>
	);
};

export default ProductsTab;
