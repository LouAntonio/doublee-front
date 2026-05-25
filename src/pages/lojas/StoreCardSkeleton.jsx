const StoreCardSkeleton = () => (
	<div className="bg-white rounded-2xl overflow-hidden border border-[var(--lojas-border)] flex flex-col lojas-shimmer">
		<div className="relative aspect-[4/3]">
			<div className="absolute top-2.5 right-2.5 h-5 w-16 bg-[#e0d6cc] rounded-full" />
			<div className="absolute -bottom-5 left-3">
				<div className="w-12 h-12 rounded-xl border-[2.5px] border-white shadow-md bg-[#e0d6cc]" />
			</div>
			<div className="absolute inset-0 bg-gradient-to-t from-[#e0d6cc]/30 to-transparent" />
		</div>
		<div className="pt-8 px-4 pb-4 flex flex-col flex-1">
			<div className="h-4 bg-[#e8e0d8] rounded w-2/3 mb-1.5" />
			<div className="h-3.5 bg-[#e8e0d8] rounded w-1/3 mb-3" />
			<div className="mt-auto block text-center py-2 rounded-xl h-9 bg-[#ede8e2]" />
		</div>
	</div>
);

export default StoreCardSkeleton;
