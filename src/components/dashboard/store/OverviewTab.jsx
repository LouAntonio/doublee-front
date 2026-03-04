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
			<div>
				<h2 className="text-lg font-bold text-gray-900">Visão Geral</h2>
				<p className="text-sm text-gray-400">Resumo da atividade da sua loja.</p>
			</div>

			<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
				<StatCard icon={IoGridOutline} label="Produtos" value={products.length} colorClass="bg-blue-50 text-blue-600" />
				<StatCard icon={IoBagCheckOutline} label="Encomendas" value={orders.length} colorClass="bg-purple-50 text-purple-600" />
				<StatCard icon={IoTimeOutline} label="Pendentes" value={pendingOrders} colorClass="bg-amber-50 text-amber-600" />
				<StatCard icon={IoStatsChartOutline} label="Receita total" value={formatCurrency(totalRevenue)} colorClass="bg-green-50 text-green-600" />
			</div>

			{/* Store banner preview */}
			{store && (
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					{store.banner ? (
						<img src={store.banner} alt="Banner" className="w-full h-32 object-cover" />
					) : (
						<div className="w-full h-32 bg-gradient-to-r from-primary-600 to-primary-500" />
					)}
					<div className="px-5 py-4 flex items-center gap-4">
						{store.logo ? (
							<img src={store.logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm -mt-9" />
						) : (
							<div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm -mt-9 flex items-center justify-center">
								<IoStorefrontOutline className="w-7 h-7 text-gray-400" />
							</div>
						)}
						<div>
							<p className="font-bold text-gray-900 text-base">{store.name}</p>
							<p className="text-xs text-gray-400">{store.province}{store.location ? ` · ${store.location}` : ''}</p>
						</div>
						<div className="ml-auto flex items-center gap-1 text-amber-500 text-sm font-semibold">
							<IoStarOutline className="w-4 h-4" />
							{Number(store.rating || 0).toFixed(1)}
							<span className="text-gray-400 font-normal ml-1">({store.qtdRatings} avaliações)</span>
						</div>
					</div>
				</div>
			)}

			{/* Recent orders */}
			<div>
				<p className="text-sm font-semibold text-gray-700 mb-3">Encomendas recentes</p>
				{orders.length === 0 ? (
					<EmptyState emoji="📦" title="Sem encomendas ainda" description="As encomendas da sua loja aparecerão aqui." />
				) : (
					<div className="space-y-2">
						{orders.slice(0, 5).map(order => {
							const st = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
							return (
								<div key={order.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
									<div>
										<p className="text-sm font-semibold text-gray-900">#{order.id?.slice(0, 8).toUpperCase()}</p>
										<p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
									</div>
									<div className="flex items-center gap-3">
										<span className="font-bold text-sm text-gray-900">{formatCurrency(order.total)}</span>
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
