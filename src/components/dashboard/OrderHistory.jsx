import React, { useState, useEffect } from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
import apiRequest, { notyf } from '../../services/api';

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await apiRequest('/users/orders', { method: 'GET' });
				if (data.success) {
					setOrders(data.orders || []);
				} else {
					notyf.error('Erro ao carregar histórico de pedidos.');
				}
			} catch (error) {
				notyf.error('Erro ao carregar pedidos.');
				console.error('Fetch orders error:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (isLoading) {
		return <div className="flex items-center justify-center h-64 text-gray-500">Carregando seus pedidos...</div>;
	}

	return (
		<div>
			<h2 className="text-xl font-semibold text-gray-900 mb-1">Histórico de Compras</h2>
			<p className="text-sm text-gray-400 mb-6">Todos os seus pedidos e encomendas realizados na plataforma.</p>

			{orders.length === 0 ? (
				<div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
					<span className="text-5xl mb-4 block">🛍️</span>
					<p className="text-base font-semibold text-gray-700">Ainda não efectuou nenhuma compra.</p>
					<p className="text-sm text-gray-400 mt-1">Explore os nossos produtos e encontre o que procura.</p>
					<a href="/produtos" className="mt-5 inline-block px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                        Explorar produtos
					</a>
				</div>
			) : (
				<div className="space-y-4">
					{orders.map((order) => (
						<div key={order.id} className="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all flex justify-between items-center gap-4">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-gray-100 rounded-xl text-gray-500">
									<IoBagHandleOutline className="w-5 h-5" />
								</div>
								<div>
									<p className="font-semibold text-gray-900 text-sm">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
									<p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
								</div>
							</div>
							<div className="text-right shrink-0">
								<p className="font-bold text-gray-900 text-sm">{Number(order.totalAmount).toLocaleString('pt-AO')} Kz</p>
								<span className={`text-xs px-2.5 py-1 rounded-full font-medium ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
								}`}>
									{order.paymentStatus === 'paid' ? '✓ Pago' : '⏳ Pendente'}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default OrderHistory;
