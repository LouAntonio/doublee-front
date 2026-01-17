import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { IoTicketOutline } from 'react-icons/io5';

const OrderSummary = ({ showPromoCode = true }) => {
	const { cartItems, getSubtotal, getShipping, getTax, getTotal } = useCart();
	const [promoCode, setPromoCode] = useState('');
	const [promoApplied, setPromoApplied] = useState(false);

	const handleApplyPromo = () => {
		// Simple promo code validation (can be enhanced)
		if (promoCode.toUpperCase() === 'DESCONTO10') {
			setPromoApplied(true);
		}
	};

	const subtotal = getSubtotal();
	const shipping = getShipping();
	const tax = getTax();
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

				{/* Shipping */}
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Frete</span>
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
						<div className="flex gap-2">
							<div className="relative flex-1">
								<input
									type="text"
									value={promoCode}
									onChange={(e) => setPromoCode(e.target.value)}
									placeholder="Código promocional"
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={promoApplied}
								/>
								<IoTicketOutline className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							</div>
							<button
								onClick={handleApplyPromo}
								disabled={promoApplied}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
							>
								Aplicar
							</button>
						</div>
						{promoApplied && (
							<p className="text-xs text-green-600 mt-2">✓ Código aplicado com sucesso!</p>
						)}
					</div>
				)}

				{/* Total */}
				<div className="flex justify-between pt-3 border-t border-gray-200">
					<span className="text-base font-bold text-gray-800">Total</span>
					<span className="text-lg font-bold text-blue-600">{formatCurrency(total)}</span>
				</div>

				{/* Free Shipping Notice */}
				{shipping > 0 && subtotal < 200 && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
						<p className="text-xs text-blue-800">
							Falta apenas <strong>{formatCurrency(200 - subtotal)}</strong> para frete grátis!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderSummary;
