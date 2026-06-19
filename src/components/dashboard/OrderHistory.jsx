import React, { useState, useEffect } from 'react';
import { IoBagHandleOutline, IoCloudUploadOutline, IoEyeOutline, IoTrashOutline, IoDocumentOutline, IoCloseOutline } from 'react-icons/io5';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';
import { uploadToCloudinary } from '../../services/cloudinary';
import { useSubmitPaymentProof } from '../../hooks/queries/useOrders';
import { formatCurrency } from '../../utils/currency';
import { PAYMENT_COORDINATES } from '../../utils/payment';
import DashboardModal from './DashboardModal';
import { ORDER_STATUS_MAP, STATUS_COLOR } from './store/constants';

const getPaymentStatusBadge = (status) => {
	const map = {
		pending: { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border border-amber-200' },
		awaiting_confirmation: { label: 'Aguardar Confirmação', class: 'bg-blue-50 text-blue-700 border border-blue-200' },
		paid: { label: 'Pago', class: 'bg-green-50 text-green-700 border border-green-200' },
		failed: { label: 'Falhou', class: 'bg-red-50 text-red-700 border border-red-200' },
		refunded: { label: 'Reembolsado', class: 'bg-purple-50 text-purple-700 border border-purple-200' },
	};
	return map[status] || map.pending;
};

const OrderDetailsModal = ({ order, onClose }) => {
	const badge = getPaymentStatusBadge(order.paymentStatus);

	return (
		<DashboardModal isOpen={true} onClose={onClose} size="md">
			<div className="flex items-center justify-between px-6 py-4 border-b border-accent/10 sticky top-0 bg-white rounded-t-2xl z-10">
				<div>
					<h3 className="text-lg font-display font-semibold text-[#1C1917]">Detalhes do Pedido</h3>
					<p className="text-xs text-[#78716C]">#{order.id.slice(0, 8).toUpperCase()}</p>
				</div>
				<button onClick={onClose} className="p-2 rounded-xl hover:bg-sand transition-colors cursor-pointer">
					<IoCloseOutline className="w-5 h-5 text-[#78716C]" />
				</button>
			</div>
			<div className="p-6 space-y-4">

				<div className="bg-sand rounded-xl p-4 space-y-1.5 text-sm text-[#1C1917]">
					<div className="flex items-center justify-between">
						<span className="text-[#78716C] text-xs font-medium">Total</span>
						<span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-[#78716C] text-xs font-medium">Estado</span>
						<span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.class}`}>{badge.label}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-[#78716C] text-xs font-medium">Opção</span>
						<span>{order.deliveryOption === 'pickup' ? 'Levantar na Sede' : 'Entrega ao Domicílio'}</span>
					</div>
					{order.deliveryOption === 'delivery' && order.deliveryZone && (
						<div className="flex items-center justify-between">
							<span className="text-[#78716C] text-xs font-medium">Zona</span>
							<span>{order.deliveryZone.name}</span>
						</div>
					)}
					{order.deliveryOption === 'delivery' && order.deliveryPrice != null && (
						<div className="flex items-center justify-between">
							<span className="text-[#78716C] text-xs font-medium">Taxa de Entrega</span>
							<span className="font-medium">{formatCurrency(order.deliveryPrice)}</span>
						</div>
					)}
					<div className="flex items-center justify-between">
						<span className="text-[#78716C] text-xs font-medium">Data</span>
						<span>{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
					</div>
				</div>

				{order.deliveryOption !== 'pickup' && order.shippingAddress && (
					<div className="bg-white border border-accent/10 rounded-xl p-3 text-sm">
						<p className="text-xs font-medium text-[#78716C] mb-1">Morada de Entrega</p>
						<p className="text-[#1C1917]">{order.shippingAddress}</p>
					</div>
				)}

				{order.storeOrders?.length > 0 && (
					<div className="bg-white border border-accent/10 rounded-xl p-3">
						<p className="text-xs font-medium text-[#78716C] mb-2">Itens</p>
						<div className="space-y-2">
							{order.storeOrders.map((so) => {
								const st = ORDER_STATUS_MAP[so.status];
								return (
								<div key={so.id} className="border border-accent/10 rounded-xl overflow-hidden">
									<div className="flex items-center gap-2 px-3 py-1.5 bg-sand text-xs font-medium text-[#1C1917] border-b border-accent/10">
										{so.store?.logo && (
											<img src={so.store.logo} alt="" className="w-4 h-4 rounded-full object-cover" />
										)}
										{so.store?.name || 'Loja'}
										{st && (
											<span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${STATUS_COLOR[st.color]}`}>
												<st.Icon className="w-3 h-3" /> {st.label}
											</span>
										)}
									</div>
									<div className="divide-y divide-accent/5">
										{so.items?.map((item) => (
											<div key={item.id} className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#1C1917]">
												{item.product?.image && (
													<img src={item.product.image} alt="" className="w-7 h-7 rounded-lg object-cover border border-accent/10 shrink-0" />
												)}
												<span className="flex-1 truncate">{item.product?.name || 'Produto'}</span>
												<span className="text-[#78716C] shrink-0">x{item.quantity}</span>
												<span className="font-medium shrink-0">{formatCurrency(item.subtotal)}</span>
											</div>
										))}
									</div>
								</div>
								);
							})}
						</div>
					</div>
				)}

				{order.paymentMethod && (
					<div className="bg-white border border-accent/10 rounded-xl p-3 text-sm">
						<p className="text-xs font-medium text-[#78716C] mb-2">Pagamento</p>
						<div className="space-y-1 text-[#1C1917]">
							<p><span className="text-[#78716C]">Método:</span> {order.paymentMethod === 'multicaixa_express' ? 'Multicaixa Express' : 'Transferência Bancária'}</p>
							{order.paymentProof && (
								<div className="flex items-center gap-2 mt-1">
									<div className="w-8 h-8 rounded-lg border border-accent/10 flex items-center justify-center bg-white shrink-0">
										{order.paymentProof.match(/\.pdf/i) ? (
											<IoDocumentOutline className="w-4 h-4 text-red-500" />
										) : (
											<img src={order.paymentProof} alt="" className="w-full h-full object-cover rounded-lg" />
										)}
									</div>
									<a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">Ver comprovativo</a>
								</div>
							)}
							{order.paymentConfirmedAt && (
								<p><span className="text-[#78716C]">Confirmado em:</span> {new Date(order.paymentConfirmedAt).toLocaleString('pt-AO')}</p>
							)}
						</div>
					</div>
				)}

				<button onClick={onClose} className="w-full px-4 py-2.5 border border-accent/20 rounded-xl text-sm text-[#78716C] hover:bg-sand cursor-pointer font-medium">
					Fechar
				</button>
			</div>
		</DashboardModal>
	);
};

