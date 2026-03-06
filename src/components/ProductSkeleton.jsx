import React from 'react';

const ProductSkeleton = () => {
	return (
		<div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse transition-all duration-300">
			{/* Image Placeholder */}
			<div className="relative aspect-square bg-gray-200">
			</div>

			{/* Content Placeholder */}
			<div className="p-3 flex flex-col flex-1 gap-3">
				{/* Title */}
				<div className="space-y-2 mt-1">
					<div className="h-3 bg-gray-200 rounded w-full"></div>
					<div className="h-3 bg-gray-200 rounded w-3/4"></div>
				</div>

				{/* Rating */}
				<div className="flex gap-1 mt-1">
					{[1, 2, 3, 4, 5].map(i => (
						<div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
					))}
				</div>

				{/* Price */}
				<div className="flex items-center gap-2 mt-auto mb-1">
					<div className="h-4 bg-gray-300 rounded w-1/3"></div>
					<div className="h-3 bg-gray-200 rounded w-1/4"></div>
				</div>

				{/* Button */}
				<div className="w-full h-8 bg-gray-200 rounded-xl mt-1"></div>
			</div>
		</div>
	);
};

export default ProductSkeleton;
