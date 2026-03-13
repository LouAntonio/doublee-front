import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminDashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await apiRequest('/admin/dashboard', { method: 'GET', admin: true });
				if (response.success && response.data) {
					setStats(response.data);
				} else {
					notyf.error(response.msg || 'Erro ao carregar estatísticas.');
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className="space-y-8 animate-fade-in-up">
				{/* Title Skeleton */}
				<div>
					<div className="h-9 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
					<div className="h-5 w-64 bg-slate-200 rounded-lg animate-pulse mt-2"></div>
				</div>

				{/* Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
							<div className="w-15 h-15 rounded-xl bg-slate-200 animate-pulse p-4" style={{ width: '56px', height: '56px' }}></div>
							<div className="ml-5 flex-1">
								<div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
								<div className="h-8 w-32 bg-slate-200 rounded animate-pulse mt-2"></div>
							</div>
						</div>
					))}
				</div>

				{/* Lists Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{[1, 2].map((i) => (
						<div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
							<div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
								<div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
								<div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
							</div>
							<div className="p-0">
								<div className="w-full">
									<div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
										<div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
										<div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
										<div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
									</div>
									<div className="divide-y divide-slate-100 px-6">
										{[1, 2, 3].map((j) => (
											<div key={j} className="py-4 flex items-center justify-between">
												<div className="flex items-center gap-3 w-1/3">
													<div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse flex-shrink-0"></div>
													<div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
												</div>
												<div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse"></div>
												<div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
				<svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
				<p className="text-lg font-medium">Falha ao carregar os dados.</p>
				<button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">Tentar novamente</button>
			</div>
		);
	}

	const statCards = [
		{ title: 'Utilizadores', value: stats.totalUsers, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600' },
		{ title: 'Lojas', value: stats.totalStores, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
		{ title: 'Pedidos', value: stats.totalOrders, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'from-orange-400 to-rose-500', bg: 'bg-orange-50', text: 'text-orange-600' },
		{ title: 'Receita', value: Number(stats.totalRevenue).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-600' }
	];

	return (
		<div className="space-y-8 animate-fade-in-up">
			{/* Page Title */}
			<div>
				<h2 className="text-3xl font-bold text-slate-800 tracking-tight">Visão Geral</h2>
				<p className="text-slate-500 mt-1">Bem-vindo ao painel de administração da Double E.</p>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{statCards.map((card, index) => (
					<div key={index} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 p-6 flex items-center transition-all duration-300 relative overflow-hidden">
						{/* Background gradient line */}
						<div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

						<div className={`p-4 rounded-xl ${card.bg} ${card.text} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
							<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path></svg>
						</div>
						<div className="ml-5 flex-1">
							<p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
							<p className="text-3xl font-bold text-slate-800 mt-1 tracking-tight">{card.value}</p>
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recent Stores */}
				<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
					<div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
						<h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
							<svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
							Lojas Recentes
						</h3>
						<span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{stats.recentStores?.length || 0} novas</span>
					</div>
					<div className="overflow-x-auto flex-1">
						<table className="w-full">
							<thead>
								<tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
									<th className="px-6 py-4">Nome</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4 text-right">Data</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{stats.recentStores && stats.recentStores.length > 0 ? stats.recentStores.map((store) => (
									<tr key={store.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-slate-100 flex justify-center items-center text-slate-600 font-bold text-xs uppercase shadow-sm">
													{store.name.charAt(0)}
												</div>
												<span className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">{store.name}</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${store.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
												store.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
													'bg-rose-50 text-rose-700 border-rose-200'
											}`}>
												{store.status === 'approved' ? 'Aprovada' : store.status === 'pending' ? 'Pendente' : 'Rejeitada'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium text-right">
											{new Date(store.createdAt).toLocaleDateString('pt-PT')}
										</td>
									</tr>
								)) : (
									<tr>
										<td colSpan="3" className="px-6 py-12 text-center text-slate-500">
											<div className="flex flex-col items-center">
												<svg className="w-10 h-10 text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
												<span>Nenhuma loja encontrada</span>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Recent Orders */}
				<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
					<div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
						<h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
							<svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
							Pedidos Recentes
						</h3>
						<span className="text-xs font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">{stats.recentOrders?.length || 0} recentes</span>
					</div>
					<div className="overflow-x-auto flex-1">
						<table className="w-full">
							<thead>
								<tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
									<th className="px-6 py-4">Cliente</th>
									<th className="px-6 py-4">Valor</th>
									<th className="px-6 py-4 text-right">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{stats.recentOrders && stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
									<tr key={order.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 rounded-full bg-slate-800 text-white flex justify-center items-center font-bold text-xs uppercase shadow-sm">
													{order.user?.name ? order.user.name.charAt(0) : 'U'}
												</div>
												<div>
													<div className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{order.user?.name || 'Utilizador Desconhecido'}</div>
													<div className="text-xs text-slate-500 font-medium">{order.user?.email || 'Sem email'}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
											{Number(order.totalAmount).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
												order.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
													'bg-rose-50 text-rose-700 border-rose-200'
											}`}>
												{order.paymentStatus === 'paid' ? 'Pago' : order.paymentStatus === 'pending' ? 'Pendente' : 'Falhou'}
											</span>
										</td>
									</tr>
								)) : (
									<tr>
										<td colSpan="3" className="px-6 py-12 text-center text-slate-500">
											<div className="flex flex-col items-center">
												<svg className="w-10 h-10 text-slate-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
												<span>Nenhum pedido encontrado</span>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<style dangerouslySetInnerHTML={{
				__html: `
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in-up {
					animation: fadeInUp 0.5s ease-out forwards;
				}
			`}} />
		</div>
	);
};

export default AdminDashboard;
