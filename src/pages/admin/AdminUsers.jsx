import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
	const [search, setSearch] = useState('');

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await apiRequest('/users/list', {
				method: 'POST',
				admin: true,
				body: JSON.stringify({
					page: pagination.page,
					limit: pagination.limit,
					search: search
				})
			});
			if (res.success && res.data) {
				setUsers(res.data.users);
				setPagination((prev) => ({ ...prev, ...res.data.pagination }));
			} else {
				notyf.error(res.msg || 'Erro ao carregar utilizadores.');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line
	}, [pagination.page]);

	const toggleStatus = async (userId) => {
		try {
			const res = await apiRequest('/users/toggle-status', {
				method: 'PATCH',
				admin: true,
				body: JSON.stringify({ userId })
			});
			if (res.success) {
				notyf.success(res.msg);
				fetchUsers();
			} else {
				notyf.error(res.msg);
			}
		} catch (err) {
			notyf.error('Erro de conexão ao alterar estado.');
		}
	};

	const toggleRole = async (userId) => {
		if (!window.confirm("Você tem certeza de que deseja alterar os privilégios deste utilizador?")) return;
		try {
			const res = await apiRequest('/users/update-role', {
				method: 'PATCH',
				admin: true,
				body: JSON.stringify({ userId })
			});
			if (res.success) {
				notyf.success(res.msg);
				fetchUsers();
			} else {
				notyf.error(res.msg);
			}
		} catch (err) {
			notyf.error('Erro de conexão ao alterar papel.');
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setPagination((prev) => ({ ...prev, page: 1 }));
		fetchUsers();
	};

	// --- Skeleton Loader Component ---
	const UserSkeleton = () => (
		<tr className="animate-pulse border-b border-slate-100 last:border-0">
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-slate-200"></div>
					<div className="space-y-2">
						<div className="h-4 bg-slate-200 rounded w-32"></div>
						<div className="h-3 bg-slate-100 rounded w-24"></div>
					</div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="space-y-2">
					<div className="h-4 bg-slate-200 rounded w-40"></div>
					<div className="h-3 bg-slate-100 rounded w-28"></div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-6 w-20 bg-slate-200 rounded-full"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="h-6 w-16 bg-slate-200 rounded-full"></div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right">
				<div className="flex justify-end gap-2">
					<div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
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
						<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
						Gestão de Utilizadores
					</h2>
					<p className="text-sm text-slate-500 mt-1">Gerencie as permissões e status dos utilizadores da plataforma.</p>
				</div>
				<form onSubmit={handleSearch} className="flex w-full sm:w-auto mt-2 sm:mt-0 relative group">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 transition-colors">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
					</div>
					<input
						type="text"
						placeholder="Buscar cliente..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-slate-200 bg-slate-50 text-sm transition-all outline-none"
					/>
					<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-semibold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
						Buscar
					</button>
				</form>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil do Utilizador</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nível de Acesso</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo & Verificação</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Atual</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações de Gestão</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-slate-100 relative">
							{loading ? (
								<>
									<UserSkeleton />
									<UserSkeleton />
									<UserSkeleton />
									<UserSkeleton />
									<UserSkeleton />
								</>
							) : users.length > 0 ? (
								users.map((user) => (
									<tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold flex items-center justify-center uppercase shadow-sm border border-indigo-200/50">
													{user.name.charAt(0)}
												</div>
												<div>
													<div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{user.name} {user.surname}</div>
													<div className="text-xs text-slate-500 font-medium mt-0.5">Criado a {new Date(user.createdAt).toLocaleDateString('pt-PT')}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-slate-700">{user.email}</div>
											<div className="text-xs text-slate-500 mt-0.5">{user.phone || 'Sem telefone'}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${user.role === 'ft'
												? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
												: 'bg-slate-100 text-slate-600 border-slate-200'
											}`}>
												{user.role === 'ft' ? 'Administrador' : 'Utilizador Comum'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex flex-col gap-2">
												{user.seller ? (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200 w-fit">
														<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
														Vendedor
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200 w-fit">
														<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
														Comprador
													</span>
												)}

												{user.validatedSeller ? (
													<span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
														<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
														ID Verificado
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
														Não Verificado
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
												<span className={`text-sm font-bold ${user.status === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>
													{user.status === 'active' ? 'Ativo' : 'Suspenso'}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => toggleRole(user.id)}
													className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent transition-all shadow-sm"
												>
													Privilégios
												</button>
												<button
													onClick={() => toggleStatus(user.id)}
													className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${user.status === 'active'
														? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-transparent'
														: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-transparent'
													}`}
												>
													{user.status === 'active' ? 'Suspender' : 'Reativar'}
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="px-6 py-16 text-center">
										<div className="flex flex-col items-center justify-center text-slate-400">
											<svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											<p className="text-base font-semibold text-slate-600">Nenhum utilizador encontrado.</p>
											<p className="text-sm mt-1">Tente ajustar os termos de pesquisa ou limpe a busca.</p>
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

export default AdminUsers;
