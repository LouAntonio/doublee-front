import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { IoTicketOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { notyf } from '../utils/notyf';
import apiRequest from '../services/api';

const OrderSummary = ({ showPromoCode = true }) => {
	const { cartItems, getSubtotal, getShipping, getTax, getTotal, appliedCoupon, setAppliedCoupon, getDiscount } = useCart();
	const [promoCode, setPromoCode] = useState('');


	const [error, setError] = useState('');

	const handleApplyPromo = async () => {
		setError('');
		if (!promoCode) return;

		try {
			const res = await apiRequest('/coupons/validate', {
				method: 'POST',
				body: JSON.stringify({ code: promoCode.toUpperCase() })
			});


			if (res.success) {
				// Check if the store is in our cart
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

				setError(res.msg || 'Cupão inválido ou expirado.');
			}
		} catch (err) {
			console.log(err);
			setError('Erro ao validar o cupão.');
		}
	};

	const subtotal = getSubtotal();
	const shipping = getShipping();
	const tax = getTax();
	const discountAmount = getDiscount();
	const total = getTotal();

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
			<h2 className="text-lg font-bold text-gray-800 mb-4">Resumo do Pedido</h2>

			{/* Cart Items Summary */}
			<div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
				{cartItems.map((item) => (
					<div key={item.id} className="flex justify-between text-sm">
						<div className="flex-1">
							<p className="text-gray-700 line-clamp-1">{item.name}</p>
							<p className="text-gray-500 text-xs">Qtd: {item.quantity}</p>
						</div>
						<p className="font-medium text-gray-800 ml-2">
							{formatCurrency(item.price * item.quantity)}
						</p>
					</div>
				))}
			</div>

			<div className="border-t border-gray-200 pt-4 space-y-3">
				{/* Subtotal */}
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Subtotal</span>
					<span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
				</div>

				{/* Discount */}
				{appliedCoupon && (
					<div className="flex justify-between text-sm text-green-600">
						<span>Desconto ({appliedCoupon.code})</span>
						<span className="font-medium">-{formatCurrency(discountAmount)}</span>
					</div>
				)}

				{/* Shipping */}
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Entrega</span>
					<span className="font-medium text-gray-800">
						{shipping === 0 ? (
							<span className="text-green-600">Grátis</span>
						) : (
							formatCurrency(shipping)
						)}
					</span>
				</div>

				{/* Tax */}
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Impostos</span>
					<span className="font-medium text-gray-800">{formatCurrency(tax)}</span>
				</div>

				{/* Promo Code */}
				{showPromoCode && (
					<div className="pt-3 border-t border-gray-200">
						{appliedCoupon ? (
							<div className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-100">
								<div className="flex items-center gap-2">
									<IoTicketOutline className="text-green-600" />
									<span className="text-sm font-bold text-green-700">{appliedCoupon.code}</span>
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
											className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										<IoTicketOutline className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									</div>
									<button
										onClick={handleApplyPromo}
										className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
									>
										Aplicar
									</button>
								</div>
								{error && (
									<p className="text-xs text-red-500 mt-2">{error}</p>
								)}
							</>
						)}
					</div>
				)}

				{/* Total */}
				<div className="flex justify-between pt-3 border-t border-gray-200">
					<span className="text-base font-bold text-gray-800">Total</span>
					<span className="text-lg font-bold text-blue-600">{formatCurrency(total)}</span>
				</div>
			</div>
			<Link
				to="/checkout"
				className="block w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-center rounded-lg transition-colors shadow-sm"
			>
				Finalizar Compra
			</Link>
		</div>
	);
};

export default OrderSummary;
