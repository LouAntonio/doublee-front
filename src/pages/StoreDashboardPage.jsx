import React from 'react';
import Header from '../components/Header';
import StoreDashboard from '../components/dashboard/StoreDashboard';

const StoreDashboardPage = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />
			<main className="flex-grow max-w-[1200px] w-full mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
					<div className="p-6">
						<StoreDashboard />
					</div>
				</div>
			</main>
		</div>
	);
};

export default StoreDashboardPage;
