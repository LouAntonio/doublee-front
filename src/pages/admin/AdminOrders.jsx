import React, { useState } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoEyeOutline, IoSearchOutline, IoChevronDown } from 'react-icons/io5';
import { useAdminOrders, useConfirmPayment, useRejectPayment } from '../../hooks/queries/useOrders';
import { formatCurrency } from '../../utils/currency';

const PAYMENT_STATUS_MAP = {
	pending: { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
	awaiting_confirmation: { label: 'Aguardar Confirmação', class: 'bg-blue-50 text-blue-700 border-blue-200' },
	paid: { label: 'Pago', class: 'bg-green-50 text-green-700 border-green-200' },
	failed: { label: 'Falhou', class: 'bg-red-50 text-red-700 border-red-200' },
	refunded: { label: 'Reembolsado', class: 'bg-purple-50 text-purple-700 border-purple-200' },
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

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
			<div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-display font-semibold text-[#1C1917]">Detalhes da Encomenda</h3>
					<button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] cursor-pointer text-xl">&times;</button>
				</div>

				<div className="space-y-3 text-sm">
					<p><strong>Pedido:</strong> #{order.id.slice(0, 8).toUpperCase()}</p>
					<p><strong>Cliente:</strong> {order.user?.name} {order.user?.surname} ({order.user?.email})</p>
					<p><strong>Valor:</strong> {formatCurrency(order.totalAmount)}</p>
					<p><strong>Método:</strong> {order.paymentMethod === 'multicaixa_express' ? 'Multicaixa Express' : order.paymentMethod === 'transferencia_bancaria' ? 'Transferência Bancária' : '-'}</p>
					<p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString('pt-AO')}</p>
				</div>

				{order.paymentProof && (
					<div className="mt-4">
						<p className="text-sm font-semibold text-[#1C1917] mb-2">Comprovativo de Pagamento:</p>
						<a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
							<img src={order.paymentProof} alt="Comprovativo" className="max-w-full max-h-96 rounded-xl border border-accent/10 object-contain bg-sand" />
						</a>
					</div>
				)}

				{order.paymentStatus === 'awaiting_confirmation' && (
					<div className="mt-6 space-y-3">
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
							<div className="space-y-2">
								<textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
									placeholder="Motivo da rejeição (opcional)"
									className="w-full px-4 py-2 border border-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" rows={2} />
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