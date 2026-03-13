import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
	const [search, setSearch] = useState('');

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const res = await apiRequest(`/products?page=${pagination.page}&limit=${pagination.limit}&search=${search}`, {
				method: 'GET'
			});
			if (res.success && res.data) {
				setProducts(res.data.products || res.data || []);
				if (res.data.pagination) setPagination((prev) => ({ ...prev, ...res.data.pagination }));
			} else {
				notyf.error(res.msg || 'Erro ao carregar produtos.');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
		// eslint-disable-next-line
	}, [pagination.page]);

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination((prev) => ({ ...prev, page: 1 }));
		fetchProducts();
	};

	const handleSuspendMock = (productId) => {
		console.log(`Simulando suspensão do produto com ID: ${productId}`);
		notyf.success(`Produto suspenso (Simulado)`);
	};

	const handleActivateMock = (productId) => {
		console.log(`Simulando ativação do produto com ID: ${productId}`);
		notyf.success(`Produto activado (Simulado)`);
	};

	// --- Skeleton Loader Component ---
	const ProductSkeleton = () => (
		<tr className="animate-pulse border-b border-slate-100 last:border-0">
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-xl bg-slate-200"></div>
					<div className="space-y-2">
						<div className="h-4 bg-slate-200 rounded w-40"></div>
					</div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-4 bg-slate-200 rounded w-32"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-4 bg-slate-200 rounded w-20"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-4 bg-slate-200 rounded w-12"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-6 w-16 bg-slate-200 rounded-full"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right">
				<div className="flex justify-end gap-2">
					<div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
					<div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
				</div>
			</td>
		</tr>
	);

	return (
		<div className="space-y-6 animate-fade-in-up">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
				<div>
					<h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
						Gestão de Produtos
					</h2>
					<p className="text-sm text-slate-500 mt-1">Visualize e administre o catálogo de produtos da plataforma.</p>
				</div>
				<form onSubmit={handleSearch} className="flex w-full sm:w-auto mt-2 sm:mt-0 relative group">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
					</div>
					<input
						type="text"
						placeholder="Buscar produtos..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
					/>
					<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-semibold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
						Buscar
					</button>
				</form>
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loja (ID)</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preço</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações de Gestão</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-slate-100 relative">
							{loading ? (
								<>
									<ProductSkeleton />
									<ProductSkeleton />
									<ProductSkeleton />
									<ProductSkeleton />
									<ProductSkeleton />
								</>
							) : products.length > 0 ? (
								products.map((product) => (
									<tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-4">
												{product.image ? (
													<img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
												) : (
													<div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-bold flex items-center justify-center uppercase shadow-sm border border-slate-200/50">
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
													</div>
												)}
												<div>
													<div className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate max-w-[200px]" title={product.name}>{product.name}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit">{product.storeId}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-bold text-slate-800">
												{Number(product.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-slate-600">{product.stock} unidades</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<span className={`w-2 h-2 rounded-full ${product.status === 'active' || !product.status ? 'bg-emerald-500' :
													product.status === 'suspended' ? 'bg-rose-500' :
														'bg-amber-500'
												}`}></span>
												<span className={`text-sm font-bold ${product.status === 'active' || !product.status ? 'text-emerald-700' :
													product.status === 'suspended' ? 'text-rose-700' :
														'text-amber-700'
												}`}>
													{product.status === 'active' || !product.status ? 'Ativo' :
														product.status === 'suspended' ? 'Suspenso' : 'Pendente'}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => handleActivateMock(product.id)}
													className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-transparent transition-all shadow-sm"
												>
													Ativar
												</button>
												<button
													onClick={() => handleSuspendMock(product.id)}
													className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-transparent transition-all shadow-sm"
												>
													Suspender
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="px-6 py-16 text-center">
										<div className="flex flex-col items-center justify-center text-slate-400">
											<svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
											<p className="text-base font-semibold text-slate-600">Nenhum produto encontrado.</p>
											<p className="text-sm mt-1">Ainda não existem produtos cadastrados ou a pesquisa não retornou resultados.</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination Controls */}
				{!loading && pagination.totalPages > 1 && (
					<div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
						<button
							disabled={pagination.page <= 1}
							onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
							Anterior
						</button>
						<span className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
							Página <span className="font-bold text-slate-900">{pagination.page}</span> de <span className="font-bold text-slate-900">{pagination.totalPages}</span>
						</span>
						<button
							disabled={pagination.page >= pagination.totalPages}
							onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
						>
							Próxima
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
						</button>
					</div>
				)}
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

export default AdminProducts;
