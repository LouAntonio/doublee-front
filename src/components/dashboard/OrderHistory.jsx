import React, { useState, useEffect } from 'react';
import { IoBagHandleOutline } from 'react-icons/io5';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await http.get('/orders');
				if (data?.success) {
					setOrders(data.data?.orders || []);
				} else {
					notyf.error('Erro ao carregar histórico de pedidos.');
				}
			} catch {
				notyf.error('Erro ao carregar pedidos.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (isLoading) {
		return <div className="flex items-center justify-center h-64 text-[#78716C] font-body">Carregando seus pedidos...</div>;
	}

	return (
		<div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
			<h2 className="text-xl font-semibold text-[#1C1917] mb-1 font-display">Histórico de Compras</h2>
			<p className="text-sm text-[#78716C] mb-6 font-body">Todos os seus pedidos e encomendas realizados na plataforma.</p>

			{orders.length === 0 ? (
				<div className="text-center py-20 bg-sand rounded-2xl border border-dashed border-accent/20">
					<span className="text-5xl mb-4 block">🛍️</span>
					<p className="text-base font-semibold text-[#1C1917] font-display">Ainda não efectuou nenhuma compra.</p>
					<p className="text-sm text-[#78716C] mt-1 font-body">Explore os nossos produtos e encontre o que procura.</p>
					<a href="/produtos" className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-dark transition-all duration-300 shadow-lg shadow-accent/20 hover:-translate-y-0.5">
                        Explorar produtos
						<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</a>
				</div>
			) : (
				<div className="space-y-4">
					{orders.map((order) => (
						<div key={order.id} className="p-4 border border-accent/10 rounded-xl hover:border-accent/30 hover:bg-orange-50/50 transition-all flex justify-between items-center gap-4">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-sand rounded-xl text-[#78716C]">
									<IoBagHandleOutline className="w-5 h-5" />
								</div>
								<div>
									<p className="font-semibold text-[#1C1917] text-sm font-display">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
									<p className="text-xs text-[#78716C] font-body">{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
								</div>
							</div>
							<div className="text-right shrink-0">
								<p className="font-bold text-[#1C1917] text-sm font-display">{Number(order.totalAmount).toLocaleString('pt-AO')} Kz</p>
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
