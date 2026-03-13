import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminStores = () => {
	const [stores, setStores] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchStores = async () => {
		setLoading(true);
		try {
			const res = await apiRequest('/stores/admin/all', {
				method: 'GET',
			});
			if (res.success && res.data) {
				setStores(res.data);
			} else if (res.success === false) {
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
		 
	}, []);

	const toggleStatus = async (storeId, currentStatus) => {
		let newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';

		try {
			const res = await apiRequest(`/stores/${storeId}/status`, {
				method: 'PATCH',
				admin: true,
				body: JSON.stringify({ status: newStatus })
			});
			if (res.success) {
				notyf.success('Status da loja atualizado com sucesso');
				fetchStores();
			} else {
				notyf.error(res.msg);
			}
		} catch (err) {
			console.log(err);
			notyf.error('Erro de conexão ao alterar estado da loja.');
		}
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
												{store.status === 'pending' && (
													<button
														onClick={() => toggleStatus(store.id, store.status)}
														className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-transparent transition-all shadow-sm"
													>
														Aprovar
													</button>
												)}
												{store.status === 'approved' && (
													<button
														onClick={() => toggleStatus(store.id, store.status)}
														className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-transparent transition-all shadow-sm"
													>
														Suspender
													</button>
												)}
												{store.status === 'suspended' && (
													<button
														onClick={() => toggleStatus(store.id, store.status)}
														className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-transparent transition-all shadow-sm"
													>
														Reativar
													</button>
												)}
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

export default AdminStores;
