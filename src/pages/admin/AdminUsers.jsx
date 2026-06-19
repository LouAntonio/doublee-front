import React, { useState } from 'react';
import { notyf } from '../../utils/notyf';
import { useAdminUsersList, useToggleUserStatus, useToggleUserRole } from '../../hooks/queries/useAdminUsers';
import Modal from '../../components/admin/Modal';

const UserSkeleton = () => (
	<tr className="animate-pulse border-b border-accent/10 last:border-0">
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-accent/20"></div>
				<div className="space-y-2">
					<div className="h-4 bg-accent/20 rounded w-32"></div>
					<div className="h-3 bg-accent/10 rounded w-24"></div>
				</div>
			</div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="space-y-2">
				<div className="h-4 bg-accent/20 rounded w-40"></div>
				<div className="h-3 bg-accent/10 rounded w-28"></div>
			</div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="h-6 w-20 bg-accent/20 rounded-full"></div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="h-6 w-16 bg-accent/20 rounded-full"></div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap text-right">
			<div className="flex justify-end gap-2">
				<div className="h-8 w-16 bg-accent/20 rounded-lg"></div>
				<div className="h-8 w-20 bg-accent/20 rounded-lg"></div>
			</div>
		</td>
	</tr>
);

const AdminUsers = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [actionLoading, setActionLoading] = useState({});

	const { data: usersData, isLoading: loading } = useAdminUsersList({ page, limit: 10, search });
	const toggleUserStatus = useToggleUserStatus();
	const toggleUserRole = useToggleUserRole();

	const users = usersData?.users || [];
	const pagination = usersData?.pagination || { page: 1, limit: 10, totalPages: 1 };

	const [detailsModalOpen, setDetailsModalOpen] = useState(false);
	const [selectedUserDetails, setSelectedUserDetails] = useState(null);

	const toggleStatus = async (userId) => {
		setActionLoading(prev => ({ ...prev, [`${userId}-status`]: true }));
		try {
			await toggleUserStatus.mutateAsync(userId);
		} catch {
			notyf.error('Erro de conexão ao alterar estado.');
		} finally {
			setActionLoading(prev => ({ ...prev, [`${userId}-status`]: false }));
		}
	};

	const toggleRole = async (userId) => {
		if (!window.confirm("Você tem certeza de que deseja alterar os privilégios deste utilizador?")) return;
		setActionLoading(prev => ({ ...prev, [`${userId}-role`]: true }));
		try {
			await toggleUserRole.mutateAsync(userId);
		} catch {
			notyf.error('Erro de conexão ao alterar papel.');
		} finally {
			setActionLoading(prev => ({ ...prev, [`${userId}-role`]: false }));
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setPage(1);
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-accent/10">
				<div>
					<h2 className="text-2xl font-display font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
						Gestão de Utilizadores
					</h2>
					<p className="text-sm text-[#78716C] mt-1 font-body">Gerencie as permissões e status dos utilizadores da plataforma.</p>
				</div>
				<form onSubmit={handleSearch} className="flex w-full sm:w-auto mt-2 sm:mt-0 relative group">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C] transition-colors">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
					</div>
					<input
						type="text"
						placeholder="Buscar cliente..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-accent/20 bg-sand/50 text-sm transition-all outline-none"
					/>
					<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-display font-semibold rounded-r-xl text-white bg-accent hover:bg-accent-dark transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
						Buscar
					</button>
				</form>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-3xl shadow-sm border border-accent/10 overflow-hidden flex flex-col">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-sand/50 border-b border-accent/10">
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Perfil do Utilizador</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Contacto</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Nível de Acesso</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Tipo</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Status</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider text-right">Ações de Gestão</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-accent/10 relative">
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
									<tr key={user.id} className="hover:bg-sand/50 transition-colors group">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-display font-bold flex items-center justify-center uppercase shadow-sm border border-accent/30">
													{user.name.charAt(0)}
												</div>
												<div>
													<div className="text-sm font-display font-bold text-[#1C1917] group-hover:text-accent transition-colors">{user.name} {user.surname}</div>
													<div className="text-xs text-[#78716C] font-body mt-0.5">Criado a {new Date(user.createdAt).toLocaleDateString('pt-PT')}</div>
													<div className="text-[10px] text-[#78716C] mt-0.5">Último acesso: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-PT') : 'Nunca'}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-body font-medium text-[#1C1917]">{user.email}</div>
											<div className="text-xs text-[#78716C] mt-0.5">{user.phone || 'Sem telefone'}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-3 py-1 inline-flex text-xs font-display font-bold rounded-full border ${user.role === 'ft'
												? 'bg-accent/20 text-accent border-accent/30 shadow-sm'
												: 'bg-sand text-[#78716C] border-accent/10'
											}`}>
												{user.role === 'ft' ? 'Administrador' : 'Utilizador Comum'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex flex-col gap-2">
												{user.seller ? (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-display font-bold rounded-md bg-accent/10 text-accent border border-accent/20 w-fit">
														<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
														Vendedor
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-display font-bold rounded-md bg-sand text-[#78716C] border border-accent/10 w-fit">
														<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
														Comprador
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
												<span className={`text-sm font-display font-bold ${user.status === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>
													{user.status === 'active' ? 'Ativo' : 'Suspenso'}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => { setSelectedUserDetails(user); setDetailsModalOpen(true); }}
													className="px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-sand/50 text-[#1C1917] hover:bg-accent/20 border border-accent/20 transition-all shadow-sm"
												>
													Ver Detalhes
												</button>
												<button
													onClick={() => toggleRole(user.id)}
													disabled={actionLoading[`${user.id}-role`]}
													className="px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/20 hover:border-transparent transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent/10 disabled:hover:text-accent disabled:hover:border-accent/20"
												>
													{actionLoading[`${user.id}-role`] ? 'Processando...' : 'Privilégios'}
												</button>
												<button
													onClick={() => toggleStatus(user.id)}
													disabled={actionLoading[`${user.id}-status`]}
													className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold border transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${user.status === 'active'
														? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-transparent disabled:hover:bg-rose-50 disabled:hover:text-rose-700 disabled:hover:border-rose-200'
														: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-transparent disabled:hover:bg-emerald-50 disabled:hover:text-emerald-700 disabled:hover:border-emerald-200'
													}`}
												>
													{actionLoading[`${user.id}-status`] ? 'Processando...' : (user.status === 'active' ? 'Suspender' : 'Reativar')}
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="px-6 py-16 text-center">
										<div className="flex flex-col items-center justify-center text-[#78716C]">
											<svg className="w-12 h-12 mb-3 text-accent/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
											<p className="text-base font-display font-semibold text-[#1C1917]">Nenhum utilizador encontrado.</p>
											<p className="text-sm mt-1 font-body">Tente ajustar os termos de pesquisa ou limpe a busca.</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination Controls */}
				{!loading && pagination.totalPages > 1 && (
					<div className="bg-sand/50 px-6 py-4 border-t border-accent/10 flex items-center justify-between">
						<button
							disabled={pagination.page <= 1}
							onClick={() => setPage((prev) => prev - 1)}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-accent/20 text-sm font-display font-semibold rounded-xl text-[#78716C] hover:bg-sand hover:border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
							Anterior
						</button>
						<span className="text-sm font-body font-medium text-[#78716C] bg-white px-4 py-2 rounded-xl border border-accent/20 shadow-sm">
							Página <span className="font-bold text-[#1C1917]">{pagination.page}</span> de <span className="font-bold text-[#1C1917]">{pagination.totalPages}</span>
						</span>
						<button
							disabled={pagination.page >= pagination.totalPages}
							onClick={() => setPage((prev) => prev + 1)}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-accent/20 text-sm font-display font-semibold rounded-xl text-[#78716C] hover:bg-sand hover:border-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
						>
							Próxima
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
						</button>
					</div>
				)}
			</div>

			<Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} size="md">
				<div className="p-6 border-b border-accent/10 flex justify-between items-center">
					<h3 className="text-xl font-bold text-[#1C1917]">Detalhes do Utilizador</h3>
					<button onClick={() => setDetailsModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917]">
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				</div>
				<div className="p-6 space-y-6 bg-sand/50">
					{selectedUserDetails && (
						<>
							<div className="flex items-center gap-4">
								{selectedUserDetails.avatar ? (
									<img src={selectedUserDetails.avatar} alt="" className="w-16 h-16 rounded-full object-cover border border-accent/20 shadow-sm" />
								) : (
									<div className="w-16 h-16 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xl uppercase shadow-sm border border-accent/30">
										{selectedUserDetails.name.charAt(0)}
									</div>
								)}
								<div>
									<h4 className="text-lg font-bold text-[#1C1917]">{selectedUserDetails.name} {selectedUserDetails.surname}</h4>
									<p className="text-sm text-[#78716C]">{selectedUserDetails.email}</p>
								</div>
							</div>

							<div className="bg-white p-4 rounded-xl border border-accent/10 grid grid-cols-2 gap-4 shadow-sm">
								<div>
									<span className="block text-xs font-semibold text-[#78716C] uppercase">Telefone</span>
									<span className="block text-sm font-medium text-[#1C1917] mt-1">{selectedUserDetails.phone || 'Não informado'}</span>
								</div>
								<div>
									<span className="block text-xs font-semibold text-[#78716C] uppercase">Função</span>
									<span className="block text-sm font-medium text-[#1C1917] mt-1">{selectedUserDetails.role === 'ft' ? 'Administrador' : 'Utilizador Comum'}</span>
								</div>
								<div>
									<span className="block text-xs font-semibold text-[#78716C] uppercase">Status</span>
									<span className={`block text-sm font-medium mt-1 ${selectedUserDetails.status === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>
										{selectedUserDetails.status === 'active' ? 'Ativo' : 'Suspenso'}
									</span>
								</div>
								<div>
									<span className="block text-xs font-semibold text-[#78716C] uppercase">Vendedor</span>
									<span className="block text-sm font-medium text-[#1C1917] mt-1">
										{selectedUserDetails.seller ? (selectedUserDetails.validatedSeller ? 'Verificado' : 'Pendente') : 'Não'}
									</span>
								</div>
								<div>
									<span className="block text-xs font-semibold text-[#78716C] uppercase">Registado em</span>
									<span className="block text-sm font-medium text-[#1C1917] mt-1">{new Date(selectedUserDetails.createdAt).toLocaleDateString('pt-PT')}</span>
								</div>
								<div>
									<span className="block text-xs font-semibold text-[#78716C] uppercase">Último Acesso</span>
									<span className="block text-sm font-medium text-[#1C1917] mt-1">{selectedUserDetails.lastLogin ? new Date(selectedUserDetails.lastLogin).toLocaleDateString('pt-PT') : 'Nunca'}</span>
								</div>
							</div>

							{selectedUserDetails.details && (
								<div className="bg-white p-4 rounded-xl border border-accent/10 shadow-sm">
									<h5 className="font-bold text-[#1C1917] mb-2">Morada / Localização</h5>
									<ul className="text-sm text-[#78716C] space-y-1">
										<li><span className="font-semibold text-[#1C1917]">Endereço:</span> {selectedUserDetails.details.shippingAddress || 'Não informado'}</li>
									</ul>
								</div>
							)}
						</>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default AdminUsers;



