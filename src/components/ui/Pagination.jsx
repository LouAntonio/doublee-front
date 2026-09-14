import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Pagination = ({ page, totalPages, onChange }) => {
	if (totalPages <= 1) return null;

	const maxVisible = 7;

	let windowStart;
	if (totalPages <= maxVisible) {
		windowStart = 1;
	} else if (page <= 4) {
		windowStart = 1;
	} else if (page >= totalPages - 3) {
		windowStart = totalPages - maxVisible + 1;
	} else {
		windowStart = page - 3;
	}
	const visiblePages = Array.from({ length: Math.min(totalPages, maxVisible) }, (_, i) => windowStart + i);

	return (
		<div className="flex flex-col items-center gap-2 mt-8">
			<div className="flex items-center justify-center gap-2">
				<button
					onClick={() => onChange(page - 1)}
					disabled={page <= 1}
					className="p-2 rounded-xl border border-accent/20 text-[#78716C] hover:bg-sand hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
					aria-label="Página anterior"
				>
					<IoChevronBack className="w-4 h-4" />
				</button>
				{visiblePages.map((pageNum) => (
					<button
						key={pageNum}
						onClick={() => onChange(pageNum)}
						className={`min-w-[36px] h-9 rounded-xl text-sm font-medium transition-all cursor-pointer ${page === pageNum
							? 'bg-accent text-white shadow-md'
							: 'border border-accent/20 text-[#78716C] hover:bg-sand hover:text-accent'
						}`}
					>
						{pageNum}
					</button>
				))}
				<button
					onClick={() => onChange(page + 1)}
					disabled={page >= totalPages}
					className="p-2 rounded-xl border border-accent/20 text-[#78716C] hover:bg-sand hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
					aria-label="Página seguinte"
				>
					<IoChevronForward className="w-4 h-4" />
				</button>
			</div>
			<span className="text-xs text-[#78716C]">Página {page} de {totalPages}</span>
		</div>
	);
};

export default Pagination;