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
			
			<div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 15px' }}>
				<img src="/images/ads/1.png" alt="Anúncio 1" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
			</div>

			<CategoriesSection />
			<NewProductsSection />
			<BestSellersSection />
			
			<div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 15px' }}>
				<img src="/images/ads/2.png" alt="Anúncio 2" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
			</div>

			<LatestProductsSection />
		</div>
	);
};

export default Home;
