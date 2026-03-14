import React, { useEffect, useState, useRef } from 'react';
import apiRequest, { notyf } from '../../services/api';

const uploadToCloudinary = async (file, folder) => {
	const auth = await apiRequest(`/cloudinary/authorize-upload-admin?folder=${folder}`, { admin: true });
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

const AdminCategories = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const fileInputRef = useRef(null);

	// Edit states
	const [editingCategory, setEditingCategory] = useState(null);
	const [editCategoryName, setEditCategoryName] = useState('');
	const [editImageFile, setEditImageFile] = useState(null);
	const [editImagePreview, setEditImagePreview] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);
	const editFileInputRef = useRef(null);

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const res = await apiRequest('/categories', { method: 'GET' });
			if (res.success && res.data) {
				console.log(res.data);
				setCategories(res.data.categories || []);
			} else {
				notyf.error(res.msg || 'Erro ao carregar categorias.');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const handleCreateCategory = async (e) => {
		e.preventDefault();
		if (!newCategoryName.trim()) {
			notyf.error('O nome da categoria é obrigatório');
			return;
		}

		setIsCreating(true);
		try {
			let imageUrl = null;
			if (imageFile) {
				notyf.success('A carregar imagem...');
				imageUrl = await uploadToCloudinary(imageFile, 'categories');
			}

			const payload = { name: newCategoryName.trim() };
			if (imageUrl) payload.image = imageUrl;

			const res = await apiRequest('/admin/categories', {
				method: 'POST',
				admin: true,
				body: JSON.stringify(payload)
			});
			if (res.success) {
				notyf.success('Categoria criada com sucesso');
				setNewCategoryName('');
				setImageFile(null);
				setImagePreview('');
				if (fileInputRef.current) fileInputRef.current.value = '';
				fetchCategories();
			} else {
				notyf.error(res.msg);
			}
		} catch (err) {
			console.log(err);
			notyf.error(err.message || 'Erro ao criar categoria.');
		} finally {
			setIsCreating(false);
		}
	};

	const handleEditClick = (category) => {
		setEditingCategory(category);
		setEditCategoryName(category.name);
		setEditImagePreview(category.image || '');
		setEditImageFile(null);
	};

	const handleCancelEdit = () => {
		setEditingCategory(null);
		setEditCategoryName('');
		setEditImagePreview('');
		setEditImageFile(null);
	};

	const handleEditImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setEditImageFile(file);
		setEditImagePreview(URL.createObjectURL(file));
	};

	const handleUpdateCategory = async (e) => {
		e.preventDefault();
		if (!editCategoryName.trim()) {
			notyf.error('O nome da categoria é obrigatório');
			return;
		}

		setIsUpdating(true);
		try {
			let imageUrl = editingCategory.image;
			if (editImageFile) {
				notyf.success('A carregar nova imagem...');
				imageUrl = await uploadToCloudinary(editImageFile, 'categories');
				
				if (editingCategory.image && editingCategory.image.includes('cloudinary.com')) {
					try {
						const parts = editingCategory.image.split('/');
						const filename = parts.pop().split('.')[0];
						const folder = parts.pop();
						const publicId = `${folder}/${filename}`;
						await apiRequest('/admin/cloudinary', {
							method: 'DELETE',
							admin: true,
							body: JSON.stringify({ publicId })
						});
					} catch (e) {
						console.log('Erro ao apagar imagem antiga:', e);
					}
				}
			}

			const payload = { 
				id: editingCategory.id,
				name: editCategoryName.trim(),
				image: imageUrl
			};

			const res = await apiRequest('/admin/categories', {
				method: 'PUT',
				admin: true,
				body: JSON.stringify(payload)
			});

			if (res.success) {
				notyf.success('Categoria atualizada com sucesso');
				handleCancelEdit();
				fetchCategories();
			} else {
				notyf.error(res.msg);
			}
		} catch (err) {
			console.log(err);
			notyf.error(err.message || 'Erro ao atualizar categoria.');
		} finally {
			setIsUpdating(false);
		}
	};

	// --- Skeleton Loader Component ---
	const CategorySkeleton = () => (
		<tr className="animate-pulse border-b border-slate-100 last:border-0">
			<td className="px-6 py-4 whitespace-nowrap w-16">
				<div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="space-y-2">
					<div className="h-4 bg-slate-200 rounded w-48"></div>
					<div className="h-3 bg-slate-100 rounded w-32"></div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right">
				<div className="flex justify-end">
					<div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
				</div>
			</td>
		</tr>
	);

	return (
		<div className="space-y-6 animate-fade-in-up">
			{/* Page Header & Create Form */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
				<div className="max-w-md">
					<h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
						Gestão de Categorias
					</h2>
					<p className="text-sm text-slate-500 mt-1">Crie e organize as categorias de produtos da sua loja.</p>
				</div>

				<form onSubmit={handleCreateCategory} className="flex flex-col lg:flex-row w-full lg:w-auto relative group items-start lg:items-center gap-3">
					<div className="flex items-center gap-3 w-full">
						{imagePreview ? (
							<div className="relative w-10 h-10 shrink-0">
								<img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
								<button type="button" onClick={() => { setImageFile(null); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-rose-600 shadow-sm" title="Remover Imagem">×</button>
							</div>
						) : (
							<button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg border border-slate-200 transition-colors shadow-sm" title="Adicionar Imagem">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
							</button>
						)}
						<input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

						<div className="flex w-full relative">
							<input
								type="text"
								placeholder="Nova categoria..."
								value={newCategoryName}
								onChange={(e) => setNewCategoryName(e.target.value)}
								className="w-full lg:w-64 pl-4 pr-4 py-2.5 rounded-l-xl border border-slate-200 border-r-0 bg-slate-50 text-sm  transition-all outline-none"
							/>
							<button
								type="submit"
								disabled={isCreating}
								className="px-6 py-2.5 whitespace-nowrap border border-transparent text-sm font-semibold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400"
							>
								{isCreating ? (
									<span className="flex items-center gap-2">
										<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
										Processando
									</span>
								) : 'Adicionar'}
							</button>
						</div>
					</div>
				</form>
			</div>

			{/* Categories Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">Imagem</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identificação / Nome da Categoria</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Controle</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-slate-100 relative">
							{loading ? (
								<>
									<CategorySkeleton />
									<CategorySkeleton />
									<CategorySkeleton />
									<CategorySkeleton />
									<CategorySkeleton />
								</>
							) : categories.length > 0 ? (
								categories.map((category) => (
									<tr key={category.id} className="hover:bg-slate-50/80 transition-colors group">
										<td className="px-6 py-4 whitespace-nowrap">
											{category.image ? (
												<img src={category.image} alt={category.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
											) : (
												<div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
													<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
												</div>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex flex-col">
												<div className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{category.name}</div>
												<div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">ID: {category.id}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<button
												onClick={() => handleEditClick(category)}
												className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-all shadow-sm"
											>
												Editar
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="3" className="px-6 py-16 text-center">
										<div className="flex flex-col items-center justify-center text-slate-400">
											<svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
											<p className="text-base font-semibold text-slate-600">Nenhuma categoria encontrada.</p>
											<p className="text-sm mt-1">Comece adicionando uma nova categoria no formulário acima.</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Edit Modal */}
			{editingCategory && (
				<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-fade-in-up">
						<div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
							<h3 className="text-lg font-bold text-slate-800">Editar Categoria</h3>
							<button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 transition-colors">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
							</button>
						</div>
						<form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">Imagem da Categoria</label>
								<div className="flex items-center gap-4">
									{editImagePreview ? (
										<div className="relative w-16 h-16 shrink-0">
											<img src={editImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm" />
											<button type="button" onClick={() => { setEditImageFile(null); setEditImagePreview(''); if (editFileInputRef.current) editFileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-rose-600 shadow-sm transition-colors" title="Remover Imagem">×</button>
										</div>
									) : (
										<div className="w-16 h-16 shrink-0 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
											<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
										</div>
									)}
									<button type="button" onClick={() => editFileInputRef.current?.click()} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
										Alterar Imagem
									</button>
									<input type="file" ref={editFileInputRef} onChange={handleEditImageChange} accept="image/*" className="hidden" />
								</div>
							</div>
							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">Nome da Categoria</label>
								<input
									type="text"
									value={editCategoryName}
									onChange={(e) => setEditCategoryName(e.target.value)}
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
									placeholder="Ex: Eletrônicos"
								/>
							</div>
							<div className="pt-4 flex justify-end gap-3">
								<button type="button" onClick={handleCancelEdit} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
									Cancelar
								</button>
								<button type="submit" disabled={isUpdating} className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-400 flex items-center gap-2">
									{isUpdating ? (
										<>
											<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
											Salvando...
										</>
									) : 'Salvar Alterações'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<style dangerouslySetInnerHTML={{
				__html: `
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in-up {
					animation: fadeInUp 0.4s ease-out forwards;
				}
			`}} />
		</div>
	);
};

export default AdminCategories;
