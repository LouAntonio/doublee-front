import React from 'react';
import { useProducts } from '../hooks/queries/useProducts';
import HorizontalProductSlider from './HorizontalProductSlider';

const NewProductsSection = () => {
	const { data, isLoading } = useProducts({ sort: 'newest', limit: 20 });
	const products = data?.products ?? [];

	return (
		<HorizontalProductSlider
			title="Novidades"
			seeAllLink="/produtos?sort=newest"
			products={products}
			isLoading={isLoading}
		/>
	);
};

export default NewProductsSection;
