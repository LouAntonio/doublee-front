import React, { useEffect, useState } from 'react';
import apiRequest, { notyf } from '../../services/api';

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await apiRequest('/admin/dashboard', {
                method: 'GET',
                admin: true
            });
            if (res.success && res.data) {
                setStats(res.data);
            } else {
                notyf.error(res.msg || 'Erro ao carregar estatísticas.');
            }
        } catch (error) {
            console.error(error);
            notyf.error('Erro de conexão ao carregar analytics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // --- Skeleton Loader Components ---
    const StatSkeleton = () => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                <div className="h-4 bg-slate-100 rounded w-16"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-32"></div>
        </div>
    );

    const ActivitySkeleton = () => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 text-slate-400">
                        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading && !stats) {
        return (
            <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatSkeleton />
                    <StatSkeleton />
                    <StatSkeleton />
                    <StatSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ActivitySkeleton />
                    <ActivitySkeleton />
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Receita Total',
            value: Number(stats?.totalRevenue || 0).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }),
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12V6m0 16v-2m-3-4H6a2 2 0 110-4h12a2 2 0 110 4M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4"></path></svg>,
            color: 'from-emerald-400 to-teal-500',
            trend: '+12.5%'
        },
        {
            title: 'Vendas Totais',
            value: stats?.totalOrders || 0,
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0m8 4v4a1 1 0 01-1 1H7a1 1 0 01-1-1v-4m10 0a2 2 0 100-4 2 2 0 000 4zM8 11a2 2 0 100-4 2 2 0 000 4z"></path></svg>,
            color: 'from-orange-400 to-rose-500',
            trend: '+8.2%'
        },
        {
            title: 'Utilizadores Registados',
            value: stats?.totalUsers || 0,
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
            color: 'from-blue-400 to-indigo-500',
            trend: '+5.4%'
        },
        {
            title: 'Lojas na Plataforma',
            value: stats?.totalStores || 0,
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>,
            color: 'from-violet-400 to-purple-500',
            trend: '+3.1%'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                    {card.icon}
                                </div>
                                <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                    {card.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{card.value}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity: Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0m8 4v4a1 1 0 01-1 1H7a1 1 0 01-1-1v-4m10 0a2 2 0 100-4 2 2 0 000 4zM8 11a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                            Últimas Encomendas
                        </h3>
                        <button className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">Ver todas</button>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentOrders?.length > 0 ? (
                            stats.recentOrders.map((order, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-xl -mx-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                        {order.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{order.user?.name || 'Utilizador Anónimo'}</p>
                                        <p className="text-xs text-slate-500 truncate">{new Date(order.createdAt).toLocaleString('pt-AO')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-600">{Number(order.totalAmount).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-slate-400">Sem atividade recente.</div>
                        )}
                    </div>
                </div>

                {/* Recent Activity: Stores */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            Novas Lojas
                        </h3>
                        <button className="text-xs font-bold text-slate-400 hover:text-indigo-500 transition-colors">Ver todas</button>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentStores?.length > 0 ? (
                            stats.recentStores.map((store, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-xl -mx-2">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100 shadow-sm">
                                        {store.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{store.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{new Date(store.createdAt).toLocaleDateString('pt-AO')}</p>
                                    </div>
                                    <div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${store.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            store.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {store.status === 'approved' ? 'Ativa' : store.status === 'pending' ? 'Pendente' : store.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-slate-400">Sem novas lojas.</div>
                        )}
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
                    animation: fadeInUp 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default AdminAnalytics;
