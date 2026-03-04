import React, { useState, useEffect, useCallback } from 'react';
import apiRequest, { notyf } from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import {
	IoStorefrontOutline,
	IoGridOutline,
	IoBagCheckOutline,
	IoStatsChartOutline,
	IoCloudUploadOutline,
	IoTrashOutline,
	IoPencilOutline,
	IoAddOutline,
	IoCloseOutline,
	IoCheckmarkOutline,
	IoTimeOutline,
	IoCarOutline,
	IoCheckmarkDoneOutline,
	IoCloseCircleOutline,
	IoAlertCircleOutline,
	IoRefreshOutline,
	IoStarOutline,
	IoImageOutline,
} from 'react-icons/io5';

// ─── Constants ────────────────────────────────────────────────────────────────
const ANGOLA_PROVINCES = [
	'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
	'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
	'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
	'Namibe', 'Uíge', 'Zaire',
];

const ORDER_STATUS_MAP = {
	pending:    { label: 'Pendente',    color: 'amber',  Icon: IoTimeOutline },
	processing: { label: 'Em processo', color: 'blue',   Icon: IoRefreshOutline },
	shipped:    { label: 'Enviado',     color: 'purple', Icon: IoCarOutline },
	delivered:  { label: 'Entregue',   color: 'green',  Icon: IoCheckmarkDoneOutline },
	cancelled:  { label: 'Cancelado',  color: 'red',    Icon: IoCloseCircleOutline },
};

