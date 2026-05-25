import React from 'react';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import useCartStore from '../stores/cartStore';
import { formatCurrency } from '../utils/currency';

const CartItem = ({ item }) => {
	const { updateQuantity, removeFromCart, isUpdatingItem, isRemovingItem } = useCartStore();
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
		<div className="flex gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
			<div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
				<img
					src={item.image || '/images/placeholder.png'}
					alt={item.name}
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="flex-1 flex flex-col justify-between">
				<div>
					<h3 className="font-display text-[#1C1917] text-sm lg:text-base line-clamp-2">
						{item.name}
					</h3>
					{item.description && (
						<p className="text-xs text-[#78716C] mt-1 line-clamp-1 font-body">
							{item.description}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between mt-2 lg:hidden">
					<div className="flex items-center gap-2">
						<button
							onClick={handleDecrement}
							disabled={isUpdating}
							className={`w-7 h-7 flex items-center justify-center bg-sand hover:bg-accent/10 rounded-xl transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
							aria-label="Diminuir quantidade"
						>
							<IoRemoveOutline className="w-4 h-4 text-[#78716C]" />
						</button>
						<span className="w-8 text-center font-medium text-sm text-[#1C1917]">{item.quantity}</span>
						{isUpdating && (
							<span
								className="inline-block w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"
								aria-label="Atualizando quantidade"
							/>
						)}
						<button
							onClick={handleIncrement}
							disabled={isUpdating}
							className={`w-7 h-7 flex items-center justify-center bg-sand hover:bg-accent/10 rounded-xl transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
							aria-label="Aumentar quantidade"
						>
							<IoAddOutline className="w-4 h-4 text-[#78716C]" />
						</button>
					</div>
					<div className="text-right">
						<p className="font-bold text-[#1C1917] text-base">
							{formatCurrency(item.price * item.quantity)}
						</p>
					</div>
				</div>
			</div>

			<div className="hidden lg:flex items-center gap-3">
				<div className="flex items-center gap-2">
					<button
						onClick={handleDecrement}
						disabled={isUpdating}
						className={`w-8 h-8 flex items-center justify-center bg-sand hover:bg-accent/10 rounded-xl transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
						aria-label="Diminuir quantidade"
					>
						<IoRemoveOutline className="w-4 h-4 text-[#78716C]" />
					</button>
					<span className="w-10 text-center font-medium text-[#1C1917]">{item.quantity}</span>
					{isUpdating && (
						<span
							className="inline-block w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"
							aria-label="Atualizando quantidade"
						/>
					)}
					<button
						onClick={handleIncrement}
						disabled={isUpdating}
						className={`w-8 h-8 flex items-center justify-center bg-sand hover:bg-accent/10 rounded-xl transition-colors ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
						aria-label="Aumentar quantidade"
					>
						<IoAddOutline className="w-4 h-4 text-[#78716C]" />
					</button>
				</div>
			</div>

			<div className="hidden lg:flex items-center">
				<p className="font-bold text-[#1C1917] text-lg w-32 text-right">
					{formatCurrency(item.price * item.quantity)}
				</p>
			</div>

			<div className="flex items-start lg:items-center">
				<button
					onClick={handleRemove}
					disabled={isRemoving}
					className={`p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors ${isRemoving ? 'opacity-60 cursor-not-allowed' : ''}`}
					aria-label="Remover item"
				>
					{isRemoving ? (
						<span className="inline-block w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" aria-label="Removendo" />
					) : (
						<IoTrashOutline className="w-5 h-5" />
					)}
				</button>
			</div>
		</div>
	);
};

export default CartItem;
