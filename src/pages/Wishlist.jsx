import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack, IoHeartOutline } from 'react-icons/io5';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
	useDocumentTitle('Wishlist - Double E');
	const { wishlistItems, isLoading, loadWishlist } = useWishlist();

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
		<div style={{ backgroundColor: '#ededed', minHeight: '100vh' }}>
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-8">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
				>
					<IoArrowBack className="w-4 h-4" />
					Continuar Comprando
				</Link>

				<h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
					Lista de Desejos
				</h1>

				{isLoading ? (
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
						<p className="text-gray-600">Carregando sua wishlist...</p>
					</div>
				) : items.length === 0 ? (
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
								<IoHeartOutline className="w-12 h-12 text-gray-400" />
							</div>
							<h2 className="text-xl font-bold text-gray-800 mb-3">
								Sua lista de desejos esta vazia
							</h2>
							<p className="text-gray-600 mb-6">
								Explore os produtos e adicione seus favoritos aqui
							</p>
							<Link
								to="/"
								className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
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
