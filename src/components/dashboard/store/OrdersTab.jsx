import React, { useState } from 'react';
import apiRequest, { notyf } from '../../../services/api';
import { formatCurrency } from '../../../utils/currency';
import { ORDER_STATUS_MAP, STATUS_COLOR } from './constants';
import EmptyState from './ui/EmptyState';

const OrdersTab = ({ orders, onRefresh }) => {
	const [updatingId, setUpdatingId] = useState(null);

	const handleStatusChange = async (orderId, newStatus) => {
		setUpdatingId(orderId);
		try {
			const data = await apiRequest(`/stores/orders/${orderId}/status`, {
				method: 'PATCH',
				body: JSON.stringify({ status: newStatus }),
			});
			if (data.success) {
				notyf.success('Estado actualizado!');
				onRefresh();
			} else {
				notyf.error(data.msg || 'Erro ao actualizar estado.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao conectar com o servidor.');
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<div>
			<div className="mb-6">
				<h2 className="text-lg font-bold text-gray-900">Encomendas</h2>
				<p className="text-sm text-gray-400">{orders.length} encomenda{orders.length !== 1 ? 's' : ''} recebidas.</p>
			</div>

			{orders.length === 0 ? (
				<EmptyState emoji="📦" title="Sem encomendas ainda" description="Quando os clientes fizerem encomendas, aparecerão aqui." />
			) : (
				<div className="space-y-3">
					{orders.map(order => {
						const st = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.pending;
						return (
							<div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-gray-900 text-sm">Encomenda #{order.id?.slice(0, 8).toUpperCase()}</p>
										<p className="text-xs text-gray-400 mt-0.5">
											{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 mt-1 ${STATUS_COLOR[st.color]}`}>
											<st.Icon className="w-3 h-3" /> {st.label}
										</span>
									</div>
								</div>

								{/* Order Items */}
								{order.items && order.items.length > 0 && (
									<div className="bg-gray-50 rounded-xl p-3 space-y-2">
										{order.items.map(item => (
											<div key={item.id} className="flex items-center justify-between text-xs">
												<div className="flex items-center gap-2">
													{item.product?.image && (
														<img src={item.product.image} alt={item.product?.name} className="w-7 h-7 rounded-lg object-cover" />
													)}
													<span className="text-gray-700 font-medium">{item.product?.name || 'Produto'}</span>
													<span className="text-gray-400">x{item.quantity}</span>
												</div>
												<span className="text-gray-900 font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</span>
											</div>
										))}
									</div>
								)}

								{/* Status Changer */}
								<div className="flex items-center gap-2 pt-1">
									<span className="text-xs text-gray-500 font-medium">Alterar estado:</span>
									<div className="flex flex-wrap gap-1.5">
										{Object.entries(ORDER_STATUS_MAP).map(([key, val]) => (
											<button
												key={key}
												onClick={() => order.status !== key && handleStatusChange(order.id, key)}
												disabled={order.status === key || updatingId === order.id}
												className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all border cursor-pointer disabled:cursor-not-allowed ${order.status === key
													? `${STATUS_COLOR[val.color]} opacity-100`
													: 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 opacity-60 hover:opacity-100'
												}`}
											>
												{updatingId === order.id && order.status !== key ? '...' : val.label}
											</button>
										))}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default OrdersTab;
