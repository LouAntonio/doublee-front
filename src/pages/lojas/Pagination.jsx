import { useSearchParams } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Pagination = ({ totalPages }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const currentPage = parseInt(searchParams.get('page') || '1', 10);

	const goToPage = (page) => {
		if (page < 1 || page > totalPages) return;
		const next = new URLSearchParams(searchParams);
		if (page === 1) {
			next.delete('page');
		} else {
			next.set('page', String(page));
		}
		setSearchParams(next, { replace: true });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<nav
			aria-label="Paginação de lojas"
			className="flex items-center justify-center gap-2 mt-14"
		>
			<button
				onClick={() => goToPage(currentPage - 1)}
				disabled={currentPage === 1}
				className="p-2.5 rounded-xl border border-[var(--lojas-border)] text-[var(--lojas-muted)] hover:border-[var(--lojas-accent)] hover:text-[var(--lojas-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
				aria-label="Página anterior"
			>
				<IoChevronBack />
			</button>

			{pages.map((page) => (
				<button
					key={page}
					onClick={() => goToPage(page)}
					aria-label={`Página ${page}`}
					aria-current={page === currentPage ? 'page' : undefined}
					className={
						page === currentPage
							? 'w-10 h-10 rounded-xl text-sm font-bold bg-[var(--lojas-accent)] text-white shadow-md shadow-orange-500/20 transition-all duration-200 cursor-pointer'
							: 'w-10 h-10 rounded-xl text-sm font-semibold border border-[var(--lojas-border)] text-[var(--lojas-text)] hover:border-[var(--lojas-accent)] hover:text-[var(--lojas-accent)] transition-all duration-200 cursor-pointer'
					}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => goToPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="p-2.5 rounded-xl border border-[var(--lojas-border)] text-[var(--lojas-muted)] hover:border-[var(--lojas-accent)] hover:text-[var(--lojas-accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
				aria-label="Próxima página"
			>
				<IoChevronForward />
			</button>
		</nav>
	);
};

export default Pagination;