const PaymentModal = ({ order, onClose }) => {
	const [method, setMethod] = useState('multicaixa_express');
	const [proofFile, setProofFile] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const { mutateAsync: submitProof } = useSubmitPaymentProof();
	const coords = PAYMENT_COORDINATES[method];

	const handleFileSelect = (file) => {
		setProofFile(file);
	};

	const handleSubmit = async () => {
		if (!proofFile) {
			notyf.error('Seleccione o comprovativo primeiro.');
			return;
		}
		setSubmitting(true);
		try {
			const result = await uploadToCloudinary(proofFile, 'payment_proofs');
			if (!result.success) {
				notyf.error(result.msg || 'Erro ao fazer upload.');
				setSubmitting(false);
				return;
			}
			await submitProof({ orderId: order.id, paymentMethod: method, paymentProof: result.url });
			onClose();
		} catch {
			notyf.error('Erro ao submeter comprovativo.');
			setSubmitting(false);
		}
	};

	const isPdf = proofFile?.type === 'application/pdf';
	const isSubmitting = submitting;
	const objectUrl = proofFile ? URL.createObjectURL(proofFile) : null;

	return (
		<DashboardModal isOpen={true} onClose={onClose} size="sm">
			<div className="flex items-center justify-between px-6 py-4 border-b border-accent/10 sticky top-0 bg-white rounded-t-2xl z-10">
				<div>
					<h3 className="text-lg font-display font-semibold text-[#1C1917]">Submeter Comprovativo</h3>
					<p className="text-xs text-[#78716C]">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
				</div>
				<button onClick={onClose} className="p-2 rounded-xl hover:bg-sand transition-colors cursor-pointer">
					<IoCloseOutline className="w-5 h-5 text-[#78716C]" />
				</button>
			</div>
			<div className="p-6 space-y-4">

				<div>
					<p className="text-sm font-medium text-[#1C1917] mb-2">Método de Pagamento</p>
					<div className="space-y-2">
						<label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${method === 'multicaixa_express' ? 'border-accent bg-accent/5' : 'border-accent/10'}`}>
							<input type="radio" checked={method === 'multicaixa_express'} onChange={() => setMethod('multicaixa_express')} className="w-4 h-4 accent-accent" />
							<span className="text-sm text-[#1C1917]">Multicaixa Express</span>
						</label>
						<label className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer ${method === 'transferencia_bancaria' ? 'border-accent bg-accent/5' : 'border-accent/10'}`}>
							<input type="radio" checked={method === 'transferencia_bancaria'} onChange={() => setMethod('transferencia_bancaria')} className="w-4 h-4 accent-accent" />
							<span className="text-sm text-[#1C1917]">Transferência Bancária</span>
						</label>
					</div>
				</div>

				{method === 'multicaixa_express' && (
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
						<p className="text-sm font-semibold text-blue-800 mb-1">Multicaixa Express</p>
						<p className="text-xs text-blue-700">
							Faça o pagamento via Multicaixa Express para o número <strong>{coords.phone}</strong> ({coords.name}).
						</p>
					</div>
				)}
				{method === 'transferencia_bancaria' && (
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
						<p className="text-sm font-semibold text-blue-800 mb-1">Transferência Bancária</p>
						<div className="space-y-1 text-xs text-blue-700">
							<p><strong>Banco:</strong> {coords.bank}</p>
							<p><strong>Titular:</strong> {coords.titular}</p>
							<p><strong>IBAN:</strong> {coords.iban}</p>
						</div>
					</div>
				)}

				<div>
					<p className="text-sm font-medium text-[#1C1917] mb-2">Comprovativo de Pagamento</p>
					{!proofFile ? (
						<div onClick={() => document.getElementById('modal-proof-upload').click()} className="border-2 border-dashed border-accent/20 rounded-xl p-4 text-center cursor-pointer hover:border-accent hover:bg-accent/5">
							<input id="modal-proof-upload" type="file" accept="image/*,application/pdf,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
							<IoCloudUploadOutline className="w-8 h-8 mx-auto mb-1 text-[#78716C]" />
							<p className="text-xs text-[#78716C]">Clique para seleccionar o comprovativo</p>
							<p className="text-xs text-[#78716C]/60 mt-0.5">JPG, PNG, PDF</p>
						</div>
					) : (
						<div className="flex items-center gap-3 bg-accent/5 rounded-xl p-3">
							<div className="w-14 h-14 rounded-lg border border-accent/10 flex items-center justify-center bg-white shrink-0">
								{isPdf ? (
									<IoDocumentOutline className="w-6 h-6 text-red-500" />
								) : (
									<img src={objectUrl} alt="Proof" className="w-full h-full object-cover rounded-lg" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs text-[#1C1917] font-medium truncate">{proofFile.name}</p>
								<p className="text-xs text-[#78716C]">Será enviado ao submeter</p>
							</div>
							<button onClick={() => setProofFile(null)} className="text-xs text-red-500 ml-auto shrink-0"><IoTrashOutline /></button>
						</div>
					)}
				</div>

				<div className="flex gap-3 pt-2">
					<button onClick={onClose} className="flex-1 px-4 py-2.5 border border-accent/20 rounded-xl text-sm text-[#78716C] hover:bg-sand cursor-pointer">Cancelar</button>
					<button onClick={handleSubmit} disabled={!proofFile || isSubmitting} className="flex-1 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 cursor-pointer">
						{isSubmitting ? 'A enviar...' : 'Submeter'}
					</button>
				</div>
			</div>
		</DashboardModal>
	);
};

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [detailsModalOrder, setDetailsModalOrder] = useState(null);
	const [paymentModalOrder, setPaymentModalOrder] = useState(null);

	const fetchOrders = async () => {
		try {
			const data = await http.get('/orders');
			if (data?.success) {
				setOrders(data.data?.orders || []);
			}
		} catch {
			notyf.error('Erro ao carregar pedidos.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => { fetchOrders(); }, []);

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
					{orders.map((order) => {
						const badge = getPaymentStatusBadge(order.paymentStatus);
						return (
							<div key={order.id} className="p-4 border border-accent/10 rounded-xl hover:border-accent/30 hover:bg-orange-50/50 transition-all">
								<div className="flex justify-between items-center gap-4">
									<div className="flex items-center gap-3 min-w-0">
										<div className="p-2.5 bg-sand rounded-xl text-[#78716C] shrink-0">
											<IoBagHandleOutline className="w-5 h-5" />
										</div>
										<div className="min-w-0">
											<p className="font-semibold text-[#1C1917] text-sm font-display truncate">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
											<p className="text-xs text-[#78716C] font-body">{new Date(order.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
										</div>
									</div>
									<div className="text-right shrink-0">
										<p className="font-bold text-[#1C1917] text-sm font-display">{Number(order.totalAmount).toLocaleString('pt-AO')} Kz</p>
										<span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block mt-1 ${badge.class}`}>{badge.label}</span>
									</div>
								</div>
								<div className="mt-3 flex items-center gap-2">
									<button onClick={() => setDetailsModalOrder(order)}
										className="text-xs flex items-center gap-1.5 px-3 py-1.5 border border-accent/20 text-[#78716C] rounded-full hover:bg-sand transition-colors cursor-pointer">
										<IoEyeOutline className="w-3.5 h-3.5" /> Ver Detalhes
									</button>
									{order.paymentStatus === 'pending' && (
										<button onClick={() => setPaymentModalOrder(order)}
											className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors cursor-pointer">
											<IoCloudUploadOutline className="w-3.5 h-3.5" /> Enviar Comprovativo
										</button>
									)}
									{order.paymentProof && order.paymentStatus === 'awaiting_confirmation' && (
										<div className="flex items-center gap-2 text-xs text-[#78716C] ml-auto">
											<div className="w-8 h-8 rounded-lg border border-accent/10 flex items-center justify-center bg-white shrink-0">
												{order.paymentProof.match(/\.pdf/i) ? (
													<IoDocumentOutline className="w-4 h-4 text-red-500" />
												) : (
													<img src={order.paymentProof} alt="" className="w-full h-full object-cover rounded-lg" />
												)}
											</div>
											<a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1"><IoEyeOutline /> Ver comprovativo</a>
										</div>
									)}
								</div>
								{order.storeOrders?.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-1.5">
										{order.storeOrders.map(so => {
											const st = ORDER_STATUS_MAP[so.status];
											if (!st) return null;
											return (
												<span key={so.id} className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${STATUS_COLOR[st.color]}`}>
													<st.Icon className="w-3 h-3" />
													{so.store?.name}: {st.label}
												</span>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			{detailsModalOrder && (
				<OrderDetailsModal order={detailsModalOrder} onClose={() => setDetailsModalOrder(null)} />
			)}
			{paymentModalOrder && (
				<PaymentModal order={paymentModalOrder} onClose={() => { setPaymentModalOrder(null); fetchOrders(); }} />
			)}
		</div>
	);
};

export default OrderHistory;
