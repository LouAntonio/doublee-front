import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import BestSellersSection from '../components/BestSellersSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import NewProductsSection from '../components/NewProductsSection';
import LatestProductsSection from '../components/LatestProductsSection';


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
			<LatestProductsSection />
		</div>
	);
};

export default Home;
