import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import HeroSection from '../components/sobre/HeroSection';
import StatsSection from '../components/sobre/StatsSection';
import StorySection from '../components/sobre/StorySection';
import MissionSection from '../components/sobre/MissionSection';
import FeaturesSection from '../components/sobre/FeaturesSection';
import TimelineSection from '../components/sobre/TimelineSection';
import TestimonialsSection from '../components/sobre/TestimonialsSection';
import CTASection from '../components/sobre/CTASection';

const Sobre = () => {
	useDocumentTitle('Sobre - Double E');

	return (
		<div className="min-h-screen bg-sand flex flex-col">
			<Header />

			<main>
				<HeroSection />
				<StatsSection />
				<StorySection />
				<MissionSection />
				<FeaturesSection />
				<TimelineSection />
				<TestimonialsSection />
				<CTASection />
			</main>
		</div>
	);
};

export default Sobre;