const STATUS_COLOR = {
	amber:  'bg-amber-50 text-amber-700 border border-amber-200',
	blue:   'bg-blue-50 text-blue-700 border border-blue-200',
	purple: 'bg-purple-50 text-purple-700 border border-purple-200',
	green:  'bg-green-50 text-green-700 border border-green-200',
	red:    'bg-red-50 text-red-700 border border-red-200',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uploadToCloudinary = async (file, folder) => {
	const auth = await apiRequest(`/cloudinary/authorize-upload?folder=${folder}`);
	if (!auth.success) throw new Error(auth.message || 'Falha ao autorizar upload.');
	const formData = new FormData();
	formData.append('file', file);
	formData.append('api_key', auth.apikey);
	formData.append('timestamp', auth.timestamp);
	formData.append('signature', auth.signature);
	formData.append('folder', auth.folder);
	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${auth.cloudname}/image/upload`,
		{ method: 'POST', body: formData }
	);
	const result = await response.json();
	if (!response.ok) throw new Error(result?.error?.message || `Cloudinary error ${response.status}`);
	return result.secure_url;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }) => (
	<h3 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-5">{children}</h3>
);

const ImagePicker = ({ label, name, preview, onChange, aspectHint }) => (
	<div className="space-y-2">
		<label className="block text-sm font-medium text-gray-700">{label}</label>
		<label
			className="relative flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden"
			style={{ minHeight: '7rem' }}
		>
			{preview ? (
				<img src={preview} alt={label} className="w-full h-full object-cover absolute inset-0 rounded-2xl" style={{ maxHeight: '10rem' }} />
			) : (
				<div className="flex flex-col items-center justify-center py-6 pointer-events-none px-4 text-center">
					<IoImageOutline className="w-8 h-8 text-gray-400 mb-2" />
					<p className="text-sm text-gray-500">Clique para seleccionar</p>
					{aspectHint && <p className="text-xs text-gray-400 mt-1">{aspectHint}</p>}
				</div>
			)}
			<input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
		</label>
		{preview && <p className="text-xs text-green-600 font-medium">✓ Imagem seleccionada</p>}
	</div>
);

const StatCard = ({ icon, label, value, colorClass }) => {
	const Icon = icon;
	return (
		<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
			<span className={`p-3 rounded-xl ${colorClass}`}>
				<Icon className="w-6 h-6" />
			</span>
			<div>
				<p className="text-xs text-gray-400 font-medium">{label}</p>
				<p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
			</div>
		</div>
	);
};

const EmptyState = ({ emoji, title, description, action }) => (
	<div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
		<span className="text-5xl mb-4 block">{emoji}</span>
		<p className="text-base font-semibold text-gray-700">{title}</p>
		<p className="text-sm text-gray-400 mt-1">{description}</p>
		{action}
	</div>
);

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ store, products, orders }) => {
	const totalRevenue = orders
		.filter(o => o.status === 'delivered')
		.reduce((sum, o) => sum + Number(o.total || 0), 0);

	const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-bold text-gray-900">Visão Geral</h2>
				<p className="text-sm text-gray-400">Resumo da atividade da sua loja.</p>
			</div>

			<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
				<StatCard icon={IoGridOutline}      label="Produtos"         value={products.length}         colorClass="bg-blue-50 text-blue-600" />
				<StatCard icon={IoBagCheckOutline}  label="Encomendas"      value={orders.length}           colorClass="bg-purple-50 text-purple-600" />
				<StatCard icon={IoTimeOutline}      label="Pendentes"        value={pendingOrders}           colorClass="bg-amber-50 text-amber-600" />
				<StatCard icon={IoStatsChartOutline} label="Receita total"  value={formatCurrency(totalRevenue)} colorClass="bg-green-50 text-green-600" />
			</div>

			{/* Store banner preview */}
			{store && (
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					{store.banner ? (
						<img src={store.banner} alt="Banner" className="w-full h-32 object-cover" />
					) : (
						<div className="w-full h-32 bg-gradient-to-r from-primary-600 to-primary-500" />
					)}
					<div className="px-5 py-4 flex items-center gap-4">
						{store.logo ? (
							<img src={store.logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm -mt-9" />
						) : (
							<div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm -mt-9 flex items-center justify-center">
								<IoStorefrontOutline className="w-7 h-7 text-gray-400" />
							</div>
						)}
						<div>
							<p className="font-bold text-gray-900 text-base">{store.name}</p>
							<p className="text-xs text-gray-400">{store.province}{store.location ? ` · ${store.location}` : ''}</p>
						</div>
						<div className="ml-auto flex items-center gap-1 text-amber-500 text-sm font-semibold">
							<IoStarOutline className="w-4 h-4" />
							{Number(store.rating || 0).toFixed(1)}
							<span className="text-gray-400 font-normal ml-1">({store.qtdRatings} avaliações)</span>
						</div>
					</div>
				</div>
			)}

			{/* Recent orders */}
			<div>
				<p className="text-sm font-semibold text-gray-700 mb-3">Encomendas recentes</p>
				{orders.length === 0 ? (
					<EmptyState emoji="📦" title="Sem encomendas ainda" description="As encomendas da sua loja aparecerão aqui." />
				) : (
					<div className="space-y-2">
						{orders.slice(0, 5).map(order => {
							const st = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
							return (
								<div key={order.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
									<div>
										<p className="text-sm font-semibold text-gray-900">#{order.id?.slice(0,8).toUpperCase()}</p>
										<p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('pt-AO', { day:'2-digit', month:'short', year:'numeric' })}</p>
									</div>
									<div className="flex items-center gap-3">
										<span className="font-bold text-sm text-gray-900">{formatCurrency(order.total)}</span>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${STATUS_COLOR[st.color]}`}>
											<st.Icon className="w-3 h-3" />{st.label}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

// ─── Store Info Tab ───────────────────────────────────────────────────────────
const StoreInfoTab = ({ store, onUpdated }) => {
	const [saving, setSaving] = useState(false);
	const [progress, setProgress] = useState('');
	const [form, setForm] = useState({
		name: store?.name || '',
		description: store?.description || '',
		province: store?.province || '',
		location: store?.location || '',
		workingHours: store?.workingHours || '',
		phone: store?.phone || '',
		email: store?.email || '',
		iban: store?.iban || '',
		bankName: store?.bankName || '',
		paypayAccount: store?.paypayAccount || '',
	});
	const [images, setImages] = useState({ logo: null, banner: null });
	const [previews, setPreviews] = useState({ logo: store?.logo || '', banner: store?.banner || '' });

	const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
	const handleImage = e => {
		const { name, files } = e.target;
		const file = files[0];
		if (!file) return;
		setImages(prev => ({ ...prev, [name]: file }));
		setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!form.name.trim()) return notyf.error('O nome da loja é obrigatório.');
		if (!form.province) return notyf.error('Seleccione a província.');
		if (!form.iban.trim()) return notyf.error('O IBAN é obrigatório.');
		if (!form.bankName.trim()) return notyf.error('O nome da conta bancária é obrigatório.');

		setSaving(true);
		try {
			const payload = { ...form };

			if (images.logo) {
				setProgress('A carregar logotipo...');
				payload.logo = await uploadToCloudinary(images.logo, 'storeLogos');
			}
			if (images.banner) {
				setProgress('A carregar banner...');
				payload.banner = await uploadToCloudinary(images.banner, 'storeBanners');
			}

			setProgress('A guardar alterações...');
			const data = await apiRequest('/stores/update', {
				method: 'PUT',
				body: JSON.stringify(payload),
			});

			if (data.success) {
				notyf.success('Informações da loja actualizadas!');
				onUpdated?.();
			} else {
				notyf.error(data.msg || 'Erro ao actualizar loja.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao conectar com o servidor.');
		} finally {
			setSaving(false);
			setProgress('');
		}
	};

	return (
		<div>
			<h2 className="text-lg font-bold text-gray-900 mb-1">Informações da Loja</h2>
			<p className="text-sm text-gray-400 mb-6">Edite os dados públicos e financeiros da sua loja.</p>

			<form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
				<div>
					<SectionTitle>Identidade Visual</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<ImagePicker label="Logotipo" name="logo" preview={previews.logo} onChange={handleImage} aspectHint="Recomendado: 400×400 px" />
						<ImagePicker label="Banner" name="banner" preview={previews.banner} onChange={handleImage} aspectHint="Recomendado: 1200×400 px" />
					</div>
				</div>

				<div>
					<SectionTitle>Informações Gerais</SectionTitle>
					<div className="space-y-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Nome da Loja <span className="text-red-500">*</span></label>
							<input type="text" name="name" value={form.name} onChange={handleChange} required
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Nome da sua marca" />
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Descrição</label>
							<textarea name="description" value={form.description} onChange={handleChange} rows="3"
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Descreva a sua loja brevemente..." />
						</div>
					</div>
				</div>

				<div>
					<SectionTitle>Localização</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Província <span className="text-red-500">*</span></label>
							<select name="province" value={form.province} onChange={handleChange} required
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all bg-white">
								<option value="">Seleccione a província</option>
								{ANGOLA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
							</select>
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Endereço</label>
							<input type="text" name="location" value={form.location} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Bairro, Rua, nº..." />
						</div>
					</div>
				</div>

				<div>
					<SectionTitle>Contacto e Horário</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Email Comercial</label>
							<input type="email" name="email" value={form.email} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="loja@exemplo.com" />
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Telefone Comercial</label>
							<input type="tel" name="phone" value={form.phone} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="+244 9XX XXX XXX" />
						</div>
						<div className="space-y-1.5 md:col-span-2">
							<label className="text-sm font-medium text-gray-700">Horário de Funcionamento</label>
							<input type="text" name="workingHours" value={form.workingHours} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Ex: Seg–Sex 08:00–18:00 | Sáb 08:00–13:00" />
						</div>
					</div>
				</div>

				<div>
					<SectionTitle>Dados de Pagamento</SectionTitle>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">IBAN <span className="text-red-500">*</span></label>
								<input type="text" name="iban" value={form.iban} onChange={handleChange} required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="AO06 0006 0000 XXXX XXXX" />
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">Nome da Conta <span className="text-red-500">*</span></label>
								<input type="text" name="bankName" value={form.bankName} onChange={handleChange} required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Nome tal como consta no banco" />
							</div>
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Número PayPay <span className="text-gray-400 font-normal">(opcional)</span></label>
							<input type="text" name="paypayAccount" value={form.paypayAccount} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Número de telefone associado ao PayPay" />
						</div>
					</div>
				</div>

				<div className="pt-2 flex items-center gap-4">
					<button type="submit" disabled={saving}
						className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-primary-100">
						{saving ? 'A guardar...' : 'Guardar Alterações'}
					</button>
					{saving && progress && <p className="text-sm text-gray-400 animate-pulse">{progress}</p>}
				</div>
			</form>
		</div>
	);
};

// ─── Products Tab ─────────────────────────────────────────────────────────────
const EMPTY_PRODUCT = { name: '', description: '', price: '', promotionalPrice: '', stock: '', image: '' };

const ProductsTab = ({ products, onRefresh }) => {
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null); // null = new
	const [form, setForm] = useState(EMPTY_PRODUCT);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');

	const openNew = () => {
		setEditingProduct(null);
		setForm(EMPTY_PRODUCT);
		setImageFile(null);
		setImagePreview('');
		setModalOpen(true);
	};

	const openEdit = product => {
		setEditingProduct(product);
		setForm({
			name: product.name || '',
			description: product.description || '',
			price: product.price || '',
			promotionalPrice: product.promotionalPrice || '',
			stock: product.stock || '',
			image: product.image || '',
		});
		setImageFile(null);
		setImagePreview(product.image || '');
		setModalOpen(true);
	};

	const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

	const handleImageChange = e => {
		const file = e.target.files[0];
		if (!file) return;
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!form.name.trim()) return notyf.error('O nome do produto é obrigatório.');
		if (!form.price) return notyf.error('O preço é obrigatório.');
		if (!form.stock && form.stock !== 0) return notyf.error('O stock é obrigatório.');

		setSaving(true);
		try {
			const payload = {
				name: form.name.trim(),
				description: form.description.trim() || null,
				price: parseFloat(form.price),
				promotionalPrice: form.promotionalPrice ? parseFloat(form.promotionalPrice) : null,
				stock: parseInt(form.stock),
			};

			if (imageFile) {
				payload.image = await uploadToCloudinary(imageFile, 'products');
			} else if (form.image) {
				payload.image = form.image;
			}

			let data;
			if (editingProduct) {
				data = await apiRequest(`/stores/products/${editingProduct.id}`, {
					method: 'PUT',
					body: JSON.stringify(payload),
				});
			} else {
				data = await apiRequest('/stores/products', {
					method: 'POST',
					body: JSON.stringify(payload),
				});
			}

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
								<p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
								<div className="flex items-center justify-between mt-1">
									<div>
										{product.promotionalPrice ? (
											<>
												<span className="text-xs text-gray-400 line-through mr-1">{formatCurrency(product.price)}</span>
												<span className="text-sm font-bold text-green-600">{formatCurrency(product.promotionalPrice)}</span>
											</>
										) : (
											<span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
										)}
									</div>
									<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
										{product.stock > 0 ? `${product.stock} em stock` : 'Sem stock'}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Product Modal */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
							<h3 className="font-bold text-gray-900">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
							<button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
								<IoCloseOutline className="w-5 h-5" />
							</button>
						</div>
						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							{/* Image */}
							<ImagePicker label="Imagem do Produto" name="productImage" preview={imagePreview}
								onChange={handleImageChange} aspectHint="Recomendado: 800×800 px" />

							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">Nome <span className="text-red-500">*</span></label>
								<input type="text" name="name" value={form.name} onChange={handleChange} required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Nome do produto" />
							</div>

							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">Descrição</label>
								<textarea name="description" value={form.description} onChange={handleChange} rows="3"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Descreva o produto..." />
							</div>

							<div className="grid grid-cols-2 gap-4">
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

							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">Stock <span className="text-red-500">*</span></label>
								<input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Quantidade disponível" />
							</div>

							<div className="flex items-center gap-3 pt-2">
								<button type="button" onClick={() => setModalOpen(false)}
									className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all cursor-pointer">
									Cancelar
								</button>
								<button type="submit" disabled={saving}
									className="flex-1 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-60 cursor-pointer">
									{saving ? 'A guardar...' : (editingProduct ? 'Guardar' : 'Adicionar')}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

// ─── Orders Tab ───────────────────────────────────────────────────────────────
const OrdersTab = ({ orders, onRefresh }) => {
	const [updatingId, setUpdatingId] = useState(null);

	const handleStatusChange = async (orderId, newStatus) => {
		setUpdatingId(orderId);
		try {
			const data = await apiRequest(`/stores/orders/${orderId}/status`, {
				method: 'PATCH',
				body: JSON.stringify({ status: newStatus }),
			});
			if (data.success) {
				notyf.success('Estado actualizado!');
				onRefresh();
			} else {
				notyf.error(data.msg || 'Erro ao actualizar estado.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao conectar com o servidor.');
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-lg font-bold text-gray-900">Encomendas</h2>
				<p className="text-sm text-gray-400">{orders.length} encomenda{orders.length !== 1 ? 's' : ''} recebidas.</p>
			</div>

			{orders.length === 0 ? (
				<EmptyState emoji="📦" title="Sem encomendas ainda" description="Quando os clientes fizerem encomendas, aparecerão aqui." />
			) : (
				<div className="space-y-3">
					{orders.map(order => {
						const st = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
						return (
							<div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-gray-900 text-sm">Encomenda #{order.id?.slice(0, 8).toUpperCase()}</p>
										<p className="text-xs text-gray-400 mt-0.5">
											{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 mt-1 ${STATUS_COLOR[st.color]}`}>
											<st.Icon className="w-3 h-3" /> {st.label}
										</span>
									</div>
								</div>

								{/* Order Items */}
								{order.items && order.items.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-3 space-y-2">
										{order.items.map(item => (
											<div key={item.id} className="flex items-center justify-between text-xs">
												<div className="flex items-center gap-2">
													{item.product?.image && (
														<img src={item.product.image} alt={item.product?.name} className="w-7 h-7 rounded-lg object-cover" />
													)}
													<span className="text-gray-700 font-medium">{item.product?.name || 'Produto'}</span>
													<span className="text-gray-400">x{item.quantity}</span>
												</div>
												<span className="text-gray-900 font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</span>
											</div>
										))}
									</div>
								)}

								{/* Status Changer */}
								<div className="flex items-center gap-2 pt-1">
									<span className="text-xs text-gray-500 font-medium">Alterar estado:</span>
									<div className="flex flex-wrap gap-1.5">
										{Object.entries(ORDER_STATUS_MAP).map(([key, val]) => (
											<button
												key={key}
												onClick={() => order.status !== key && handleStatusChange(order.id, key)}
												disabled={order.status === key || updatingId === order.id}
												className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all border cursor-pointer disabled:cursor-not-allowed ${
													order.status === key
														? `${STATUS_COLOR[val.color]} opacity-100`
														: 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 opacity-60 hover:opacity-100'
												}`}
											>
												{updatingId === order.id && order.status !== key ? '...' : val.label}
											</button>
										))}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

// ─── Main StoreDashboard ───────────────────────────────────────────────────────
const TABS = [
	{ id: 'overview',  label: 'Visão Geral',   icon: IoStatsChartOutline },
	{ id: 'info',      label: 'Informações',   icon: IoStorefrontOutline },
	{ id: 'products',  label: 'Produtos',      icon: IoGridOutline },
	{ id: 'orders',    label: 'Encomendas',    icon: IoBagCheckOutline },
];

const StoreDashboard = () => {
	const [activeTab, setActiveTab] = useState('overview');
	const [store, setStore]         = useState(null);
	const [products, setProducts]   = useState([]);
	const [orders, setOrders]       = useState([]);
	const [loading, setLoading]     = useState(true);
	const [error, setError]         = useState(null);

	const fetchAll = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [storeRes, productsRes, ordersRes] = await Promise.all([
				apiRequest('/stores/mine', { method: 'GET' }),
				apiRequest('/stores/products', { method: 'GET' }),
				apiRequest('/stores/orders', { method: 'GET' }),
			]);

			if (storeRes.success)    setStore(storeRes.data?.store || storeRes.data || null);
			if (productsRes.success) setProducts(productsRes.data?.products || productsRes.data || []);
			if (ordersRes.success)   setOrders(ordersRes.data?.orders || ordersRes.data || []);
		} catch (err) {
			setError('Não foi possível carregar os dados da loja.');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { fetchAll(); }, [fetchAll]);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-3">
				<div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
				<p className="text-sm text-gray-400">A carregar dados da loja...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
				<IoAlertCircleOutline className="w-12 h-12 text-red-400" />
				<p className="text-base font-semibold text-gray-700">{error}</p>
				<button onClick={fetchAll} className="mt-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
					Tentar novamente
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-0">
			{/* Inner Tab Bar */}
			<div className="flex gap-1 bg-gray-50 rounded-2xl p-1 mb-6 overflow-x-auto">
				{TABS.map(tab => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-1 justify-center ${
								activeTab === tab.id
									? 'bg-white text-primary-700 shadow-sm border border-gray-100'
									: 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
							}`}
						>
							<Icon className="w-4 h-4 shrink-0" />
							<span className="hidden sm:inline">{tab.label}</span>
						</button>
					);
				})}
			</div>

			{/* Tab Content */}
			{activeTab === 'overview' && (
				<OverviewTab store={store} products={products} orders={orders} />
			)}
			{activeTab === 'info' && (
				<StoreInfoTab store={store} onUpdated={fetchAll} />
			)}
			{activeTab === 'products' && (
				<ProductsTab products={products} onRefresh={fetchAll} />
			)}
			{activeTab === 'orders' && (
				<OrdersTab orders={orders} onRefresh={fetchAll} />
			)}
		</div>
	);
};

export default StoreDashboard;
