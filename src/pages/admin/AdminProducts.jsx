import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
	const [search, setSearch] = useState('');
	const [storeId, setStoreId] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [filters, setFilters] = useState({
		featured: '',
		onPromotion: ''
	});

	// Stores state for the filter
	const [stores, setStores] = useState([]);

	// Modals state
	const [detailsModalOpen, setDetailsModalOpen] = useState(false);
	const [selectedProductDetails, setSelectedProductDetails] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);

	const [statusModalOpen, setStatusModalOpen] = useState(false);
	const [selectedProductForStatus, setSelectedProductForStatus] = useState(null);
	const [statusAction, setStatusAction] = useState('active'); // 'active', 'inactive', 'suspended'
	const [motive, setMotive] = useState('');
	const [updatingStatus, setUpdatingStatus] = useState(false);

	const getPromotionEndDate = (promotionalEndDate) => {
		if (!promotionalEndDate) return null;

		const parsedDate = new Date(promotionalEndDate);
		if (Number.isNaN(parsedDate.getTime())) return null;

		// If date comes without time, keep promotion valid until end of that day.
		if (typeof promotionalEndDate === 'string' && !promotionalEndDate.includes('T')) {
			parsedDate.setHours(23, 59, 59, 999);
		}

		return parsedDate;
	};

	const isPromotionValid = (product) => {
		if (!product?.promotionalPrice) return false;

		const promotionEndDate = getPromotionEndDate(product.promotionalEndDate);
		if (!promotionEndDate) return true;

		return promotionEndDate.getTime() >= Date.now();
	};

	const detailsHasValidPromotion = isPromotionValid(selectedProductDetails);

	const fetchProductsAndStores = async () => {
		setLoading(true);
		try {
			// Fetch Products
			let queryProducts = `/admin/products?page=${pagination.page}&limit=${pagination.limit}&search=${search}`;
			if (filters.featured !== '') queryProducts += `&featured=${filters.featured}`;
			if (filters.onPromotion !== '') queryProducts += `&onPromotion=${filters.onPromotion}`;
			if (storeId !== '') queryProducts += `&storeId=${storeId}`;
			if (minPrice !== '') queryProducts += `&minPrice=${minPrice}`;
			if (maxPrice !== '') queryProducts += `&maxPrice=${maxPrice}`;

			const productsRes = await apiRequest(queryProducts, { method: 'GET' });
			if (productsRes.success && productsRes.data) {
				console.log(productsRes);
				setProducts(productsRes.data.products || productsRes.data || []);
				if (productsRes.data.pagination) setPagination((prev) => ({ ...prev, ...productsRes.data.pagination }));
			} else {
				notyf.error(productsRes.msg || 'Erro ao carregar produtos.');
			}

			// Fetch all stores only once if not loaded
			if (stores.length === 0) {
				const storesRes = await apiRequest(`/admin/stores?limit=1000`, { method: 'GET' });
				if (storesRes.success && storesRes.data && storesRes.data.stores) {
					setStores(storesRes.data.stores);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProductsAndStores();
		// eslint-disable-next-line
	}, [pagination.page, filters.featured, filters.onPromotion]);

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination((prev) => ({ ...prev, page: 1 }));
		fetchProductsAndStores();
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
		setPagination(prev => ({ ...prev, page: 1 }));
	};

	const openDetails = async (productId) => {
		setDetailsModalOpen(true);
		setLoadingDetails(true);
		setSelectedProductDetails(null);
		try {
			const res = await apiRequest(`/admin/products/${productId}`, { method: 'GET' });
			if (res.success && res.data) {
				setSelectedProductDetails(res.data);
			} else {
				notyf.error(res.msg || 'Erro ao carregar detalhes do produto.');
				setDetailsModalOpen(false);
			}
		} catch (error) {
			console.error(error);
			setDetailsModalOpen(false);
		} finally {
			setLoadingDetails(false);
		}
	};

	const openStatusModal = (product) => {
		setSelectedProductForStatus(product);
		setStatusAction(product.status || 'active');
		setMotive('');
		setStatusModalOpen(true);
	};

	const confirmStatusChange = async () => {
		if ((statusAction === 'suspended' || statusAction === 'inactive') && !motive.trim()) {
			notyf.error('O motivo é obrigatório para desativar ou suspender um produto.');
			return;
		}

		setUpdatingStatus(true);
		try {
			const res = await apiRequest('/admin/products/status', {
				method: 'PATCH',
				body: JSON.stringify({
					id: selectedProductForStatus.id,
					status: statusAction,
					motive: motive
				})
			});

			if (res.success) {
				notyf.success(res.msg || 'Status atualizado com sucesso.');
				setStatusModalOpen(false);
				fetchProductsAndStores();
			} else {
				notyf.error(res.msg || 'Erro ao atualizar status.');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setUpdatingStatus(false);
		}
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
			{/* Page Header and Filters */}
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
							className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-slate-200 bg-slate-50 text-sm transition-all outline-none"
						/>
						<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-semibold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm focus:outline-none">
							Buscar
						</button>
					</form>
				</div>

				{/* Additional Filters */}
				<div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-slate-600">Destaque:</span>
						<select
							value={filters.featured}
							onChange={(e) => handleFilterChange('featured', e.target.value)}
							className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-slate-50"
						>
							<option value="">Todos</option>
							<option value="true">Sim</option>
							<option value="false">Não</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-slate-600">Promoção:</span>
						<select
							value={filters.onPromotion}
							onChange={(e) => handleFilterChange('onPromotion', e.target.value)}
							className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-slate-50"
						>
							<option value="">Todos</option>
							<option value="true">Sim</option>
							<option value="false">Não</option>
						</select>
					</div>
					<form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 border-l border-slate-200 pl-4 w-full sm:w-auto mt-4 sm:mt-0">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-slate-600">Loja:</span>
							<select
								value={storeId}
								onChange={(e) => setStoreId(e.target.value)}
								className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-slate-50 min-w-[150px] max-w-xs"
							>
								<option value="">Todas</option>
								{stores.map(store => (
									<option key={store.id} value={store.id}>{store.name}</option>
								))}
							</select>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-slate-600">Preço:</span>
							<input
								type="number"
								placeholder="Mín"
								value={minPrice}
								min={0}
								onChange={(e) => setMinPrice(e.target.value)}
								className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-slate-50 w-24"
							/>
							<span className="text-sm text-slate-400">-</span>
							<input
								type="number"
								placeholder="Máx"
								value={maxPrice}
								min={0}
								onChange={(e) => setMaxPrice(e.target.value)}
								className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-slate-50 w-24"
							/>
						</div>
						<button type="submit" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200">
							Aplicar
						</button>
					</form>
				</div>
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produto</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Loja</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preço</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-slate-100 relative">
							{loading ? (
								<>
									<ProductSkeleton />
									<ProductSkeleton />
									<ProductSkeleton />
								</>
							) : products.length > 0 ? (
								products.map((product) => {
									const hasValidPromotion = isPromotionValid(product);

									return (
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
														<div className="flex gap-2 mt-1">
															{product.featured && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Destaque</span>}
															{hasValidPromotion && <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Promo</span>}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit" title={product.store?.name || ''}>
													{product.store?.name || product.storeId.substring(0, 8) + '...'}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-col">
													<span className="text-sm font-bold text-slate-800">
														{Number(hasValidPromotion ? product.promotionalPrice : product.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
													</span>
													{hasValidPromotion && (
														<span className="text-xs line-through text-slate-400">
															{Number(product.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-slate-600">{product.stock} unidades</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<span className={`w-2 h-2 rounded-full ${product.status === 'active' || !product.status ? 'bg-emerald-500' :
														product.status === 'inactive' ? 'bg-slate-500' :
															product.status === 'outOfStock' ? 'bg-amber-500' :
																product.status === 'discontinued' ? 'bg-stone-500' :
																	product.status === 'suspended' ? 'bg-rose-500' :
																		product.status === 'pending' ? 'bg-blue-500' :
																			'bg-slate-300'
													}`}></span>
													<span className={`text-sm font-bold ${product.status === 'active' || !product.status ? 'text-emerald-700' :
														product.status === 'inactive' ? 'text-slate-700' :
															product.status === 'outOfStock' ? 'text-amber-700' :
																product.status === 'discontinued' ? 'text-stone-700' :
																	product.status === 'suspended' ? 'text-rose-700' :
																		product.status === 'pending' ? 'text-blue-700' :
																			'text-slate-500'
													}`}>
														{product.status === 'active' || !product.status ? 'Ativo' :
															product.status === 'inactive' ? 'Inativo' :
																product.status === 'outOfStock' ? 'Sem Stock' :
																	product.status === 'discontinued' ? 'Descontinuado' :
																		product.status === 'suspended' ? 'Suspenso' :
																			product.status === 'pending' ? 'Pendente' :
																				product.status}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<div className="flex justify-end gap-2">
													<button
														onClick={() => openDetails(product.id)}
														className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 hover:border-transparent transition-all shadow-sm"
													>
													Detalhes
													</button>
													<button
														onClick={() => openStatusModal(product)}
														className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white border border-orange-200 hover:border-transparent transition-all shadow-sm"
													>
													Alterar Status
													</button>
												</div>
											</td>
										</tr>
									);
								})
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

			{/* Status Modal */}
			{statusModalOpen && selectedProductForStatus && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
						<div className="p-6 border-b border-slate-100">
							<h3 className="text-xl font-bold text-slate-800">Alterar Status do Produto</h3>
							<p className="text-sm text-slate-500 mt-1">
								Selecione o novo status para o produto <strong>"{selectedProductForStatus.name}"</strong>.
							</p>
						</div>
						<div className="p-6 space-y-4 bg-slate-50">
							<div>
								<label className="block text-sm font-bold text-slate-700 mb-2">Novo Status</label>
								<select
									value={statusAction}
									onChange={(e) => setStatusAction(e.target.value)}
									className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
								>
									<option value="active">Ativo</option>
									<option value="inactive">Inativo</option>
									<option value="outOfStock">Sem Stock</option>
									<option value="discontinued">Descontinuado</option>
									<option value="suspended">Suspenso</option>
									<option value="pending">Pendente</option>
								</select>
							</div>

							{statusAction !== 'active' && (
								<div>
									<label className="block text-sm font-bold text-slate-700 mb-2">Motivo da Ação (Obrigatório)</label>
									<p className="text-xs text-slate-500 mb-2">Este motivo será enviado por email para a loja proprietária do produto.</p>
									<textarea
										value={motive}
										onChange={(e) => setMotive(e.target.value)}
										rows="3"
										className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none resize-none"
										placeholder={`Descreva o motivo de alterar para ${statusAction === 'suspended' ? 'suspenso' : 'inativo'}...`}
										required
									></textarea>
								</div>
							)}
						</div>
						<div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
							<button
								onClick={() => setStatusModalOpen(false)}
								className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
								disabled={updatingStatus}
							>
								Cancelar
							</button>
							<button
								onClick={confirmStatusChange}
								className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2 bg-orange-600 hover:bg-orange-700`}
								disabled={updatingStatus}
							>
								{updatingStatus ? (
									<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
								) : 'Confirmar Alteração'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Details Modal */}
			{detailsModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in-up">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
						<div className="p-6 border-b border-slate-100 flex justify-between items-center">
							<h3 className="text-xl font-bold text-slate-800">Detalhes do Produto</h3>
							<button onClick={() => setDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
							</button>
						</div>

						<div className="p-6 flex-1 overflow-y-auto bg-slate-50">
							{loadingDetails ? (
								<div className="flex flex-col items-center justify-center py-10">
									<svg className="animate-spin h-8 w-8 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
									<p className="text-slate-500 font-medium">A carregar detalhes...</p>
								</div>
							) : selectedProductDetails ? (
								<div className="space-y-6">
									<div className="flex flex-col md:flex-row gap-6 items-start">
										{selectedProductDetails.image ? (
											<img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full md:w-48 h-48 object-cover rounded-xl shadow-sm border border-slate-200" />
										) : (
											<div className="w-full md:w-48 h-48 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">Sem Imagem</div>
										)}

										<div className="flex-1 space-y-4">
											<div>
												<h4 className="text-2xl font-bold text-slate-800">{selectedProductDetails.name}</h4>
												<p className="text-sm text-slate-500 mt-1">{selectedProductDetails.description || 'Sem descrição.'}</p>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preço Base</p>
													<p className="text-lg font-bold text-slate-800">{Number(selectedProductDetails.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
												</div>
												<div className={`p-3 rounded-xl border shadow-sm ${detailsHasValidPromotion ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preço Promo</p>
													<p className={`text-lg font-bold ${detailsHasValidPromotion ? 'text-orange-600' : 'text-slate-800'}`}>
														{detailsHasValidPromotion ? Number(selectedProductDetails.promotionalPrice).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '-'}
													</p>
												</div>
												<div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Atual</p>
													<p className="text-lg font-bold text-slate-800">{selectedProductDetails.stock} uni.</p>
												</div>
												<div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</p>
													<p className="text-sm font-bold text-slate-800 mt-1 capitalize">{selectedProductDetails.status || 'Pendente'}</p>
												</div>
											</div>
										</div>
									</div>

									<div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
										<h5 className="font-bold text-slate-800 mb-2">Informações Adicionais</h5>
										<ul className="text-sm text-slate-600 space-y-2">
											<li><span className="font-semibold text-slate-700">ID da Loja:</span> {selectedProductDetails.storeId}</li>
											<li><span className="font-semibold text-slate-700">Em Destaque:</span> {selectedProductDetails.featured ? 'Sim' : 'Não'}</li>
											<li><span className="font-semibold text-slate-700">Views:</span> {selectedProductDetails.views || 0}</li>
											<li><span className="font-semibold text-slate-700">Vendas:</span> {selectedProductDetails.salesCount || 0}</li>
											<li><span className="font-semibold text-slate-700">Avaliação:</span> {selectedProductDetails.rating} ({selectedProductDetails.qtdRatings} avaliações)</li>
										</ul>
									</div>
								</div>
							) : (
								<p className="text-center text-slate-500 py-10">Não foi possível carregar os detalhes.</p>
							)}
						</div>
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

export default AdminProducts;
