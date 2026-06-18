import React, { useState } from 'react';
import useCartStore from '../stores/cartStore';
import { formatCurrency } from '../utils/currency';
import { IoTicketOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { notyf } from '../utils/notyf';
import { useValidateCoupon } from '../hooks/queries/useProfile';

const OrderSummary = ({ showPromoCode = true, deliveryOption, deliveryPrice = 0, deliveryZoneName }) => {
	const { cartItems, getSubtotal, getTax, appliedCoupon, setAppliedCoupon, getDiscount } = useCartStore();
	const [promoCode, setPromoCode] = useState('');
	const [error, setError] = useState('');
	const { mutateAsync: validateCoupon } = useValidateCoupon();

	const handleApplyPromo = async () => {
		setError('');
		if (!promoCode) return;

		try {
			const res = await validateCoupon(promoCode.toUpperCase());

			if (res?.success) {
				const hasItemsFromStore = cartItems.some(item =>
					(item.store?.id === res.data.storeId) || (item.product?.storeId === res.data.storeId)
				);

				if (!hasItemsFromStore) {
					setError('Este cupão pertence a uma loja que não está no seu carrinho.');
					return;
				}

				setAppliedCoupon(res.data);
				setPromoCode('');
				notyf.success('Cupão aplicado com sucesso!');
			} else {
				setError(res?.msg || 'Cupão inválido ou expirado.');
			}
		} catch {
			setError('Erro ao validar o cupão.');
		}
	};

	const subtotal = getSubtotal();
	const tax = getTax();
	const discountAmount = getDiscount();
	const shipping = deliveryOption === 'delivery' ? deliveryPrice : 0;
	const total = subtotal + shipping + tax - discountAmount;

	return (
		<div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
			<h2 className="font-display text-lg text-[#1C1917] mb-4">Resumo do Pedido</h2>

			<div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
				{cartItems.map((item) => (
					<div key={item.id} className="flex justify-between text-sm">
						<div className="flex-1">
							<p className="text-[#1C1917] font-body line-clamp-1">{item.name}</p>
							<p className="text-[#78716C] font-body text-xs">Qtd: {item.quantity}</p>
						</div>
						<p className="font-medium text-[#1C1917] ml-2">
							{formatCurrency(item.price * item.quantity)}
						</p>
					</div>
				))}
			</div>

			<div className="border-t border-accent/10 pt-4 space-y-3">
				<div className="flex justify-between text-sm">
					<span className="text-[#78716C] font-body">Subtotal</span>
					<span className="font-medium text-[#1C1917]">{formatCurrency(subtotal)}</span>
				</div>

				{appliedCoupon && (
					<div className="flex justify-between text-sm text-accent">
						<span>Desconto ({appliedCoupon.code})</span>
						<span className="font-medium">-{formatCurrency(discountAmount)}</span>
					</div>
				)}

				<div className="flex justify-between text-sm">
					<span className="text-[#78716C] font-body">
						{deliveryOption === 'pickup' ? 'Levantamento' : 'Entrega'}
						{deliveryZoneName && <span className="block text-xs">({deliveryZoneName})</span>}
					</span>
					<span className="font-medium text-[#1C1917]">
						{shipping === 0 ? (
							<span className="text-accent">{deliveryOption === 'pickup' ? 'Grátis' : 'Grátis'}</span>
						) : (
							formatCurrency(shipping)
						)}
					</span>
				</div>

				<div className="flex justify-between text-sm">
					<span className="text-[#78716C] font-body">Impostos</span>
					<span className="font-medium text-[#1C1917]">{formatCurrency(tax)}</span>
				</div>

				{showPromoCode && (
					<div className="pt-3 border-t border-accent/10">
						{appliedCoupon ? (
							<div className="flex items-center justify-between bg-accent/5 p-2 rounded-xl border border-accent/20">
								<div className="flex items-center gap-2">
									<IoTicketOutline className="text-accent" />
									<span className="text-sm font-bold text-accent">{appliedCoupon.code}</span>
								</div>
								<button
									onClick={() => setAppliedCoupon(null)}
									className="text-xs text-red-500 hover:underline font-medium"
								>
									Remover
								</button>
							</div>
						) : (
							<>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<input
											type="text"
											value={promoCode}
											onChange={(e) => setPromoCode(e.target.value)}
											placeholder="Código promocional"
											className="w-full px-3 py-2 text-sm border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 font-body text-[#1C1917] placeholder:text-[#78716C]/60"
										/>
										<IoTicketOutline className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
									</div>
									<button
										onClick={handleApplyPromo}
										className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-xl transition-colors cursor-pointer font-body"
									>
										Aplicar
									</button>
								</div>
								{error && (
									<p className="text-xs text-red-500 mt-2 font-body">{error}</p>
								)}
							</>
						)}
					</div>
				)}

				<div className="flex justify-between pt-3 border-t border-accent/10">
					<span className="text-base font-bold text-[#1C1917] font-display">Total</span>
					<span className="text-lg font-bold text-accent">{formatCurrency(total)}</span>
				</div>
			</div>
			<Link
				to="/checkout"
				className="block w-full mt-4 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold text-center rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
			>
				Finalizar Compra
			</Link>
		</div>
	);
};

export default OrderSummary;
