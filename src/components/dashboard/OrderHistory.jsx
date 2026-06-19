import React, { useState, useEffect } from 'react';
import { IoBagHandleOutline, IoCloudUploadOutline, IoEyeOutline, IoTrashOutline } from 'react-icons/io5';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';
import { uploadToCloudinary } from '../../services/cloudinary';
import { useSubmitPaymentProof } from '../../hooks/queries/useOrders';

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

const ProofUploadModal = ({ order, onClose }) => {
	const [method, setMethod] = useState('multicaixa_express');
	const [proofUrl, setProofUrl] = useState('');
	const [uploading, setUploading] = useState(false);
	const { mutateAsync: submitProof, isPending } = useSubmitPaymentProof();

	const handleUpload = async (file) => {
		setUploading(true);
		try {
			const result = await uploadToCloudinary(file, 'payment_proofs');
			if (result.success) {
				setProofUrl(result.url);
				notyf.success('Comprovativo carregado!');
			} else {
				notyf.error(result.msg || 'Erro ao fazer upload.');
			}
		} catch {
			notyf.error('Erro ao fazer upload.');
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		if (!proofUrl) {
			notyf.error('Faça upload do comprovativo primeiro.');
			return;
		}
		try {
			await submitProof({ orderId: order.id, paymentMethod: method, paymentProof: proofUrl });
			onClose();
		} catch {
			// handled by mutation
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
			<div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
				<h3 className="text-lg font-display font-semibold text-[#1C1917] mb-4">Submeter Comprovativo</h3>
				<p className="text-xs text-[#78716C] mb-4">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>

				<div className="mb-4">
					<label className="block text-sm font-body text-[#78716C] mb-2">Método de Pagamento</label>
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

				<div className="mb-4">
					<label className="block text-sm font-body text-[#78716C] mb-2">Comprovativo</label>
					{!proofUrl ? (
						<div onClick={() => document.getElementById('modal-proof-upload').click()} className="border-2 border-dashed border-accent/20 rounded-xl p-4 text-center cursor-pointer hover:border-accent hover:bg-accent/5">
							<input id="modal-proof-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
							<IoCloudUploadOutline className="w-8 h-8 mx-auto mb-1 text-[#78716C]" />
							<p className="text-xs text-[#78716C]">{uploading ? 'A carregar...' : 'Clique para fazer upload'}</p>
						</div>
					) : (
						<div className="flex items-center gap-3 bg-accent/5 rounded-xl p-3">
							<img src={proofUrl} alt="Proof" className="w-14 h-14 object-cover rounded-lg border" />
							<a href={proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1"><IoEyeOutline /> Ver</a>
							<button onClick={() => setProofUrl('')} className="text-xs text-red-500 ml-auto"><IoTrashOutline /></button>
						</div>
					)}
				</div>

				<div className="flex gap-3">
					<button onClick={onClose} className="flex-1 px-4 py-2.5 border border-accent/20 rounded-xl text-sm text-[#78716C] hover:bg-sand cursor-pointer">Cancelar</button>
					<button onClick={handleSubmit} disabled={!proofUrl || isPending} className="flex-1 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 cursor-pointer">
						{isPending ? 'A enviar...' : 'Submeter'}
					</button>
				</div>
			</div>
		</div>
	);
};

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [proofModalOrder, setProofModalOrder] = useState(null);

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
								{order.paymentProof && order.paymentStatus === 'awaiting_confirmation' && (
									<div className="mt-3 flex items-center gap-2 text-xs text-[#78716C]">
										<img src={order.paymentProof} alt="Comprovativo" className="w-10 h-10 object-cover rounded-lg border" />
										<a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1"><IoEyeOutline /> Ver comprovativo enviado</a>
									</div>
								)}
								{order.paymentStatus === 'pending' && (
									<div className="mt-3">
										<button onClick={() => setProofModalOrder(order)}
											className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors cursor-pointer">
											<IoCloudUploadOutline className="w-3.5 h-3.5" /> Enviar Comprovativo
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			{proofModalOrder && (
				<ProofUploadModal order={proofModalOrder} onClose={() => { setProofModalOrder(null); fetchOrders(); }} />
			)}
		</div>
	);
};

export default OrderHistory;
