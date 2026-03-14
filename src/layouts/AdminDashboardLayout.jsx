import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminDashboardLayout = () => {
	const { isAuthenticated, isLoading, logout, admin } = useAdminAuth();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const location = useLocation();

	useDocumentTitle('Double E | Painel Administrativo');

	if (isLoading) {
		return (
			<div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-6">
				<div className="relative">
					<div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 opacity-20 blur-2xl"></div>
					<div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl px-8 py-7 text-center shadow-2xl">
						<div className="mx-auto h-12 w-12 rounded-full border-2 border-slate-700 border-t-orange-500 animate-spin"></div>
						<p className="mt-4 text-sm font-semibold text-slate-200">Carregando painel</p>
						<p className="mt-1 text-xs text-slate-400">Sincronizando dados do administrador</p>
					</div>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/dbe/login" replace />;
	}

	const menuItems = [
		{ name: 'Dashboard', path: '/dbe', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
		{ name: 'ID Check', path: '/dbe/identity', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
		{ name: 'Usuários', path: '/dbe/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
		{ name: 'Lojas', path: '/dbe/stores', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
		{ name: 'Produtos', path: '/dbe/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
		{ name: 'Categorias', path: '/dbe/categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
		{ name: 'Analytics', path: '/dbe/analytics', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
	];

	return (
		<div className="flex h-screen bg-slate-50 font-sans overflow-hidden selection:bg-orange-500/30 selection:text-orange-900">
			{/* Sidebar */}
			<aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-[#0f172a] text-white transition-all duration-300 ease-in-out flex flex-col relative shadow-2xl z-20`}>
				<div className="flex items-center justify-between p-5 border-b border-slate-800 h-20">
					{sidebarOpen && (
						<div className="flex items-center gap-3 overflow-hidden">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
								<span className="text-white font-bold text-lg">D</span>
							</div>
							<span className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
								Double E
							</span>
						</div>
					)}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className={`p-2 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-pointer ${!sidebarOpen ? 'mx-auto' : ''}`}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={sidebarOpen ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto py-6 custom-scrollbar hide-scrollbar">
					<div className="px-4 mb-2">
						{sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Principal</p>}
						<ul className="space-y-1.5">
							{menuItems.map((item) => {
								const isActive = location.pathname === item.path || (item.path !== '/dbe' && location.pathname.startsWith(item.path));
								return (
									<li key={item.path}>
										<Link
											to={item.path}
											className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
												? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20'
												: 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
											}`}
										>
											{isActive && (
												<div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full"></div>
											)}
											<svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={item.icon}></path></svg>
											{sidebarOpen && <span className="ml-3.5 font-medium whitespace-nowrap">{item.name}</span>}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>

				<div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
					<button
						onClick={logout}
						className={`group flex items-center w-full px-3 py-3 text-sm font-medium text-rose-400 cursor-pointer rounded-xl transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-300 ${!sidebarOpen ? 'justify-center' : ''}`}
					>
						<div className="relative">
							<svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
						</div>
						{sidebarOpen && <span className="ml-3">Terminar Sessão</span>}
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden relative">
				{/* Decorative background blur */}
				<div className="absolute top-0 left-0 w-full h-64 bg-slate-100 mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>

				{/* Top Header */}
				<header className="bg-white/70 backdrop-blur-xl shadow-sm shadow-slate-200/50 z-10 h-20 flex items-center justify-between px-8 border-b border-slate-200 sticky top-0 transition-all duration-300">
					<div className="flex items-center gap-4">
						<div className="h-8 w-1 bg-gradient-to-b from-orange-400 to-rose-500 rounded-full hidden sm:block"></div>
						<h1 className="text-2xl font-bold text-slate-800 capitalize tracking-tight flex items-center gap-2">
							{location.pathname === '/dbe' ? 'Dashboard' : location.pathname.split('/').pop()}
						</h1>
					</div>

					<div className="flex items-center space-x-5">
						<div className="hidden sm:flex items-center space-x-2 bg-slate-100/80 px-4 py-2 rounded-full border border-slate-200/80 backdrop-blur-sm">
							<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
							<span className="text-xs font-semibold text-slate-500">
								{new Date().toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
							</span>
						</div>

						<div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

						<div className="flex items-center gap-3 p-1.5 pr-4 rounded-full transition-colors border border-transparent">
							<div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-200 relative">
								{admin?.name?.charAt(0) || 'A'}
								<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
							</div>
							<div className="flex flex-col items-start hidden sm:flex">
								<span className="text-sm font-bold text-slate-800 leading-tight">{admin?.name || 'Administrador'}</span>
								<span className="text-xs font-medium text-slate-500 leading-tight">Admin System</span>
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 overflow-y-auto bg-transparent p-6 sm:p-8 z-10 custom-scrollbar">
					<div className="max-w-7xl mx-auto space-y-6">
						<Outlet />
					</div>
				</main>
			</div>

			<style dangerouslySetInnerHTML={{
				__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(148, 163, 184, 0.3);
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(148, 163, 184, 0.5);
                }
            `}} />
		</div>
	);
};

export default AdminDashboardLayout;
