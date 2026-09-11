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
	useDocumentTitle('Home - Kuvangana');

	return (
		<div style={{ backgroundColor: '#ededed' }}>
			<Header />
			<BannerCarousel />
			<FeaturedProductsSection />
			
			<div className="max-w-[1200px] mx-auto px-6 my-8">
				<img src="/images/ads/1.png" alt="Anúncio 1" className="w-full h-auto rounded-lg object-cover" />
			</div>

			<CategoriesSection />
			<NewProductsSection />
			<BestSellersSection />
			
			<div className="max-w-[1200px] mx-auto px-6 my-8">
				<img src="/images/ads/2.png" alt="Anúncio 2" className="w-full h-auto rounded-lg object-cover" />
			</div>

			<LatestProductsSection />
		</div>
	);
};

export default Home;
