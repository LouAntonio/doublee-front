import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import BestSellersSection from '../components/BestSellersSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import NewProductsSection from '../components/NewProductsSection';
import RandomCategoryProductsSection from '../components/RandomCategoryProductsSection';


const Home = () => {
	useDocumentTitle('Home - Kusumba');

	return (
		<div style={{ backgroundColor: '#ededed' }}>
			<Header />
			<BannerCarousel />
			<FeaturedProductsSection />
			<CategoriesSection />
			<NewProductsSection />
			<BestSellersSection />
			<RandomCategoryProductsSection />
		</div>
	);
};

export default Home;
