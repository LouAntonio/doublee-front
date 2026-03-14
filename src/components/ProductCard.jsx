import React, { useEffect } from 'react';
import { IoCartOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { notyf } from '../utils/notyf';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, onClick }) => {
	const { addToCart, isAddingProduct } = useCart();
	const { isAuthenticated } = useAuth();
	const { isWishlisted, checkInWishlist, toggleWishlist, isToggling } = useWishlist();
	const navigate = useNavigate();
	const handleProductClick = onClick ?? (() => navigate(`/produto/${product.id}`));
	const productId = product?.id;
	const productTitle = product?.title ?? product?.name ?? '';
	const productPrice = product?.price ?? 0;
	const productImage = product?.image;
	const wishlisted = productId ? isWishlisted(productId) : false;
	const isAdding = productId ? isAddingProduct(productId) : false;
	const isWishToggling = productId ? isToggling(productId) : false;

	useEffect(() => {
		let active = true;
		const syncWishlist = async () => {
			if (!active || !isAuthenticated || !productId) return;
			if (!isWishlisted(productId)) {
				await checkInWishlist(productId);
			}
		};
		syncWishlist();
		return () => { active = false; };
	}, [checkInWishlist, isAuthenticated, isWishlisted, productId]);

	const handleAddToCart = (e) => {
		e?.stopPropagation();
		addToCart({
			id: productId,
			name: productTitle,
			price: productPrice,
			image: productImage
		});
	};

	const handleToggleWishlist = async (e) => {
		e?.stopPropagation();
		if (!isAuthenticated) {
			notyf.error('Faça login para usar a wishlist.');
			navigate('/auth');
			return;
		}
		if (!productId) return;

		const result = await toggleWishlist({
			id: productId,
			name: productTitle,
			price: productPrice,
			image: productImage,
			promotionalPrice: product?.promotionalPrice,
			stock: product?.stock,
			store: product?.store,
			rating: product?.rating,
			reviewCount: product?.reviewCount
		});
		if (result.success) {
			if (result.inWishlist) notyf.success(result.msg || 'Adicionado à wishlist!');
			else notyf.error(result.msg || 'Removido da wishlist');
			return;
		}
		if (result.msg === 'not-authenticated') {
			notyf.error('Faça login para usar a wishlist.');
			navigate('/auth');
			return;
		}
		notyf.error(result.msg || 'Nao foi possivel atualizar a wishlist.');
	};

	return (
		<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
			<div className="relative aspect-square overflow-hidden bg-gray-50">
				<button
					onClick={handleToggleWishlist}
					title={wishlisted ? 'Remover da wishlist' : 'Adicionar à wishlist'}
					disabled={isWishToggling}
					className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:shadow-md transition-transform cursor-pointer ${isWishToggling ? 'opacity-70 cursor-not-allowed' : ''}`}
				>
					{isWishToggling ? (
						<span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" aria-label="Atualizando" />
					) : (
						wishlisted
							? <IoHeart size={16} className="text-red-500" />
							: <IoHeartOutline size={16} className="text-gray-600" />
					)}
				</button>

				{product.oldPrice && (
					<span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
						-{Math.round((1 - product.price / product.oldPrice) * 100)}%
					</span>
				)}

				<div onClick={handleProductClick} className="w-full h-full cursor-pointer">
					<img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
				</div>
			</div>

			<div className="p-3 flex flex-col flex-1">
				<p className="text-xs text-gray-700 font-medium line-clamp-2 leading-tight mb-2 h-8">{product.title}</p>

				{product.rating && (
					<div className="flex items-center gap-1 mb-2">
						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5].map(i => (
								<span key={i} className={`text-xs ${i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>
									★
								</span>
							))}
						</div>
						{product.reviewCount && <span className="text-[10px] text-gray-400">({product.reviewCount})</span>}
					</div>
				)}

				<div className="mb-3">
					<span className="text-sm font-bold text-gray-800">{formatCurrency(product.price)}</span>
					{product.oldPrice && (
						<span className="ml-1.5 text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
					)}
				</div>

				<button
					onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
					disabled={isAdding}
					className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-50 text-[#F97316] text-xs font-semibold hover:bg-[#F97316] hover:text-white border border-orange-100 hover:border-[#F97316] transition-colors cursor-pointer mt-auto ${isAdding ? 'opacity-70 cursor-not-allowed' : ''}`}
				>
					{isAdding ? (
						<span className="w-4 h-4 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" aria-label="Adicionando" />
					) : (
						<IoCartOutline />
					)}
					{isAdding ? 'Adicionando...' : 'Adicionar'}
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
