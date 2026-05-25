import React from 'react';
import {
	IoGridOutline,
	IoBagCheckOutline,
	IoTimeOutline,
	IoStatsChartOutline,
	IoStorefrontOutline,
	IoStarOutline,
} from 'react-icons/io5';
import { formatCurrency } from '../../../utils/currency';
import { ORDER_STATUS_MAP, STATUS_COLOR } from './constants';
import StatCard from './ui/StatCard';
import EmptyState from './ui/EmptyState';

const OverviewTab = ({ store, products, orders }) => {
	const totalRevenue = orders
		.filter(o => o.status === 'delivered')
		.reduce((sum, o) => sum + Number(o.total || 0), 0);

	const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

	return (
		<div className="space-y-6">
			<div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<h2 className="text-lg font-bold text-[#1C1917] font-display">Visão Geral</h2>
				<p className="text-sm text-[#78716C]">Resumo da atividade da sua loja.</p>
			</div>

			<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoGridOutline} label="Produtos" value={products.length} colorClass="bg-blue-50 text-blue-600" />
				</div>
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoBagCheckOutline} label="Encomendas" value={orders.length} colorClass="bg-purple-50 text-purple-600" />
				</div>
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoTimeOutline} label="Pendentes" value={pendingOrders} colorClass="bg-amber-50 text-amber-600" />
				</div>
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoStatsChartOutline} label="Receita total" value={formatCurrency(totalRevenue)} colorClass="bg-green-50 text-green-600" />
				</div>
			</div>

			{/* Store banner preview */}
			{store && (
				<div className="bg-white rounded-2xl border border-accent/10 shadow-md overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
					{store.banner ? (
						<img src={store.banner} alt="Banner" className="w-full h-32 object-cover" />
					) : (
						<div className="w-full h-32 bg-gradient-to-r from-accent to-accent-dark" />
					)}
					<div className="px-5 py-4 flex items-center gap-4">
						{store.logo ? (
							<img src={store.logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-accent/10 shadow-sm -mt-9" />
						) : (
							<div className="w-14 h-14 rounded-xl bg-white border border-accent/10 shadow-sm -mt-9 flex items-center justify-center">
								<IoStorefrontOutline className="w-7 h-7 text-[#78716C]" />
							</div>
						)}
						<div>
							<p className="font-bold text-[#1C1917] text-base font-display">{store.name}</p>
							<p className="text-xs text-[#78716C]">{store.province}{store.location ? ` · ${store.location}` : ''}</p>
						</div>
						<div className="ml-auto flex items-center gap-1 text-amber-500 text-sm font-semibold">
							<IoStarOutline className="w-4 h-4" />
							{Number(store.rating || 0).toFixed(1)}
							<span className="text-[#78716C] font-normal ml-1">({store.qtdRatings} avaliações)</span>
						</div>
					</div>
				</div>
			)}

			{/* Recent orders */}
			<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
				<p className="text-sm font-semibold text-[#1C1917] mb-3 font-display">Encomendas recentes</p>
				{orders.length === 0 ? (
					<EmptyState emoji="📦" title="Sem encomendas ainda" description="As encomendas da sua loja aparecerão aqui." />
				) : (
					<div className="space-y-2">
						{orders.slice(0, 5).map(order => {
							const st = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
							return (
								<div key={order.id} className="flex items-center justify-between bg-white rounded-xl border border-accent/10 shadow-sm px-4 py-3 hover:shadow-md transition-shadow duration-300">
									<div>
										<p className="text-sm font-semibold text-[#1C1917]">#{order.id?.slice(0, 8).toUpperCase()}</p>
										<p className="text-xs text-[#78716C]">{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
									</div>
									<div className="flex items-center gap-3">
										<span className="font-bold text-sm text-[#1C1917]">{formatCurrency(order.total)}</span>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${STATUS_COLOR[st.color]}`}>
											<st.Icon className="w-3 h-3" />{st.label}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default OverviewTab;
