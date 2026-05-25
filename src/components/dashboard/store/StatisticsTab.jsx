import React, { useState, useMemo } from 'react';
import {
	IoCalendarOutline,
	IoTrendingUpOutline,
	IoBasketOutline,
	IoCalculatorOutline,
	IoStatsChartOutline,
	IoChevronDownOutline,
} from 'react-icons/io5';
import { formatCurrency } from '../../../utils/currency';
import StatCard from './ui/StatCard';
import EmptyState from './ui/EmptyState';
import { ORDER_STATUS_MAP, STATUS_COLOR } from './constants';

const StatisticsTab = ({ orders = [] }) => {
	const years = useMemo(() => {
		const uniqueYears = [...new Set(orders.map(o => new Date(o.createdAt).getFullYear()))];
		if (uniqueYears.length === 0) return [new Date().getFullYear()];
		return uniqueYears.sort((a, b) => b - a);
	}, [orders]);

	const months = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	const currentMonth = new Date().getMonth();
	const currentYear = new Date().getFullYear();

	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);

	const filteredOrders = useMemo(() => {
		return orders.filter(order => {
			const date = new Date(order.createdAt);
			return date.getFullYear() === Number(selectedYear) && date.getMonth() === Number(selectedMonth);
		});
	}, [orders, selectedYear, selectedMonth]);

	const stats = useMemo(() => {
		const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered');
		const revenue = deliveredOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
		const orderCount = filteredOrders.length;
		const avgValue = orderCount > 0 ? revenue / orderCount : 0;

		// Calculate top selling products
		const productStats = {};
		filteredOrders.forEach(order => {
			order.items?.forEach(item => {
				const productId = item.productId || item.product?.id;
				if (!productId) return;

				if (!productStats[productId]) {
					productStats[productId] = {
						name: item.product?.name || 'Produto Desconhecido',
						quantity: 0,
						revenue: 0,
						image: item.product?.image
					};
				}
				productStats[productId].quantity += item.quantity;
				productStats[productId].revenue += item.quantity * item.unitPrice;
			});
		});

		const topProducts = Object.values(productStats)
			.sort((a, b) => b.quantity - a.quantity)
			.slice(0, 5);

		return { revenue, orderCount, avgValue, topProducts };
	}, [filteredOrders]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<div>
					<h2 className="text-lg font-bold text-[#1C1917] font-display">Estatísticas</h2>
					<p className="text-sm text-[#78716C]">Análise detalhada do desempenho da sua loja.</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative">
						<select
							value={selectedMonth}
							onChange={(e) => setSelectedMonth(Number(e.target.value))}
							className="appearance-none bg-white border border-accent/20 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
						>
							{months.map((month, index) => (
								<option key={month} value={index}>{month}</option>
							))}
						</select>
						<IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C] pointer-events-none" />
					</div>

					<div className="relative">
						<select
							value={selectedYear}
							onChange={(e) => setSelectedYear(Number(e.target.value))}
							className="appearance-none bg-white border border-accent/20 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer"
						>
							{years.map(year => (
								<option key={year} value={year}>{year}</option>
							))}
						</select>
						<IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C] pointer-events-none" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoTrendingUpOutline} label="Receita Mensal" value={formatCurrency(stats.revenue)} colorClass="bg-green-50 text-green-600" />
				</div>
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoBasketOutline} label="Total Encomendas" value={stats.orderCount} colorClass="bg-blue-50 text-blue-600" />
				</div>
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoCalculatorOutline} label="Ticket Médio" value={formatCurrency(stats.avgValue)} colorClass="bg-purple-50 text-purple-600" />
				</div>
				<div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
					<StatCard icon={IoStatsChartOutline} label="Taxa de Entrega" value={stats.orderCount > 0 ? `${((filteredOrders.filter(o => o.status === 'delivered').length / stats.orderCount) * 100).toFixed(0)}%` : '0%'} colorClass="bg-amber-50 text-amber-600" />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Selling Products */}
				<div className="bg-white rounded-2xl border border-accent/10 shadow-md p-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
					<h3 className="text-sm font-bold text-[#1C1917] mb-4 font-display">Produtos Mais Vendidos</h3>
					{stats.topProducts.length === 0 ? (
						<div className="py-10 text-center">
							<p className="text-[#78716C] text-sm">Sem dados de vendas para este período.</p>
						</div>
					) : (
						<div className="space-y-4">
							{stats.topProducts.map((product, index) => (
								<div key={index} className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-sand border border-accent/10 overflow-hidden shrink-0">
										{product.image ? (
											<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
										) : (
											<div className="w-full h-full flex items-center justify-center text-[#78716C]">
												<IoBasketOutline className="w-6 h-6" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-[#1C1917] truncate">{product.name}</p>
										<p className="text-xs text-[#78716C]">{product.quantity} vendas</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-bold text-[#1C1917]">{formatCurrency(product.revenue)}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Orders Breakdown by Status */}
				<div className="bg-white rounded-2xl border border-accent/10 shadow-md p-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
					<h3 className="text-sm font-bold text-[#1C1917] mb-4 font-display">Estado das Encomendas</h3>
					{filteredOrders.length === 0 ? (
						<div className="py-10 text-center">
							<p className="text-[#78716C] text-sm">Nenhuma encomenda neste período.</p>
						</div>
					) : (
						<div className="space-y-3">
							{Object.entries(ORDER_STATUS_MAP).map(([key, st]) => {
								const count = filteredOrders.filter(o => o.status === key).length;
								const percentage = filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0;
								return (
									<div key={key} className="space-y-1.5">
										<div className="flex items-center justify-between text-xs">
											<span className="flex items-center gap-1.5 font-medium text-[#1C1917]">
												<st.Icon className="w-3.5 h-3.5" />
												{st.label}
											</span>
											<span className="font-bold text-[#1C1917]">{count} ({percentage.toFixed(0)}%)</span>
										</div>
										<div className="w-full h-2 bg-sand rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full ${STATUS_COLOR[st.color].split(' ')[0].replace('bg-', 'bg-').replace('-50', '-500')}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>

			{filteredOrders.length === 0 && (
				<EmptyState
					emoji="📊"
					title="Sem dados para este período"
					description={`Não existem encomendas registradas para ${months[selectedMonth]} de ${selectedYear}.`}
				/>
			)}
		</div>
	);
};

export default StatisticsTab;
