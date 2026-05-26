import React, { useState } from 'react';
import {
	IoStorefrontOutline,
	IoGridOutline,
	IoBagCheckOutline,
	IoStatsChartOutline,
	IoAlertCircleOutline,
	IoFlashOutline,
	IoTicketOutline,
} from 'react-icons/io5';

import { useMyStore, useMyProducts, useMyStoreOrders } from '../../hooks/queries/useDashboard';
import OverviewTab from './store/OverviewTab';
import StoreInfoTab from './store/StoreInfoTab';
import ProductsTab from './store/ProductsTab';
import OrdersTab from './store/OrdersTab';
import StatisticsTab from './store/StatisticsTab';
import PromotionsTab from './store/PromotionsTab';
import CouponsTab from './store/CouponsTab';
import StoreDashboardSkeleton from './StoreDashboardSkeleton';


const TABS = [
	{ id: 'overview', label: 'Visão Geral', icon: IoStatsChartOutline },
	{ id: 'info', label: 'Informações', icon: IoStorefrontOutline },
	{ id: 'products', label: 'Produtos', icon: IoGridOutline },
	{ id: 'orders', label: 'Encomendas', icon: IoBagCheckOutline },
	{ id: 'statistics', label: 'Estatísticas', icon: IoStatsChartOutline },
	{ id: 'promotions', label: 'Impulsionar', icon: IoFlashOutline },
	{ id: 'coupons', label: 'Cupões', icon: IoTicketOutline },
];


const StoreDashboard = () => {
	const [activeTab, setActiveTab] = useState('overview');

	const {
		data: store,
		isLoading: storeLoading,
		isError: storeError,
		refetch: refetchStore,
	} = useMyStore();

	const {
		data: productsData,
		refetch: refetchProducts,
	} = useMyProducts();

	const products = productsData?.products ?? [];
	const productsPagination = productsData?.pagination;

	const {
		data: orders = [],
		refetch: refetchOrders,
	} = useMyStoreOrders();

	const loading = storeLoading;
	const error = storeError;
	const fetchAll = () => {
		refetchStore();
		refetchProducts();
		refetchOrders();
	};

	if (loading) {
		return <StoreDashboardSkeleton />;
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
				<IoAlertCircleOutline className="w-12 h-12 text-red-400" />
				<p className="text-base font-semibold text-[#1C1917]">Não foi possível carregar os dados da loja.</p>
				<button onClick={fetchAll} className="mt-2 px-5 py-2 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-dark transition-colors cursor-pointer">
					Tentar novamente
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-0">
			{/* Tab Bar */}
			<div className="flex gap-1 bg-white/60 rounded-2xl p-1 mb-6 overflow-x-auto shadow-sm border border-accent/5">
				{TABS.map(tab => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-1 justify-center ${activeTab === tab.id
								? 'bg-white text-accent shadow-sm border border-accent/20 font-display'
								: 'text-[#78716C] hover:text-[#1C1917] hover:bg-white/80'
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
			{activeTab === 'products' && <ProductsTab products={products} pagination={productsPagination} onRefresh={fetchAll} />}
			{activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchAll} />}
			{activeTab === 'statistics' && <StatisticsTab orders={orders} />}
			{activeTab === 'promotions' && <PromotionsTab store={store} products={products} onRefresh={fetchAll} />}
			{activeTab === 'coupons' && <CouponsTab />}
		</div>
	);
};

export default StoreDashboard;
