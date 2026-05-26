import React, { useState } from 'react';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';
import { useAdminProductsList, useAdminAllStores, useUpdateProductStatus } from '../../hooks/queries/useAdminProducts';
import Modal from '../../components/admin/Modal';

const isPromotionValid = (product, now) => {
	if (!product?.promotionalPrice) return false;

	const promotionEndDate = getPromotionEndDate(product.promotionalEndDate);
	if (!promotionEndDate) return true;

	return promotionEndDate.getTime() >= now;
};

const getPromotionEndDate = (promotionalEndDate) => {
	if (!promotionalEndDate) return null;

	const parsedDate = new Date(promotionalEndDate);
	if (Number.isNaN(parsedDate.getTime())) return null;

	if (typeof promotionalEndDate === 'string' && !promotionalEndDate.includes('T')) {
		parsedDate.setHours(23, 59, 59, 999);
	}

	return parsedDate;
};

const ProductSkeleton = () => (
	<tr className="animate-pulse border-b border-accent/10 last:border-0">
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="flex items-center gap-4">
				<div className="w-10 h-10 rounded-xl bg-accent/20"></div>
				<div className="space-y-2">
					<div className="h-4 bg-accent/20 rounded w-40"></div>
				</div>
			</div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="h-4 bg-accent/20 rounded w-32"></div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="h-4 bg-accent/20 rounded w-20"></div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="h-4 bg-accent/20 rounded w-12"></div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="h-6 w-16 bg-accent/20 rounded-full"></div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap text-right">
			<div className="flex justify-end gap-2">
				<div className="h-8 w-16 bg-accent/20 rounded-lg"></div>
				<div className="h-8 w-16 bg-accent/20 rounded-lg"></div>
			</div>
		</td>
	</tr>
);

