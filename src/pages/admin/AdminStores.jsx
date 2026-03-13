import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminStores = () => {
	const [stores, setStores] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
	const [search, setSearch] = useState('');
	const [actionLoading, setActionLoading] = useState({});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedStoreId, setSelectedStoreId] = useState(null);
	const [storeDetails, setStoreDetails] = useState(null);
	const [detailsLoading, setDetailsLoading] = useState(false);
	const [emailSubject, setEmailSubject] = useState('');
	const [emailBody, setEmailBody] = useState('');
	const [selectedAction, setSelectedAction] = useState(null);

	const fetchStores = async () => {
		setLoading(true);
		try {
			const query = new URLSearchParams({
				page: pagination.page,
				limit: pagination.limit,
				search: search
			}).toString();

			const res = await apiRequest(`/admin/stores?${query}`, {
				method: 'GET',
			});
			if (res.success && res.data) {
				setStores(res.data.stores);
				setPagination((prev) => ({ ...prev, ...res.data.pagination }));
			} else {
				notyf.error(res.msg || 'Erro ao carregar lojas.');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStores();
		// eslint-disable-next-line
	}, [pagination.page]);

	const handleViewDetails = async (storeId) => {
		setSelectedStoreId(storeId);
		setStoreDetails(null);
		setIsModalOpen(true);
		setDetailsLoading(true);
		setSelectedAction(null);
		setEmailSubject('');
		setEmailBody('');
		try {
			const res = await apiRequest(`/admin/stores/${storeId}`, { method: 'GET' });
			if (res.success && res.data) {
				setStoreDetails(res.data.store);
			} else {
				notyf.error(res.msg || 'Erro ao carregar detalhes da loja.');
				setIsModalOpen(false);
			}
		} catch (error) {
			console.error(error);
			notyf.error('Erro de conexão ao carregar detalhes.');
			setIsModalOpen(false);
		} finally {
			setDetailsLoading(false);
		}
	};

	const handleStatusChange = async () => {
		if (!selectedAction) return;
		if ((selectedAction === 'rejected' || selectedAction === 'suspended') && (!emailSubject || !emailBody)) {
			notyf.error('Por favor, preencha o assunto e o corpo do e-mail.');
			return;
		}

		setActionLoading(prev => ({ ...prev, ['modal-status']: true }));
		try {
			const res = await apiRequest(`/admin/stores/${selectedStoreId}/status`, {
				method: 'PATCH',
				body: JSON.stringify({ 
					status: selectedAction,
					emailSubject: selectedAction === 'approved' ? undefined : emailSubject,
					emailBody: selectedAction === 'approved' ? undefined : emailBody
				})
			});
			if (res.success) {
				notyf.success(res.msg || 'Status atualizado com sucesso.');
				setIsModalOpen(false);
				fetchStores();
			} else {
				notyf.error(res.msg || 'Erro ao atualizar status.');
			}
		} catch (err) {
			console.error(err);
			notyf.error('Erro de conexão.');
		} finally {
			setActionLoading(prev => ({ ...prev, ['modal-status']: false }));
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination((prev) => ({ ...prev, page: 1 }));
		fetchStores();
	};

	// --- Skeleton Loader Component ---
	const StoreSkeleton = () => (
		<tr className="animate-pulse border-b border-slate-100 last:border-0">
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-xl bg-slate-200"></div>
					<div className="space-y-2">
						<div className="h-4 bg-slate-200 rounded w-32"></div>
						<div className="h-3 bg-slate-100 rounded w-24"></div>
					</div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="space-y-2">
					<div className="h-4 bg-slate-200 rounded w-36"></div>
					<div className="h-3 bg-slate-100 rounded w-28"></div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-6 w-20 bg-slate-200 rounded-full"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right">
				<div className="flex justify-end gap-2">
					<div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
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
						<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
						Gestão de Lojas
					</h2>
					<p className="text-sm text-slate-500 mt-1">Aprove ou suspenda as lojas da plataforma e veja as suas informações.</p>
				</div>
				<form onSubmit={handleSearch} className="flex w-full sm:w-auto mt-2 sm:mt-0 relative group">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 transition-colors">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
					</div>
					<input
						type="text"
						placeholder="Buscar loja..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-slate-200 bg-slate-50 text-sm transition-all outline-none"
					/>
					<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-semibold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
						Buscar
					</button>
				</form>
			</div>

			{/* Stores Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil da Loja</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Proprietário & Contacto</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Atual</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações de Gestão</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-slate-100 relative">
							{loading ? (
								<>
									<StoreSkeleton />
									<StoreSkeleton />
									<StoreSkeleton />
									<StoreSkeleton />
									<StoreSkeleton />
								</>
							) : stores.length > 0 ? (
								stores.map((store) => (
									<tr key={store.id} className="hover:bg-slate-50/80 transition-colors group">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-4">
												{store.logo ? (
													<img src={store.logo} alt={store.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm" />
												) : (
													<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 text-orange-700 font-bold flex items-center justify-center uppercase shadow-sm border border-orange-200/50">
														{store.name.charAt(0)}
													</div>
												)}
												<div>
													<div className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{store.name}</div>
													<div className="text-xs text-slate-500 font-medium mt-0.5">{store.location || store.province || 'Localização não informada'}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-slate-700">{store.user?.name} {store.user?.surname}</div>
											<div className="text-xs text-slate-500 mt-0.5">{store.user?.email || store.email} • {store.user?.phone || store.phone || 'Sem telemóvel'}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<span className={`w-2 h-2 rounded-full ${store.status === 'approved' ? 'bg-emerald-500' :
													store.status === 'pending' ? 'bg-amber-500' :
														'bg-rose-500'
												}`}></span>
												<span className={`text-sm font-bold ${store.status === 'approved' ? 'text-emerald-700' :
													store.status === 'pending' ? 'text-amber-700' :
														'text-rose-700'
												}`}>
													{store.status === 'approved' ? 'Aprovada' :
														store.status === 'pending' ? 'Pendente' :
															store.status === 'suspended' ? 'Suspensa' : 'Rejeitada'}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => handleViewDetails(store.id)}
													className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent transition-all shadow-sm"
												>
													Ver Detalhes
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className="px-6 py-16 text-center">
										<div className="flex flex-col items-center justify-center text-slate-400">
											<svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
											<p className="text-base font-semibold text-slate-600">Nenhuma loja encontrada.</p>
											<p className="text-sm mt-1">Ainda não existem lojas cadastradas na plataforma.</p>
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

			{/* Store Details Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
					<div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
						<div className="flex justify-between items-center p-6 border-b border-slate-100">
							<h3 className="text-xl font-bold text-slate-800">Detalhes da Loja</h3>
							<button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
							</button>
						</div>
						
						<div className="p-6 overflow-y-auto flex-1">
							{detailsLoading ? (
								<div className="flex flex-col items-center justify-center py-12">
									<svg className="w-8 h-8 text-indigo-500 animate-spin mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
									<p className="text-slate-500 font-medium">A carregar detalhes...</p>
								</div>
							) : storeDetails ? (
								<div className="space-y-6">
									{/* Store Info */}
									<div className="flex items-start gap-4">
										{storeDetails.logo ? (
											<img src={storeDetails.logo} alt={storeDetails.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
										) : (
											<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 text-orange-700 font-bold flex items-center justify-center text-xl uppercase shadow-sm border border-orange-200/50">
												{storeDetails.name.charAt(0)}
											</div>
										)}
										<div>
											<h4 className="text-lg font-bold text-slate-800">{storeDetails.name}</h4>
											<p className="text-sm text-slate-500 mt-1">{storeDetails.description || 'Sem descrição.'}</p>
											<div className="mt-2 flex gap-2">
												<span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
													Produtos: {storeDetails._count?.products || 0}
												</span>
												<span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
													Vendas: {storeDetails._count?.storeOrders || 0}
												</span>
												<span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${storeDetails.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
													storeDetails.status === 'pending' ? 'bg-amber-100 text-amber-700' :
														'bg-rose-100 text-rose-700'
												}`}>
													Estado: {storeDetails.status === 'approved' ? 'Aprovada' :
														storeDetails.status === 'pending' ? 'Pendente' :
															storeDetails.status === 'suspended' ? 'Suspensa' : 'Rejeitada'}
												</span>
											</div>
										</div>
									</div>

									<hr className="border-slate-100" />

									{/* Owner Info */}
									<div>
										<h5 className="text-sm font-bold text-slate-800 mb-3">Detalhes do Proprietário</h5>
										<div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Nome</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.user?.name} {storeDetails.user?.surname}</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Email</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.user?.email || storeDetails.email}</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Telefone</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.user?.phone || storeDetails.phone || 'N/A'}</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Localização</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.location || storeDetails.province || 'N/A'}</span>
											</div>
										</div>
									</div>

									<hr className="border-slate-100" />

									{/* Store Operation Info */}
									<div>
										<h5 className="text-sm font-bold text-slate-800 mb-3">Detalhes de Operação & Desempenho</h5>
										<div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Horário de Funcionamento</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.workingHours || 'Não definido'}</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Avaliação</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">
													{storeDetails.rating ? `${Number(storeDetails.rating).toFixed(1)} ⭐ (${storeDetails.qtdRatings} avaliações)` : 'Sem avaliações'}
												</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Total de Visualizações</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.views || 0} visualizações</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Destaque</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">
													{storeDetails.featured ? `Sim ${storeDetails.featuredUntil ? `(Até ${new Date(storeDetails.featuredUntil).toLocaleDateString()})` : ''}` : 'Não'}
												</span>
											</div>
										</div>
									</div>

									<hr className="border-slate-100" />

									{/* Financial Info */}
									<div>
										<h5 className="text-sm font-bold text-slate-800 mb-3">Informações Bancárias</h5>
										<div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">Banco</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.bankName || 'Não definido'}</span>
											</div>
											<div>
												<span className="block text-xs font-semibold text-slate-500 uppercase">IBAN</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.iban || 'Não definido'}</span>
											</div>
											<div className="sm:col-span-2">
												<span className="block text-xs font-semibold text-slate-500 uppercase">Conta PayPay</span>
												<span className="block text-sm font-medium text-slate-800 mt-1">{storeDetails.paypayAccount || 'Não definido'}</span>
											</div>
										</div>
									</div>

									<hr className="border-slate-100" />

									{/* Action Section */}
									<div>
										<h5 className="text-sm font-bold text-slate-800 mb-3">Ações de Gestão</h5>
										<div className="flex flex-wrap gap-2 mb-4">
											{(storeDetails.status === 'pending' || storeDetails.status === 'suspended' || storeDetails.status === 'rejected') && (
												<button
													onClick={() => setSelectedAction('approved')}
													className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${selectedAction === 'approved' ? 'bg-emerald-600 text-white border-transparent shadow-md' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
												>
													Aprovar Loja
												</button>
											)}
											{(storeDetails.status === 'approved' || storeDetails.status === 'pending') && (
												<button
													onClick={() => setSelectedAction('suspended')}
													className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${selectedAction === 'suspended' ? 'bg-amber-500 text-white border-transparent shadow-md' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}
												>
													Suspender
												</button>
											)}
											{(storeDetails.status === 'pending' || storeDetails.status === 'suspended') && (
												<button
													onClick={() => setSelectedAction('rejected')}
													className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${selectedAction === 'rejected' ? 'bg-rose-600 text-white border-transparent shadow-md' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'}`}
												>
													Rejeitar
												</button>
											)}
										</div>

										{(selectedAction === 'rejected' || selectedAction === 'suspended') && (
											<div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in-up mt-4">
												<div>
													<label className="block text-sm font-bold text-slate-700 mb-1">Assunto do E-mail</label>
													<input 
														type="text" 
														value={emailSubject}
														onChange={(e) => setEmailSubject(e.target.value)}
														className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
														placeholder="Ex: Sua loja foi suspensa"
													/>
												</div>
												<div>
													<label className="block text-sm font-bold text-slate-700 mb-1">Corpo do E-mail (HTML permitido)</label>
													<textarea 
														value={emailBody}
														onChange={(e) => setEmailBody(e.target.value)}
														className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
														rows="4"
														placeholder="<p>Lamentamos informar que...</p>"
													></textarea>
												</div>
											</div>
										)}
									</div>
								</div>
							) : null}
						</div>
						
						<div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
							<button 
								onClick={() => setIsModalOpen(false)}
								className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
							>
								Cancelar
							</button>
							<button 
								onClick={handleStatusChange}
								disabled={!selectedAction || actionLoading['modal-status']}
								className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{actionLoading['modal-status'] ? (
									<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> A Guardar...</>
								) : 'Confirmar Ação'}
							</button>
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
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.animate-fade-in-up {
					animation: fadeInUp 0.4s ease-out forwards;
				}
				.animate-fade-in {
					animation: fadeIn 0.2s ease-out forwards;
				}
			`}} />
		</div>
	);
};

export default AdminStores;
