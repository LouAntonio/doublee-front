import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminCategories = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const res = await apiRequest('/categories', { method: 'GET' });
			if (res.success && res.data) {
				setCategories(res.data);
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

	const handleCreateCategory = async (e) => {
		e.preventDefault();
		if (!newCategoryName.trim()) {
			notyf.error('O nome da categoria é obrigatório');
			return;
		}

		setIsCreating(true);
		try {
			const res = await apiRequest('/categories', {
				method: 'POST',
				admin: true,
				body: JSON.stringify({ name: newCategoryName.trim() })
			});
			if (res.success) {
				notyf.success('Categoria criada com sucesso');
				setNewCategoryName('');
				fetchCategories();
			} else {
				notyf.error(res.msg);
			}
		} catch (err) {
			notyf.error('Erro ao criar categoria.');
		} finally {
			setIsCreating(false);
		}
	};

	const handleDeleteMock = (id) => {
		notyf.success(`Categoria suspensa/excluida (Simulado)`);
	};

	// --- Skeleton Loader Component ---
	const CategorySkeleton = () => (
		<tr className="animate-pulse border-b border-slate-100 last:border-0">
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

				<form onSubmit={handleCreateCategory} className="flex w-full lg:w-auto relative group">
					<input
						type="text"
						placeholder="Nova categoria..."
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						className="w-full lg:w-64 pl-4 pr-4 py-2.5 rounded-l-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
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
				</form>
			</div>

			{/* Categories Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
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
											<div className="flex flex-col">
												<div className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{category.name}</div>
												<div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">ID: {category.id}</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<button
												onClick={() => handleDeleteMock(category.id)}
												className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-transparent transition-all shadow-sm"
											>
												Remover (Simulado)
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="2" className="px-6 py-16 text-center">
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
