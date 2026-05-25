import React from 'react';
import Header from '../components/Header';
import StoreDashboard from '../components/dashboard/StoreDashboard';

const StoreDashboardPage = () => {
	return (
		<div className="min-h-screen bg-sand flex flex-col">
			<Header />
			<main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-12">
				<StoreDashboard />
			</main>
		</div>
	);
};

export default StoreDashboardPage;
