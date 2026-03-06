import React from 'react';

const StoreDashboardSkeleton = () => {
	return (
		<div className="space-y-0 w-full animate-pulse">
			{/* Tab Bar Skeleton */}
			<div className="flex gap-1 bg-gray-50 rounded-2xl p-1 mb-6 overflow-x-auto">
				{[1, 2, 3, 4, 5].map(i => (
					<div key={i} className="flex-1 h-10 bg-gray-200 rounded-xl min-w-[100px]"></div>
				))}
			</div>

			<div className="space-y-6">
				{/* Header */}
				<div>
					<div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
					<div className="h-4 w-48 bg-gray-200 rounded"></div>
				</div>

				{/* Stat Cards */}
				<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map(i => (
						<div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between h-28">
							<div className="w-10 h-10 rounded-xl bg-gray-200"></div>
							<div className="space-y-2 mt-auto">
								<div className="h-3 w-16 bg-gray-200 rounded"></div>
								<div className="h-5 w-24 bg-gray-200 rounded"></div>
							</div>
						</div>
					))}
				</div>

				{/* Store Banner */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					<div className="w-full h-32 bg-gray-200"></div>
					<div className="px-5 py-4 flex items-center gap-4">
						<div className="w-14 h-14 rounded-xl bg-gray-300 border-4 border-white shadow-sm -mt-9 relative z-10 shrink-0"></div>
						<div className="flex-1 space-y-2 py-1">
							<div className="h-5 w-40 bg-gray-200 rounded"></div>
							<div className="h-3 w-32 bg-gray-200 rounded"></div>
						</div>
						<div className="hidden sm:flex items-center gap-1">
							<div className="w-4 h-4 bg-gray-200 rounded-full"></div>
							<div className="w-8 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>

				{/* Recent Orders */}
				<div>
					<div className="h-4 w-36 bg-gray-200 rounded mb-4"></div>
					<div className="space-y-2">
						{[1, 2, 3].map(i => (
							<div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
								<div className="space-y-2">
									<div className="h-4 w-20 bg-gray-200 rounded"></div>
									<div className="h-3 w-28 bg-gray-200 rounded"></div>
								</div>
								<div className="flex items-center gap-3">
									<div className="h-4 w-16 bg-gray-200 rounded"></div>
									<div className="h-6 w-24 bg-gray-200 rounded-full"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StoreDashboardSkeleton;
