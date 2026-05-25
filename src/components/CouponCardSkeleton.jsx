import React from 'react';

const CouponCardSkeleton = () => (
	<div className="bg-white rounded-xl shadow-md border border-amber-100/50 overflow-hidden animate-pulse">
		<div className="h-2 w-full bg-amber-200/60" />
		<div className="p-5 space-y-4">
			<div className="flex justify-between items-start">
				<div className="w-10 h-10 bg-amber-100 rounded-xl" />
				<div className="h-5 bg-amber-100 rounded-full w-24" />
			</div>
			<div className="space-y-2.5">
				<div className="h-8 bg-amber-100 rounded w-1/3" />
				<div className="h-5 bg-amber-100 rounded w-1/2" />
				<div className="h-4 bg-amber-100/70 rounded w-3/4" />
			</div>
			<div className="pt-4 border-t border-dashed border-amber-100">
				<div className="h-10 bg-amber-100/50 rounded-lg" />
			</div>
		</div>
	</div>
);

export default CouponCardSkeleton;
