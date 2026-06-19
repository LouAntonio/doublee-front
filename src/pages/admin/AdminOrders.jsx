import React, { useState } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoDocumentOutline, IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { useAdminOrders, useConfirmPayment, useRejectPayment } from '../../hooks/queries/useOrders';
import { formatCurrency } from '../../utils/currency';

const PAYMENT_STATUS_MAP = {
	pending: { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
	awaiting_confirmation: { label: 'Aguardar Confirmação', class: 'bg-blue-50 text-blue-700 border-blue-200' },
	paid: { label: 'Pago', class: 'bg-green-50 text-green-700 border-green-200' },
	failed: { label: 'Falhou', class: 'bg-red-50 text-red-700 border-red-200' },
	refunded: { label: 'Reembolsado', class: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const PAYMENT_LABELS = {
	multicaixa_express: 'Multicaixa Express',
	transferencia_bancaria: 'Transferência Bancária',
};

const ProofModal = ({ order, onClose }) => {
	const { mutateAsync: confirmPayment, isPending: confirming } = useConfirmPayment();
	const { mutateAsync: rejectPayment, isPending: rejecting } = useRejectPayment();
	const [rejectReason, setRejectReason] = useState('');
	const [showRejectInput, setShowRejectInput] = useState(false);

	const handleConfirm = async () => {
		await confirmPayment(order.id);
		onClose();
	};

	const handleReject = async () => {
		await rejectPayment({ orderId: order.id, reason: rejectReason });
		onClose();
	};

	const badge = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.pending;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
			<div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-display font-semibold text-[#1C1917]">Detalhes da Encomenda</h3>
					<button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] cursor-pointer text-xl leading-none">&times;</button>
				</div>

				<div className="space-y-4">

					{/* Order Info */}
					<div className="bg-sand rounded-xl p-4 space-y-1 text-sm text-[#1C1917]">
						<p><strong>Pedido:</strong> #{order.id.slice(0, 8).toUpperCase()}</p>
						<p><strong>Cliente:</strong> {order.user?.name} {order.user?.surname}</p>
						<p className="text-[#78716C]">{order.user?.email}{order.user?.phone ? ` \u2022 ${order.user.phone}` : ''}</p>
						<p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString('pt-AO')}</p>
						<p>
							<strong>Opção:</strong>{' '}
							{order.deliveryOption === 'pickup' ? 'Levantar na Sede' : 'Entrega ao Domicílio'}
							{order.deliveryOption === 'delivery' && order.deliveryZone && (
								<> &mdash; {order.deliveryZone.name}</>
							)}
						</p>
					</div>

					{/* Payment Details */}
					<div className="bg-white border border-accent/10 rounded-xl p-4">
						<div className="flex items-center justify-between mb-3">
							<h4 className="text-sm font-semibold text-[#1C1917]">Dados do Pagamento</h4>
							<span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.class}`}>{badge.label}</span>
						</div>
						<div className="space-y-1.5 text-sm text-[#1C1917]">
							<div className="flex justify-between">
								<span className="text-[#78716C]">Método</span>
								<span className="font-medium">{PAYMENT_LABELS[order.paymentMethod] || '-'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#78716C]">Valor</span>
								<span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
							</div>
							{order.paymentProofSubmittedAt && (
								<div className="flex justify-between">
									<span className="text-[#78716C]">Comprovativo submetido</span>
									<span>{new Date(order.paymentProofSubmittedAt).toLocaleString('pt-AO')}</span>
								</div>
							)}
							{order.paymentConfirmedAt && (
								<div className="flex justify-between">
									<span className="text-[#78716C]">Pagamento confirmado</span>
									<span>{new Date(order.paymentConfirmedAt).toLocaleString('pt-AO')}</span>
								</div>
							)}
							{order.confirmedBy && (
								<div className="flex justify-between">
									<span className="text-[#78716C]">Confirmado por</span>
									<span>{order.confirmedBy.name}</span>
								</div>
							)}
						</div>
					</div>

					{/* Payment Proof */}
					{order.paymentProof && (
						<div className="bg-white border border-accent/10 rounded-xl p-4">
							<h4 className="text-sm font-semibold text-[#1C1917] mb-3">Comprovativo de Pagamento</h4>
							{order.paymentProof.match(/\.pdf/i) ? (
								<a href={order.paymentProof} target="_blank" rel="noopener noreferrer"
									className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
									<IoDocumentOutline className="w-8 h-8 text-red-500 shrink-0" />
									<div className="text-sm">
										<p className="font-medium text-[#1C1917]">Documento PDF</p>
										<p className="text-xs text-[#78716C]">Clique para abrir o comprovativo</p>
									</div>
									<IoEyeOutline className="w-5 h-5 text-red-500 ml-auto shrink-0" />
								</a>
							) : (
								<a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
									<img src={order.paymentProof} alt="Comprovativo" className="max-w-full max-h-96 rounded-xl border border-accent/10 object-contain bg-sand" />
								</a>
							)}
						</div>
					)}

					{/* Store Orders / Items */}
					{order.storeOrders?.length > 0 && (
						<div className="bg-white border border-accent/10 rounded-xl p-4">
							<h4 className="text-sm font-semibold text-[#1C1917] mb-3">Itens da Encomenda</h4>
							<div className="space-y-3">
								{order.storeOrders.map((so) => (
									<div key={so.id} className="border border-accent/10 rounded-xl overflow-hidden">
										<div className="flex items-center gap-2 px-3 py-2 bg-sand text-sm font-medium text-[#1C1917] border-b border-accent/10">
											{so.store?.logo && (
												<img src={so.store.logo} alt="" className="w-5 h-5 rounded-full object-cover" />
											)}
											{so.store?.name || 'Loja'}
											<span className="ml-auto text-xs text-[#78716C] font-normal">{so.status || '-'}</span>
										</div>
										<div className="divide-y divide-accent/5">
											{so.items?.map((item) => (
												<div key={item.id} className="flex items-center gap-3 px-3 py-2 text-sm text-[#1C1917]">
													{item.product?.image && (
														<img src={item.product.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-accent/10 shrink-0" />
													)}
													<span className="flex-1 truncate">{item.product?.name || 'Produto'}</span>
													<span className="text-[#78716C] shrink-0">x{item.quantity}</span>
													<span className="font-medium shrink-0">{formatCurrency(item.subtotal)}</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Delivery Address */}
					{order.deliveryOption !== 'pickup' && order.shippingAddress && (
						<div className="bg-white border border-accent/10 rounded-xl p-4 text-sm text-[#1C1917]">
							<h4 className="font-semibold mb-1">Morada de Entrega</h4>
							<p className="text-[#78716C]">{order.shippingAddress}</p>
						</div>
					)}

					{/* Actions */}
					{order.paymentStatus === 'awaiting_confirmation' && (
						<div className="space-y-3 pt-2">
							<div className="flex gap-3">
								<button onClick={handleConfirm} disabled={confirming}
									className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
									<IoCheckmarkCircle className="w-4 h-4" /> {confirming ? 'A confirmar...' : 'Confirmar Pagamento'}
								</button>
								<button onClick={() => setShowRejectInput(!showRejectInput)} disabled={rejecting}
									className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
									<IoCloseCircle className="w-4 h-4" /> Rejeitar
								</button>
							</div>
							{showRejectInput && (
								<div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
									<textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
										placeholder="Motivo da rejeição (opcional)"
										className="w-full px-4 py-2 border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300" rows={2} />
									<button onClick={handleReject} disabled={rejecting}
										className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 cursor-pointer">
										{rejecting ? 'A rejeitar...' : 'Confirmar Rejeição'}
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const AdminOrders = () => {
	const [filters, setFilters] = useState({ page: 1, limit: 20, paymentStatus: '', search: '' });
	const [selectedOrder, setSelectedOrder] = useState(null);
	const { data, isLoading } = useAdminOrders(filters);

	const orders = data?.orders || [];
	const pagination = data?.pagination;

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
	};

	return (
		<div>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h2 className="text-xl font-bold text-[#1C1917] font-display">Encomendas</h2>
					<p className="text-sm text-[#78716C]">Gestão de encomendas e pagamentos</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-2xl border border-accent/10 shadow-sm p-4 mb-6">
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="flex-1 relative">
						<IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
						<input type="text" value={filters.search}
							onChange={(e) => handleFilterChange('search', e.target.value)}
							placeholder="Pesquisar por ID, nome ou email..."
							className="w-full pl-10 pr-4 py-2.5 border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
					</div>
					<select value={filters.paymentStatus}
						onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
						className="px-4 py-2.5 border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
						<option value="">Todos os pagamentos</option>
						<option value="pending">Pendente</option>
						<option value="awaiting_confirmation">Aguardar Confirmação</option>
						<option value="paid">Pago</option>
						<option value="failed">Falhou</option>
						<option value="refunded">Reembolsado</option>
					</select>
				</div>
			</div>

			{/* Orders List */}
			{isLoading ? (
				<div className="text-center py-12 text-[#78716C]">A carregar...</div>
			) : orders.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-2xl border border-dashed border-accent/20">
					<p className="text-[#78716C] font-display">Nenhuma encomenda encontrada.</p>
				</div>
			) : (
				<div className="space-y-3">
					{orders.map((order) => {
						const badge = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.pending;
						return (
							<div key={order.id}
								className="bg-white rounded-2xl border border-accent/10 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
								onClick={() => setSelectedOrder(order)}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 min-w-0">
										<div>
											<p className="font-semibold text-[#1C1917] text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
											<p className="text-xs text-[#78716C]">{order.user?.name} {order.user?.surname}</p>
										</div>
									</div>
									<div className="text-right shrink-0 flex items-center gap-3">
										<span className="text-sm font-bold text-[#1C1917]">{formatCurrency(order.totalAmount)}</span>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.class}`}>{badge.label}</span>
										{order.paymentStatus === 'awaiting_confirmation' && (
											<span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
												<IoEyeOutline className="w-4 h-4" />
											</span>
										)}
									</div>
								</div>
								<div className="mt-2 flex items-center gap-3 text-xs text-[#78716C]">
									<span>{new Date(order.createdAt).toLocaleDateString('pt-AO')}</span>
									<span>{order.storeOrders?.length || 0} loja{(order.storeOrders?.length || 0) !== 1 ? 's' : ''}</span>
									{order.paymentMethod && <span>{order.paymentMethod === 'multicaixa_express' ? 'Multicaixa Express' : 'Transferência'}</span>}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-6">
					<button disabled={filters.page <= 1}
						onClick={() => handleFilterChange('page', filters.page - 1)}
						className="px-3 py-1.5 border border-accent/20 rounded-xl text-sm disabled:opacity-30 cursor-pointer hover:bg-sand">
						Anterior
					</button>
					<span className="text-sm text-[#78716C]">Página {pagination.page} de {pagination.totalPages}</span>
					<button disabled={filters.page >= pagination.totalPages}
						onClick={() => handleFilterChange('page', filters.page + 1)}
						className="px-3 py-1.5 border border-accent/20 rounded-xl text-sm disabled:opacity-30 cursor-pointer hover:bg-sand">
						Seguinte
					</button>
				</div>
			)}

			{selectedOrder && (
				<ProofModal order={selectedOrder} onClose={() => { setSelectedOrder(null); }} />
			)}
		</div>
	);
};

export default AdminOrders;