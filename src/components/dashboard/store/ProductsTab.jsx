import React, { useState, useEffect } from 'react';
import {
	IoAddOutline,
	IoTrashOutline,
	IoPencilOutline,
	IoCloseOutline,
	IoImageOutline,
	IoCheckmarkOutline,
} from 'react-icons/io5';
import apiRequest, { notyf } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import { uploadToCloudinary } from './constants';
import ImagePicker from './ui/ImagePicker';
import EmptyState from './ui/EmptyState';
import SectionTitle from './ui/SectionTitle';

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
	active:       { label: 'Activo',        cls: 'bg-green-50 text-green-700 border-green-200' },
	inactive:     { label: 'Inactivo',      cls: 'bg-gray-100 text-gray-500 border-gray-200' },
	outOfStock:   { label: 'Sem stock',     cls: 'bg-orange-50 text-orange-700 border-orange-200' },
	discontinued: { label: 'Descontinuado', cls: 'bg-red-50 text-red-600 border-red-200' },
	suspended:    { label: 'Suspenso',      cls: 'bg-red-100 text-red-700 border-red-300' },
	pending:      { label: 'Pendente',      cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const isPromoValid = product => {
	if (!product.promotionalPrice) return false;
	if (!product.promotionalEndDate) return true;
	return new Date(product.promotionalEndDate) >= new Date();
};

const ProductsTab = ({ products, onRefresh }) => {
	const [saving, setSaving] = useState(false);
	const [savingProgress, setSavingProgress] = useState('');
	const [deleting, setDeleting] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	// Categories
	const [allCategories, setAllCategories] = useState([]);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

	useEffect(() => {
		apiRequest('/categories', { method: 'GET' })
			.then(res => { if (res.success) setAllCategories(res.data?.categories || []); })
			.catch(() => {});
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

	// Characteristics
	const [chars, setChars] = useState([{ key: '', value: '' }]);

	const resetModal = () => {
		setForm(EMPTY_PRODUCT);
		setImageFile(null);
		setImagePreview('');
		setGalleryFiles([]);
		setGalleryPreviews([]);
		setExistingGallery([]);
		setChars([{ key: '', value: '' }]);
		setSelectedCategoryIds([]);
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
				? new Date(product.promotionalEndDate).toISOString().slice(0, 10)
				: '',
			stock: product.stock || '',
		});
		setImageFile(null);
		setImagePreview(product.image || '');
		setGalleryFiles([]);
		setGalleryPreviews([]);
		setExistingGallery(Array.isArray(product.gallery) ? product.gallery : []);
		setChars(normalizeChars(product.characteristics).length > 0
			? normalizeChars(product.characteristics)
			: [{ key: '', value: '' }]);
		setSelectedCategoryIds(Array.isArray(product.categories) ? product.categories.map(c => c.id) : []);
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
		if (form.stock === '' || form.stock === null) return notyf.error('O stock é obrigatório.');
		if (form.promotionalPrice && parseFloat(form.promotionalPrice) >= parseFloat(form.price))
			return notyf.error('O preço promocional deve ser inferior ao preço normal.');

		setSaving(true);
		try {
			const payload = {
				name: form.name.trim(),
				description: form.description.trim() || null,
				price: parseFloat(form.price),
				promotionalPrice: form.promotionalPrice ? parseFloat(form.promotionalPrice) : null,
				promotionalEndDate: form.promotionalEndDate || null,
				stock: parseInt(form.stock),
			};

			// Cover image
			if (imageFile) {
				setSavingProgress('A carregar imagem principal...');
				payload.image = await uploadToCloudinary(imageFile, 'products');
			} else {
				payload.image = imagePreview || null;
			}

			// Gallery — upload new files
			const uploadedGallery = [];
			for (let i = 0; i < galleryFiles.length; i++) {
				setSavingProgress(`A carregar galeria (${i + 1}/${galleryFiles.length})...`);
				const url = await uploadToCloudinary(galleryFiles[i], 'products');
				uploadedGallery.push(url);
			}
			payload.gallery = [...existingGallery, ...uploadedGallery];

			// Characteristics — filter out blank rows, convert to object
			const filledChars = chars.filter(c => c.key.trim() && c.value.trim());
			payload.characteristics = filledChars.length > 0
				? Object.fromEntries(filledChars.map(c => [c.key.trim(), c.value.trim()]))
				: null;

			payload.categoryIds = selectedCategoryIds;

			setSavingProgress('A guardar produto...');
			const data = editingProduct
				? await apiRequest(`/stores/products/${editingProduct.id}`, { method: 'PUT', body: JSON.stringify(payload) })
				: await apiRequest('/stores/products', { method: 'POST', body: JSON.stringify(payload) });

			if (data.success) {
				notyf.success(editingProduct ? 'Produto actualizado!' : 'Produto adicionado!');
				setModalOpen(false);
				onRefresh();
			} else {
				notyf.error(data.msg || 'Erro ao guardar produto.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao conectar com o servidor.');
		} finally {
			setSaving(false);
			setSavingProgress('');
		}
	};

	const handleDelete = async id => {
		if (!window.confirm('Tem a certeza que quer eliminar este produto?')) return;
		setDeleting(id);
		try {
			const data = await apiRequest(`/stores/products/${id}`, { method: 'DELETE' });
			if (data.success) {
				notyf.success('Produto eliminado.');
				onRefresh();
			} else {
				notyf.error(data.msg || 'Erro ao eliminar produto.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao conectar com o servidor.');
		} finally {
			setDeleting(null);
		}
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-lg font-bold text-gray-900">Produtos</h2>
					<p className="text-sm text-gray-400">{products.length} produto{products.length !== 1 ? 's' : ''} na sua loja.</p>
				</div>
				<button onClick={openNew}
					className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all cursor-pointer shadow-lg shadow-primary-100">
					<IoAddOutline className="w-4 h-4" /> Adicionar Produto
				</button>
			</div>

			{products.length === 0 ? (
				<EmptyState emoji="🛍️" title="Nenhum produto ainda" description="Adicione o seu primeiro produto para começar a vender."
					action={
						<button onClick={openNew} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
							<IoAddOutline className="w-4 h-4" /> Adicionar Produto
						</button>
					} />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
					{products.map(product => (
						<div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-primary-200 hover:shadow-md transition-all group">
							<div className="relative h-40 bg-gray-50">
								{product.image ? (
									<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-200">
										<IoImageOutline className="w-12 h-12" />
									</div>
								)}
								<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<button onClick={() => openEdit(product)}
										className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
										<IoPencilOutline className="w-3.5 h-3.5" />
									</button>
									<button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
										className="p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors">
										{deleting === product.id ? '...' : <IoTrashOutline className="w-3.5 h-3.5" />}
									</button>
								</div>
							</div>
							<div className="p-3">
								<div className="flex items-start justify-between gap-2 mb-1">
									<p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
									{(() => {
										const st = PRODUCT_STATUS_MAP[product.status] || PRODUCT_STATUS_MAP.pending;
										return <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${st.cls}`}>{st.label}</span>;
									})()}
								</div>
								<div className="flex items-center justify-between mt-1">
									<div>
										{isPromoValid(product) ? (
											<>
												<span className="text-xs text-gray-400 line-through mr-1">{formatCurrency(product.price)}</span>
												<span className="text-sm font-bold text-green-600">{formatCurrency(product.promotionalPrice)}</span>
											</>
										) : (
											<span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
										)}
									</div>
									<span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
										product.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
									}`}>
										{product.stock > 0 ? `${product.stock} em stock` : 'Sem stock'}
									</span>
								</div>
								{product.promotionalPrice && !isPromoValid(product) && (
									<p className="text-xs text-amber-600 mt-1">⚠ Promoção expirada</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* ── Product Modal ──────────────────────────────────────────── */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/50 overflow-y-auto">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-10">
						<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
							<h3 className="font-bold text-gray-900">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
							<button type="button" onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
								<IoCloseOutline className="w-5 h-5" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-7">

							{/* Imagens */}
							<div>
								<SectionTitle>Imagens</SectionTitle>
								<div className="space-y-4">
									<ImagePicker label="Imagem Principal" name="productImage" preview={imagePreview}
										onChange={handleImageChange} aspectHint="Recomendado: 800×800 px" />

									{/* Gallery */}
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											Galeria <span className="text-gray-400 font-normal">(até 8 imagens)</span>
										</label>
										<div className="flex flex-wrap gap-2">
											{/* Existing uploaded images */}
											{existingGallery.map((url, idx) => (
												<div key={`ex-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group/thumb">
													<img src={url} alt="" className="w-full h-full object-cover" />
													<button type="button" onClick={() => removeExistingGalleryImage(idx)}
														className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white">
														<IoTrashOutline className="w-4 h-4" />
													</button>
												</div>
											))}
											{/* New files pending upload */}
											{galleryPreviews.map((url, idx) => (
												<div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-primary-300 group/thumb">
													<img src={url} alt="" className="w-full h-full object-cover" />
													<button type="button" onClick={() => removeNewGalleryImage(idx)}
														className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white">
														<IoTrashOutline className="w-4 h-4" />
													</button>
												</div>
											))}
											{/* Add button */}
											{(existingGallery.length + galleryFiles.length) < 8 && (
												<label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all text-gray-400 text-xs gap-1">
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
										<label className="text-sm font-medium text-gray-700">Nome <span className="text-red-500">*</span></label>
										<input type="text" name="name" value={form.name} onChange={handleChange} required
											className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Nome do produto" />
									</div>
									<div className="space-y-1.5">
										<label className="text-sm font-medium text-gray-700">Descrição</label>
										<textarea name="description" value={form.description} onChange={handleChange} rows="3"
											className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all resize-none" placeholder="Descreva o produto com detalhes..." />
									</div>
								</div>
							</div>

							{/* Preço & Stock */}
							<div>
								<SectionTitle>Preço & Stock</SectionTitle>
								<div className="space-y-4">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="space-y-1.5">
											<label className="text-sm font-medium text-gray-700">Preço (Kz) <span className="text-red-500">*</span></label>
											<input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01"
												className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="0.00" />
										</div>
										<div className="space-y-1.5">
											<label className="text-sm font-medium text-gray-700">Preço Promocional (Kz)</label>
											<input type="number" name="promotionalPrice" value={form.promotionalPrice} onChange={handleChange} min="0" step="0.01"
												className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Opcional" />
										</div>
									</div>

									{form.promotionalPrice && (
										<div className="space-y-1.5">
											<label className="text-sm font-medium text-gray-700">Data de fim da promoção</label>
											<input type="date" name="promotionalEndDate" value={form.promotionalEndDate} onChange={handleChange}
												min={new Date().toISOString().slice(0, 10)}
												className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" />
										</div>
									)}

									<div className="space-y-1.5">
										<label className="text-sm font-medium text-gray-700">Stock <span className="text-red-500">*</span></label>
										<input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
											className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Quantidade disponível" />
									</div>
								</div>
							</div>

							{/* Características */}
							<div>
								<SectionTitle>Características</SectionTitle>
								<div className="space-y-2">
									{chars.map((c, idx) => (
										<div key={idx} className="flex gap-2 items-center">
											<input type="text" value={c.key} onChange={e => handleCharChange(idx, 'key', e.target.value)}
												className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm transition-all" placeholder="Ex: Cor" />
											<input type="text" value={c.value} onChange={e => handleCharChange(idx, 'value', e.target.value)}
												className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none text-sm transition-all" placeholder="Ex: Vermelho" />
											<button type="button" onClick={() => removeChar(idx)} disabled={chars.length === 1}
												className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
												<IoTrashOutline className="w-4 h-4" />
											</button>
										</div>
									))}
									<button type="button" onClick={addChar}
										className="flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors mt-1 cursor-pointer">
										<IoAddOutline className="w-4 h-4" /> Adicionar característica
									</button>
								</div>
							</div>

							{/* Categorias */}
							<div>
								<SectionTitle>Categorias</SectionTitle>
								{allCategories.length === 0 ? (
									<p className="text-sm text-gray-400">Nenhuma categoria disponível.</p>
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
													? 'bg-primary-600 text-white border-primary-600 shadow-sm'
													: 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
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
									className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all cursor-pointer">
									Cancelar
								</button>
								<button type="submit" disabled={saving}
									className="flex-1 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-60 cursor-pointer">
									{saving ? (savingProgress || 'A guardar...') : (editingProduct ? 'Guardar Alterações' : 'Adicionar Produto')}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductsTab;
