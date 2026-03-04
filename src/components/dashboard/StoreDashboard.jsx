import React, { useState, useEffect, useCallback } from 'react';
import {
	IoStorefrontOutline,
	IoGridOutline,
	IoBagCheckOutline,
	IoStatsChartOutline,
	IoAlertCircleOutline,
} from 'react-icons/io5';
import apiRequest from '../../services/api';
import OverviewTab from './store/OverviewTab';
import StoreInfoTab from './store/StoreInfoTab';
import ProductsTab from './store/ProductsTab';
import OrdersTab from './store/OrdersTab';
import StatisticsTab from './store/StatisticsTab';

const TABS = [
	{ id: 'overview', label: 'Visão Geral', icon: IoStatsChartOutline },
	{ id: 'info', label: 'Informações', icon: IoStorefrontOutline },
	{ id: 'products', label: 'Produtos', icon: IoGridOutline },
	{ id: 'orders', label: 'Encomendas', icon: IoBagCheckOutline },
	{ id: 'statistics', label: 'Estatísticas', icon: IoStatsChartOutline },
];

const StoreDashboard = () => {
	const [activeTab, setActiveTab] = useState('overview');
	const [store, setStore] = useState(null);
	const [products, setProducts] = useState([]);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAll = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [storeRes, productsRes, ordersRes] = await Promise.all([
				apiRequest('/stores/mine', { method: 'GET' }),
				apiRequest('/stores/products', { method: 'GET' }),
				apiRequest('/stores/orders', { method: 'GET' }),
			]);

			if (storeRes.success) setStore(storeRes.data?.store || storeRes.data || null);
			if (productsRes.success) setProducts(productsRes.data?.products || productsRes.data || []);
			if (ordersRes.success) setOrders(ordersRes.data?.orders || ordersRes.data || []);
		} catch (err) {
			setError('Não foi possível carregar os dados da loja.');
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { fetchAll(); }, [fetchAll]);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-3">
				<div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
				<p className="text-sm text-gray-400">A carregar dados da loja...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
				<IoAlertCircleOutline className="w-12 h-12 text-red-400" />
				<p className="text-base font-semibold text-gray-700">{error}</p>
				<button onClick={fetchAll} className="mt-2 px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
					Tentar novamente
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-0">
			{/* Tab Bar */}
			<div className="flex gap-1 bg-gray-50 rounded-2xl p-1 mb-6 overflow-x-auto">
				{TABS.map(tab => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-1 justify-center ${activeTab === tab.id
								? 'bg-white text-primary-700 shadow-sm border border-gray-100'
								: 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
							}`}
						>
							<Icon className="w-4 h-4 shrink-0" />
							<span className="hidden sm:inline">{tab.label}</span>
						</button>
					);
				})}
			</div>

			{/* Tab Content */}
			{activeTab === 'overview' && <OverviewTab store={store} products={products} orders={orders} />}
			{activeTab === 'info' && <StoreInfoTab store={store} onUpdated={fetchAll} />}
			{activeTab === 'products' && <ProductsTab products={products} onRefresh={fetchAll} />}
			{activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchAll} />}
			{activeTab === 'statistics' && <StatisticsTab orders={orders} />}
		</div>
	);
};

export default StoreDashboard;
