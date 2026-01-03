import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCarousel from '../components/CategoryCarousel';

const Home = () => {
	useDocumentTitle('Home - Double E');
	return (
		<>
			<Header />
			{/* Banner Carousel */}
			<BannerCarousel />
			{/* Category Cards Carousel - Sobrepõe o Banner */}
			<CategoryCarousel />
			
		</>
	);
};

export default Home;