const AdminProducts = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [storeId, setStoreId] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [filters, setFilters] = useState({
		featured: '',
		onPromotion: ''
	});

	const { data: productsData, isLoading: loading } = useAdminProductsList({
		page, limit: 10, search, filters, storeId, minPrice, maxPrice
	});
	const { data: stores = [] } = useAdminAllStores();
	const updateProductStatus = useUpdateProductStatus();

	const products = productsData?.products || [];
	const pagination = productsData?.pagination || { page: 1, limit: 10, totalPages: 1 };

	const [detailsModalOpen, setDetailsModalOpen] = useState(false);
	const [selectedProductDetails, setSelectedProductDetails] = useState(null);
	const [loadingDetails, setLoadingDetails] = useState(false);

	const [statusModalOpen, setStatusModalOpen] = useState(false);
	const [selectedProductForStatus, setSelectedProductForStatus] = useState(null);
	const [statusAction, setStatusAction] = useState('active');
	const [motive, setMotive] = useState('');
	const [updatingStatus, setUpdatingStatus] = useState(false);

	const [currentTime] = useState(() => Date.now());

	const detailsHasValidPromotion = isPromotionValid(selectedProductDetails, currentTime);

	const handleSearch = (e) => {
		e.preventDefault();
		setPage(1);
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
		setPage(1);
	};

	const openDetails = async (productId) => {
		setDetailsModalOpen(true);
		setLoadingDetails(true);
		setSelectedProductDetails(null);
		try {
			const res = await http.get(`/admin/products/${productId}`);
			if (res?.success && res.data) {
				setSelectedProductDetails(res.data);
			} else {
				notyf.error(res?.msg || 'Erro ao carregar detalhes do produto.');
				setDetailsModalOpen(false);
			}
		} catch {
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
			await updateProductStatus.mutateAsync({
				id: selectedProductForStatus.id,
				status: statusAction,
				motive
			});
			setStatusModalOpen(false);
		} catch {
			// handled by mutation
		} finally {
			setUpdatingStatus(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header and Filters */}
			<div className="bg-white p-6 rounded-2xl shadow-sm border border-accent/10 flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h2 className="text-2xl font-display font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
							<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
							Gestão de Produtos
						</h2>
						<p className="text-sm text-[#78716C] mt-1">Visualize e administre o catálogo de produtos da plataforma.</p>
					</div>
					<form onSubmit={handleSearch} className="flex w-full sm:w-auto mt-2 sm:mt-0 relative group">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C] group-focus-within:text-accent transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
						</div>
						<input
							type="text"
							placeholder="Buscar produtos..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-accent/20 bg-sand/50 text-sm transition-all outline-none"
						/>
						<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-display font-semibold rounded-r-xl text-white bg-accent hover:bg-accent-dark transition-colors shadow-sm focus:outline-none">
							Buscar
						</button>
					</form>
				</div>

				{/* Additional Filters */}
				<div className="flex flex-wrap gap-4 pt-4 border-t border-accent/10">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-[#78716C]">Destaque:</span>
						<select
							value={filters.featured}
							onChange={(e) => handleFilterChange('featured', e.target.value)}
							className="text-sm border border-accent/20 rounded-lg px-3 py-1.5 outline-none bg-sand/50"
						>
							<option value="">Todos</option>
							<option value="true">Sim</option>
							<option value="false">Não</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-[#78716C]">Promoção:</span>
						<select
							value={filters.onPromotion}
							onChange={(e) => handleFilterChange('onPromotion', e.target.value)}
							className="text-sm border border-accent/20 rounded-lg px-3 py-1.5 outline-none bg-sand/50"
						>
							<option value="">Todos</option>
							<option value="true">Sim</option>
							<option value="false">Não</option>
						</select>
					</div>
					<form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 border-l border-accent/20 pl-4 w-full sm:w-auto mt-4 sm:mt-0">
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-[#78716C]">Loja:</span>
							<select
								value={storeId}
								onChange={(e) => setStoreId(e.target.value)}
								className="text-sm border border-accent/20 rounded-lg px-3 py-1.5 outline-none bg-sand/50 min-w-[150px] max-w-xs"
							>
								<option value="">Todas</option>
								{stores.map(store => (
									<option key={store.id} value={store.id}>{store.name}</option>
								))}
							</select>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-[#78716C]">Preço:</span>
							<input
								type="number"
								placeholder="Mín"
								value={minPrice}
								min={0}
								onChange={(e) => setMinPrice(e.target.value)}
								className="text-sm border border-accent/20 rounded-lg px-3 py-1.5 outline-none bg-sand/50 w-24"
							/>
							<span className="text-sm text-[#78716C]">-</span>
							<input
								type="number"
								placeholder="Máx"
								value={maxPrice}
								min={0}
								onChange={(e) => setMaxPrice(e.target.value)}
								className="text-sm border border-accent/20 rounded-lg px-3 py-1.5 outline-none bg-sand/50 w-24"
							/>
						</div>
						<button type="submit" className="px-3 py-1.5 bg-sand hover:bg-accent/20 text-[#1C1917] text-sm font-display font-semibold rounded-lg transition-colors border border-accent/20">
							Aplicar
						</button>
					</form>
				</div>
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-accent/10 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-sand/50/80 border-b border-accent/10">
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Produto</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Loja</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Preço</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Stock</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Status</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider text-right">Ações</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-accent/10 relative">
							{loading ? (
								<>
									<ProductSkeleton />
									<ProductSkeleton />
									<ProductSkeleton />
								</>
							) : products.length > 0 ? (
								products.map((product) => {
									const hasValidPromotion = isPromotionValid(product, currentTime);

									return (
										<tr key={product.id} className="hover:bg-sand/50/80 transition-colors group">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-4">
													{product.image ? (
														<img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover border border-accent/20 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src = '/images/produto.png'; }} />
													) : (
														<div className="w-10 h-10 rounded-xl bg-sand text-[#78716C] font-bold flex items-center justify-center uppercase shadow-sm border border-accent/20/50">
															<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
														</div>
													)}
													<div>
														<div className="text-sm font-bold text-[#1C1917] group-hover:text-accent-dark transition-colors truncate max-w-[200px]" title={product.name}>{product.name}</div>
														<div className="flex gap-2 mt-1">
															{product.featured && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Destaque</span>}
															{hasValidPromotion && <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Promo</span>}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-xs font-mono text-[#78716C] bg-sand/50 px-2 py-1 rounded border border-accent/20 w-fit" title={product.store?.name || ''}>
													{product.store?.name || product.storeId.substring(0, 8) + '...'}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-col">
													<span className="text-sm font-bold text-[#1C1917]">
														{Number(hasValidPromotion ? product.promotionalPrice : product.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
													</span>
													{hasValidPromotion && (
														<span className="text-xs line-through text-[#78716C]">
															{Number(product.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-[#78716C]">{product.stock} unidades</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<span className={`w-2 h-2 rounded-full ${product.status === 'active' || !product.status ? 'bg-emerald-500' :
														product.status === 'inactive' ? 'bg-sand/500' :
															product.status === 'outOfStock' ? 'bg-amber-500' :
																product.status === 'discontinued' ? 'bg-stone-500' :
																	product.status === 'suspended' ? 'bg-rose-500' :
																		product.status === 'pending' ? 'bg-blue-500' :
																			'bg-accent/30'
													}`}></span>
													<span className={`text-sm font-bold ${product.status === 'active' || !product.status ? 'text-emerald-700' :
														product.status === 'inactive' ? 'text-[#1C1917]' :
															product.status === 'outOfStock' ? 'text-amber-700' :
																product.status === 'discontinued' ? 'text-stone-700' :
																	product.status === 'suspended' ? 'text-rose-700' :
																		product.status === 'pending' ? 'text-blue-700' :
																			'text-[#78716C]'
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
														className="px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-sand/50 text-[#1C1917] hover:bg-accent/20 hover:text-[#1C1917] border border-accent/20 hover:border-transparent transition-all shadow-sm"
													>
													Detalhes
													</button>
													<button
														onClick={() => openStatusModal(product)}
														className="px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-accent/10 text-orange-700 hover:bg-orange-600 hover:text-white border border-orange-200 hover:border-transparent transition-all shadow-sm"
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
										<div className="flex flex-col items-center justify-center text-[#78716C]">
											<svg className="w-12 h-12 mb-3 text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
											<p className="text-base font-semibold text-[#78716C]">Nenhum produto encontrado.</p>
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
					<div className="bg-sand/30 px-6 py-4 border-t border-accent/10 flex items-center justify-between">
						<button
							disabled={page <= 1}
							onClick={() => setPage((prev) => prev - 1)}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-accent/20 text-sm font-display font-semibold rounded-xl text-[#1C1917] hover:bg-sand/50 hover:border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
							Anterior
						</button>
						<span className="text-sm font-medium text-[#78716C] bg-white px-4 py-2 rounded-xl border border-accent/20 shadow-sm">
							Página <span className="font-bold text-[#1C1917]">{pagination.page}</span> de <span className="font-bold text-[#1C1917]">{pagination.totalPages}</span>
						</span>
						<button
							disabled={page >= pagination.totalPages}
							onClick={() => setPage((prev) => prev + 1)}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-accent/20 text-sm font-display font-semibold rounded-xl text-[#1C1917] hover:bg-sand/50 hover:border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
						>
							Próxima
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
						</button>
					</div>
				)}
			</div>

			<Modal isOpen={statusModalOpen && !!selectedProductForStatus} onClose={() => setStatusModalOpen(false)} size="sm">
				<div className="p-6 border-b border-accent/10">
					<h3 className="text-xl font-bold text-[#1C1917]">Alterar Status do Produto</h3>
					<p className="text-sm text-[#78716C] mt-1">
						Selecione o novo status para o produto <strong>"{selectedProductForStatus?.name}"</strong>.
					</p>
				</div>
				<div className="p-6 space-y-4 bg-sand/50">
					<div>
						<label className="block text-sm font-bold text-[#1C1917] mb-2">Novo Status</label>
						<select
							value={statusAction}
							onChange={(e) => setStatusAction(e.target.value)}
							className="w-full px-4 py-2.5 rounded-xl border border-accent/20 text-sm outline-none"
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
							<label className="block text-sm font-bold text-[#1C1917] mb-2">Motivo da Ação (Obrigatório)</label>
							<p className="text-xs text-[#78716C] mb-2">Este motivo será enviado por email para a loja proprietária do produto.</p>
							<textarea
								value={motive}
								onChange={(e) => setMotive(e.target.value)}
								rows="3"
								className="w-full px-4 py-3 rounded-xl border border-accent/20 text-sm outline-none resize-none"
								placeholder={`Descreva o motivo de alterar para ${statusAction === 'suspended' ? 'suspenso' : 'inativo'}...`}
								required
							></textarea>
						</div>
					)}
				</div>
				<div className="p-6 border-t border-accent/10 flex justify-end gap-3 bg-white">
					<button
						onClick={() => setStatusModalOpen(false)}
						className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#78716C] bg-sand hover:bg-accent/20 transition-colors"
						disabled={updatingStatus}
					>
						Cancelar
					</button>
					<button
						onClick={confirmStatusChange}
						className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
						disabled={updatingStatus}
					>
						{updatingStatus ? (
							<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
						) : 'Confirmar Alteração'}
					</button>
				</div>
			</Modal>

			<Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} size="lg">
				<div className="p-6 border-b border-accent/10 flex justify-between items-center">
					<h3 className="text-xl font-bold text-[#1C1917]">Detalhes do Produto</h3>
					<button onClick={() => setDetailsModalOpen(false)} className="text-[#78716C] hover:text-[#78716C]">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				</div>

				<div className="p-6 flex-1 overflow-y-auto bg-sand/50">
					{loadingDetails ? (
						<div className="flex flex-col items-center justify-center py-10">
							<svg className="animate-spin h-8 w-8 text-accent mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							<p className="text-[#78716C] font-medium">A carregar detalhes...</p>
						</div>
					) : selectedProductDetails ? (
						<div className="space-y-6">
							<div className="flex flex-col md:flex-row gap-6 items-start">
								{selectedProductDetails.image ? (
									<img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full md:w-48 h-48 object-cover rounded-xl shadow-sm border border-accent/20" />
								) : (
									<div className="w-full md:w-48 h-48 bg-accent/20 rounded-xl flex items-center justify-center text-[#78716C]">Sem Imagem</div>
								)}

								<div className="flex-1 space-y-4">
									<div>
										<h4 className="text-2xl font-display font-bold text-[#1C1917]">{selectedProductDetails.name}</h4>
										<p className="text-sm text-[#78716C] mt-1">{selectedProductDetails.description || 'Sem descrição.'}</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="bg-white p-3 rounded-xl border border-accent/10 shadow-sm">
											<p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Preço Base</p>
											<p className="text-lg font-display font-bold text-[#1C1917]">{Number(selectedProductDetails.price).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
										</div>
										<div className={`p-3 rounded-xl border shadow-sm ${detailsHasValidPromotion ? 'bg-accent/10 border-orange-100' : 'bg-white border-accent/10'}`}>
											<p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Preço Promo</p>
											<p className={`text-lg font-display font-bold ${detailsHasValidPromotion ? 'text-accent-dark' : 'text-[#1C1917]'}`}>
												{detailsHasValidPromotion ? Number(selectedProductDetails.promotionalPrice).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '-'}
											</p>
										</div>
										<div className="bg-white p-3 rounded-xl border border-accent/10 shadow-sm">
											<p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Stock Atual</p>
											<p className="text-lg font-display font-bold text-[#1C1917]">{selectedProductDetails.stock} uni.</p>
										</div>
										<div className="bg-white p-3 rounded-xl border border-accent/10 shadow-sm">
											<p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">Status</p>
											<p className="text-sm font-bold text-[#1C1917] mt-1 capitalize">{selectedProductDetails.status || 'Pendente'}</p>
										</div>
									</div>
								</div>
							</div>

							{selectedProductDetails.gallery?.length > 0 && (
								<div>
									<h5 className="font-bold text-[#1C1917] mb-2">Galeria de Imagens</h5>
									<div className="flex gap-2 overflow-x-auto pb-2">
										{selectedProductDetails.gallery.map((img, i) => (
											<img key={i} src={img} alt={`${selectedProductDetails.name} ${i + 1}`} className="w-24 h-24 object-cover rounded-xl border border-accent/20 flex-shrink-0" />
										))}
									</div>
								</div>
							)}

							<div className="bg-white p-4 rounded-xl border border-accent/10 shadow-sm">
								<h5 className="font-bold text-[#1C1917] mb-2">Informações Adicionais</h5>
								<ul className="text-sm text-[#78716C] space-y-2">
									<li><span className="font-semibold text-[#1C1917]">Loja:</span> {selectedProductDetails.store?.name || selectedProductDetails.storeId}</li>
									<li><span className="font-semibold text-[#1C1917]">Categorias:</span> {selectedProductDetails.categories?.length > 0 ? selectedProductDetails.categories.map(c => c.name).join(', ') : 'Sem categoria'}</li>
									<li><span className="font-semibold text-[#1C1917]">Em Destaque:</span> {selectedProductDetails.featured ? `Sim${selectedProductDetails.featuredUntil ? ` (até ${new Date(selectedProductDetails.featuredUntil).toLocaleDateString('pt-PT')})` : ''}` : 'Não'}</li>
									<li><span className="font-semibold text-[#1C1917]">Promoção Válida Até:</span> {detailsHasValidPromotion && selectedProductDetails.promotionalEndDate ? new Date(selectedProductDetails.promotionalEndDate).toLocaleDateString('pt-PT') : '-'}</li>
									<li><span className="font-semibold text-[#1C1917]">Views:</span> {selectedProductDetails.views || 0}</li>
									<li><span className="font-semibold text-[#1C1917]">Vendas:</span> {selectedProductDetails.salesCount || 0}</li>
									<li><span className="font-semibold text-[#1C1917]">Avaliação:</span> {selectedProductDetails.rating || 0} ({selectedProductDetails.qtdRatings || 0} avaliações)</li>
									<li><span className="font-semibold text-[#1C1917]">Criado em:</span> {new Date(selectedProductDetails.createdAt).toLocaleDateString('pt-PT')}</li>
								</ul>
							</div>

							{selectedProductDetails.characteristics && typeof selectedProductDetails.characteristics === 'object' && Object.keys(selectedProductDetails.characteristics).length > 0 && (
								<div className="bg-white p-4 rounded-xl border border-accent/10 shadow-sm">
									<h5 className="font-bold text-[#1C1917] mb-2">Características</h5>
									<div className="grid grid-cols-2 gap-2 text-sm">
										{Object.entries(selectedProductDetails.characteristics).map(([key, value]) => (
											<div key={key}>
												<span className="font-semibold text-[#1C1917] capitalize">{key.replace(/_/g, ' ')}:</span>
												<span className="text-[#78716C] ml-1">{String(value)}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						<p className="text-center text-[#78716C] py-10">Não foi possível carregar os detalhes.</p>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default AdminProducts;




