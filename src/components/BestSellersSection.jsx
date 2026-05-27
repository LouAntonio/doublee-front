import React from 'react';
import { useBestSellers } from '../hooks/queries/useProducts';
import HorizontalProductSlider from './HorizontalProductSlider';

const normalizeForCard = (product) => ({
	id: product.id,
	title: product.name ?? product.title,
	price: product.promotionalPrice ?? product.price,
	oldPrice: product.promotionalPrice ? product.price : product.oldPrice,
	promotionalEndDate: product.promotionalEndDate,
	image: product.image || '/images/produto.png',
	rating: product.rating,
	reviewCount: product.qtdRatings ?? product.reviewCount,
});

const BestSellersSection = () => {
	const { data: rawProducts, isLoading } = useBestSellers();
	const products = (rawProducts?.products ?? rawProducts ?? []).map(normalizeForCard).slice(0, 20);

	return (
		<HorizontalProductSlider
			title="Mais vendidos"
			seeAllLink="/produtos?sort=best-sellers"
			products={products}
			isLoading={isLoading}
		/>
	);
};

export default BestSellersSection;
