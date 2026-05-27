import React from 'react';
import HorizontalProductSlider from './HorizontalProductSlider';
import { useFeaturedProducts } from '../hooks/queries/useProducts';

const normalizeProducts = (products) =>
	(products || []).map((product) => ({
		id: product.id,
		title: product.name ?? product.title,
		price: product.promotionalPrice ?? product.price,
		oldPrice: product.promotionalPrice ? product.price : product.oldPrice,
		promotionalEndDate: product.promotionalEndDate,
		image: product.image || '/images/produto.png',
		rating: product.rating,
		reviewCount: product.qtdRatings ?? product.reviewCount,
	}));

const FeaturedProductsSection = () => {
	const { data: rawProducts, isLoading } = useFeaturedProducts();
	const products = normalizeProducts(rawProducts?.products ?? rawProducts).slice(0, 20);

	return (
		<HorizontalProductSlider
			title="Produtos em destaque"
			seeAllLink="/produtos?featured=true"
			products={products}
			isLoading={isLoading}
		/>
	);
};

export default FeaturedProductsSection;
