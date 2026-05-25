import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack, IoHeartOutline } from 'react-icons/io5';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useWishlistStore from '../stores/wishlistStore';

const Wishlist = () => {
	useDocumentTitle('Wishlist - Kusumba');
	const { wishlistItems, isLoading, loadWishlist } = useWishlistStore();

	useEffect(() => {
		loadWishlist();
	}, [loadWishlist]);

	const items = wishlistItems.map((item) => {
		const product = item.product || {};
		return {
			id: product.id || item.productId,
			title: product.name || '',
			price: product.promotionalPrice ?? product.price ?? 0,
			oldPrice: product.promotionalPrice ? product.price : undefined,
			promotionalEndDate: product.promotionalEndDate,
			image: product.image || '/images/logo/placeholder.png',
			rating: product.rating || 0,
			reviewCount: product.qtdRatings || 0,
			stock: product.stock,
			store: product.store,
		};
	});

	return (
		<div className="min-h-screen bg-sand">
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-8">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-accent hover:text-accent-dark mb-4 text-sm font-body font-medium"
				>
					<IoArrowBack className="w-4 h-4" />
					Continuar Comprando
				</Link>

				<h1 className="font-display text-3xl lg:text-4xl text-[#1C1917] mb-6">
					Lista de Desejos
				</h1>

				{isLoading ? (
					<div className="bg-white rounded-2xl shadow-md p-8 lg:p-12 text-center">
						<p className="font-body text-[#78716C]">Carregando sua wishlist...</p>
					</div>
				) : items.length === 0 ? (
					<div className="bg-white rounded-2xl shadow-md p-8 lg:p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
								<IoHeartOutline className="w-12 h-12 text-[#78716C]" />
							</div>
							<h2 className="font-display text-2xl text-[#1C1917] mb-3">
								Sua lista de desejos está vazia
							</h2>
							<p className="font-body text-[#78716C] mb-6">
								Explore os produtos e adicione seus favoritos aqui
							</p>
							<Link
								to="/"
								className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
							>
								Explorar Produtos
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
						{items.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Wishlist;
