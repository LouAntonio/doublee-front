import React, { useState } from 'react';
import {
	IoAddOutline,
	IoTrashOutline,
	IoPencilOutline,
	IoCloseOutline,
	IoImageOutline,
} from 'react-icons/io5';
import apiRequest, { notyf } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import { uploadToCloudinary } from './constants';
import ImagePicker from './ui/ImagePicker';
import EmptyState from './ui/EmptyState';

const EMPTY_PRODUCT = { name: '', description: '', price: '', promotionalPrice: '', stock: '', image: '' };

const ProductsTab = ({ products, onRefresh }) => {
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
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

export default ProductsTab;
