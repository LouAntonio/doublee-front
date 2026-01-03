import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import OffersSection from '../components/OffersSection';
import BestSellersSection from '../components/BestSellersSection';

const Home = () => {
	useDocumentTitle('Home - Double E');

	return (
		<div style={{ backgroundColor: '#ededed' }}>
			<Header />
			<BannerCarousel />
			<CategoryCarousel />
			<OffersSection />
			<BestSellersSection />
		</div>
	);
};

export default Home;
