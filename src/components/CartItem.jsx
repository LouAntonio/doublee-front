import React from 'react';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

const CartItem = ({ item }) => {
	const { updateQuantity, removeFromCart, isUpdatingItem, isRemovingItem } = useCart();
	const isUpdating = isUpdatingItem(item.id);
	const isRemoving = isRemovingItem(item.id);

	const handleIncrement = () => {
		updateQuantity(item.id, item.quantity + 1);
	};

	const handleDecrement = () => {
		if (item.quantity > 1) {
			updateQuantity(item.id, item.quantity - 1);
		}
	};

	const handleRemove = () => {
		removeFromCart(item.id);
	};

	return (
		<div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
			{/* Product Image */}
			<div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
				<img
					src={item.image || '/images/placeholder.png'}
					alt={item.name}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Product Details */}
			<div className="flex-1 flex flex-col justify-between">
				<div>
					<h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2">
						{item.name}
					</h3>
					{item.description && (
						<p className="text-xs text-gray-500 mt-1 line-clamp-1">
							{item.description}
						</p>
					)}
				</div>

				{/* Mobile: Price and Controls */}
				<div className="flex items-center justify-between mt-2 lg:hidden">
					<div className="flex items-center gap-2">
						<button
							onClick={handleDecrement}
							disabled={isUpdating}
							className={`w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
							aria-label="Diminuir quantidade"
						>
							<IoRemoveOutline className="w-4 h-4 text-gray-600" />
						</button>
						<span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
						{isUpdating && (
							<span
								className="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"
								aria-label="Atualizando quantidade"
							/>
						)}
						<button
							onClick={handleIncrement}
							disabled={isUpdating}
							className={`w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
							aria-label="Aumentar quantidade"
						>
							<IoAddOutline className="w-4 h-4 text-gray-600" />
						</button>
					</div>
					<div className="text-right">
						<p className="font-bold text-gray-800 text-base">
							{formatCurrency(item.price * item.quantity)}
						</p>
					</div>
				</div>
			</div>

			{/* Desktop: Quantity Controls */}
			<div className="hidden lg:flex items-center gap-3">
				<div className="flex items-center gap-2">
					<button
						onClick={handleDecrement}
						disabled={isUpdating}
						className={`w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
						aria-label="Diminuir quantidade"
					>
						<IoRemoveOutline className="w-4 h-4 text-gray-600" />
					</button>
					<span className="w-10 text-center font-medium">{item.quantity}</span>
					{isUpdating && (
						<span
							className="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"
							aria-label="Atualizando quantidade"
						/>
					)}
					<button
						onClick={handleIncrement}
						disabled={isUpdating}
						className={`w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
						aria-label="Aumentar quantidade"
					>
						<IoAddOutline className="w-4 h-4 text-gray-600" />
					</button>
				</div>
			</div>

			{/* Desktop: Price */}
			<div className="hidden lg:flex items-center">
				<p className="font-bold text-gray-800 text-lg w-32 text-right">
					{formatCurrency(item.price * item.quantity)}
				</p>
			</div>

			{/* Remove Button */}
			<div className="flex items-start lg:items-center">
				<button
					onClick={handleRemove}
					disabled={isRemoving}
					className={`p-2 text-red-500 hover:bg-red-50 rounded transition-colors ${isRemoving ? 'opacity-60 cursor-not-allowed' : ''}`}
					aria-label="Remover item"
				>
					{isRemoving ? (
						<span className="w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" aria-label="Removendo" />
					) : (
						<IoTrashOutline className="w-5 h-5" />
					)}
				</button>
			</div>
		</div>
	);
};

export default CartItem;
