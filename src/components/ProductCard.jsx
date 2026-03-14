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
	const [currentTimestamp, setCurrentTimestamp] = React.useState(null);
	const navigate = useNavigate();
	const handleProductClick = onClick ?? (() => navigate(`/produto/${product.id}`));
	const productId = product?.id;
	const productTitle = product?.title ?? product?.name ?? '';
	const productPrice = product?.price ?? 0;
	const productOldPrice = product?.oldPrice;
	const productImage = product?.image;

	const parsePromotionEndDate = (dateValue) => {
		if (!dateValue) return null;

		const parsed = new Date(dateValue);
		if (Number.isNaN(parsed.getTime())) return null;

		if (typeof dateValue === 'string' && !dateValue.includes('T')) {
			parsed.setHours(23, 59, 59, 999);
		}

		return parsed;
	};

	const promotionEndDate = parsePromotionEndDate(product?.promotionalEndDate ?? product?.promotionEndDate);
	const basePrice = productOldPrice ?? productPrice;
	const promotionalPrice = product?.promotionalPrice ?? (productOldPrice ? productPrice : null);
	const basePriceNumber = Number(basePrice);
	const promotionalPriceNumber = Number(promotionalPrice);
	const hasPromotionCandidate = Number.isFinite(basePriceNumber)
		&& Number.isFinite(promotionalPriceNumber)
		&& basePriceNumber > promotionalPriceNumber
		&& promotionalPriceNumber >= 0;
	const isPromotionInDate = !promotionEndDate || currentTimestamp === null || promotionEndDate.getTime() >= currentTimestamp;
	const hasValidPromotion = hasPromotionCandidate && isPromotionInDate;
	const displayPrice = hasValidPromotion ? promotionalPriceNumber : (Number.isFinite(basePriceNumber) ? basePriceNumber : Number(productPrice) || 0);
	const displayOldPrice = hasValidPromotion ? basePriceNumber : null;
	const discountPercent = displayOldPrice && displayOldPrice > 0
		? Math.round((1 - displayPrice / displayOldPrice) * 100)
		: 0;
	const wishlisted = productId ? isWishlisted(productId) : false;
	const isAdding = productId ? isAddingProduct(productId) : false;
	const isWishToggling = productId ? isToggling(productId) : false;

	const formatReviewCount = (value) => {
		const num = Number(value) || 0;
		if (num === 0) return '0';
		if (num === 1) return '1';
		if (num < 1000) return `${num}`;
		if (num < 10000) return `${(num / 1000).toFixed(1).replace(/\.0$/,'')}k`;
		return `${Math.round(num / 1000)}k`;
	};

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

	useEffect(() => {
		const updateTimestamp = () => setCurrentTimestamp(Date.now());
		updateTimestamp();

		const intervalId = setInterval(updateTimestamp, 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	const handleAddToCart = (e) => {
		e?.stopPropagation();
		addToCart({
			id: productId,
			name: productTitle,
			price: displayPrice,
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
			price: displayPrice,
			image: productImage,
			promotionalPrice: hasValidPromotion ? promotionalPriceNumber : null,
			promotionalEndDate: product?.promotionalEndDate ?? product?.promotionEndDate,
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
		<div
			onClick={handleProductClick}
			className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
		>
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

				{displayOldPrice && (
					<span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
						-{discountPercent}%
					</span>
				)}

				<div className="w-full h-full">
					<img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
				</div>
			</div>

			<div className="p-3 flex flex-col flex-1">
				<p className="text-xs text-gray-700 font-medium line-clamp-2 leading-tight mb-2 h-8">{productTitle}</p>

				{product.rating && (
					<div className="flex items-center gap-2 mb-2">
						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5].map(i => (
								<span key={i} className={`text-xs ${i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>
									★
								</span>
							))}
						</div>
						{product.reviewCount !== undefined && product.reviewCount !== null && (
							<span className="text-[11px] text-gray-500">({formatReviewCount(product.reviewCount)})</span>
						)}
					</div>
				)}

				<div className="mb-3">
					<span className="text-sm font-bold text-gray-800">{formatCurrency(displayPrice)}</span>
					{displayOldPrice && (
						<span className="ml-1.5 text-xs text-gray-400 line-through">{formatCurrency(displayOldPrice)}</span>
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
