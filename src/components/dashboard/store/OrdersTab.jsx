import React, { useState } from 'react';
import http from '../../../services/http';
import { notyf } from '../../../utils/notyf';
import { formatCurrency } from '../../../utils/currency';
import { ORDER_STATUS_MAP, STATUS_COLOR } from './constants';
import EmptyState from './ui/EmptyState';

const SELLER_TRANSITIONS = {
	pending: ['processing', 'cancelled'],
	processing: ['shipped'],
	shipped: ['delivered'],
	delivered: [],
	received_at_sede: [],
	out_for_delivery: [],
	delivered_to_customer: [],
	ready_for_pickup: [],
	picked_up: [],
	cancelled: [],
};

const OrdersTab = ({ orders, onRefresh }) => {
	const [updatingId, setUpdatingId] = useState(null);

	const handleStatusChange = async (orderId, newStatus) => {
		setUpdatingId(orderId);
		try {
			const data = await http.patch(`/orders/store/orders/${orderId}/status`, { status: newStatus });
			if (data?.success) {
				notyf.success('Estado actualizado!');
				onRefresh();
			} else {
				notyf.error(data?.msg || 'Erro ao actualizar estado.');
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
			<div className="mb-6">
				<h2 className="text-lg font-bold text-[#1C1917] font-display">Encomendas</h2>
				<p className="text-sm text-[#78716C]">{orders.length} encomenda{orders.length !== 1 ? 's' : ''} recebidas.</p>
			</div>

			{orders.length === 0 ? (
				<EmptyState emoji="📦" title="Sem encomendas ainda" description="Quando os clientes fizerem encomendas, aparecerão aqui." />
			) : (
				<div className="space-y-3">
					{orders.map((order, idx) => {
						const st = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
						const paymentPaid = order.order?.paymentStatus === 'paid';
						const allowedNext = SELLER_TRANSITIONS[order.status] || [];
						return (
							<div key={order.id} className="bg-white rounded-2xl border border-accent/10 shadow-md p-4 space-y-3 hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.1 * (idx + 1)}s`, animationFillMode: 'forwards' }}>
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-[#1C1917] text-sm">Encomenda #{order.id?.slice(0, 8).toUpperCase()}</p>
										<p className="text-xs text-[#78716C] mt-0.5">
											{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-[#1C1917]">{formatCurrency(order.total)}</p>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 mt-1 ${STATUS_COLOR[st.color]}`}>
											<st.Icon className="w-3 h-3" /> {st.label}
										</span>
									</div>
								</div>

								{/* Order Items */}
								{order.items && order.items.length > 0 && (
									<div className="bg-sand rounded-xl p-3 space-y-2">
										{order.items.map(item => (
											<div key={item.id} className="flex items-center justify-between text-xs">
												<div className="flex items-center gap-2">
													{item.product?.image && (
														<img src={item.product.image} alt={item.product?.name} className="w-7 h-7 rounded-lg object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '/images/produto.png'; }} />
													)}
													<span className="text-[#1C1917] font-medium">{item.product?.name || 'Produto'}</span>
													<span className="text-[#78716C]">x{item.quantity}</span>
												</div>
												<span className="text-[#1C1917] font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</span>
											</div>
										))}
									</div>
								)}

								{/* Payment Status Warning */}
								{!paymentPaid && (
									<div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
										<p className="text-xs text-amber-700">
											Aguardar confirmação de pagamento para alterar o estado da encomenda.
										</p>
									</div>
								)}

								{/* Status Changer */}
								{allowedNext.length > 0 && (
									<div className="flex items-center gap-2 pt-1">
										<span className="text-xs text-[#78716C] font-medium shrink-0">Alterar estado:</span>
										<div className="flex flex-wrap gap-1.5">
											{allowedNext.map((key) => {
												const val = ORDER_STATUS_MAP[key];
												if (!val) return null;
												return (
													<button
														key={key}
														onClick={() => handleStatusChange(order.id, key)}
														disabled={!paymentPaid || updatingId === order.id}
														className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all border cursor-pointer disabled:cursor-not-allowed ${!paymentPaid
															? 'bg-gray-50 text-gray-400 border-gray-200'
															: 'bg-white text-[#78716C] border-accent/20 hover:bg-sand opacity-60 hover:opacity-100'
														}`}
													>
														{updatingId === order.id ? '...' : val.label}
													</button>
												);
											})}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default OrdersTab;
