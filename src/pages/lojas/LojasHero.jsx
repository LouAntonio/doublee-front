import { useRef, useEffect, useCallback } from 'react';
import { IoTrophyOutline, IoSearchOutline } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';

const LojasHero = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchValue = searchParams.get('search') || '';
	const debounceRef = useRef(null);
	const paramsRef = useRef(searchParams);
	useEffect(() => {
		paramsRef.current = searchParams;
	}, [searchParams]);

	const updateSearch = useCallback(
		(value) => {
			const next = new URLSearchParams(paramsRef.current);
			const trimmed = value.trim();
			if (trimmed) {
				next.set('search', trimmed);
			} else {
				next.delete('search');
			}
			next.delete('page');
			setSearchParams(next, { replace: true });
		},
		[setSearchParams],
	);

	const handleChange = (e) => {
		const value = e.target.value;
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			updateSearch(value);
		}, 400);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			updateSearch(e.target.value);
		}
	};

	return (
		<section
			aria-label="Hero Lojas"
			className="relative flex flex-col md:flex-row min-h-[70vh] bg-[var(--lojas-cream)] overflow-hidden"
		>
			{/* ── Image Side ── */}
			<div className="relative w-full md:w-[55%] min-h-[50vh] md:min-h-[70vh] overflow-hidden">
				<img
					src="./images/slider/1.webp"
					alt=""
					aria-hidden="true"
					className="absolute inset-0 w-full h-full object-cover md:object-[center_30%]"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/5 via-orange-500/15 to-orange-600/25" />
				<div className="absolute inset-0 bg-gradient-to-t from-[var(--lojas-cream)] via-transparent to-transparent md:hidden" />

				{/* Decorative circle */}
				<div className="hidden md:block absolute top-8 right-8 w-48 h-48 rounded-full border border-white/10 lojas-circle-pulse" />
			</div>

			{/* ── Content Side ── */}
			<div className="relative w-full md:w-[45%] flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-0 bg-[var(--lojas-cream)]">
				{/* Badge */}
				<div className="mb-6">
					<span className="inline-flex items-center gap-2 bg-orange-50 text-[var(--lojas-accent)] text-xs font-bold px-4 py-2 rounded-full border border-orange-100 tracking-wider uppercase">
						<IoTrophyOutline className="text-sm" />
						Lojas verificadas
					</span>
				</div>

				{/* Headline */}
				<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-[var(--lojas-charcoal)] font-heading">
					As{' '}
					<span className="lojas-hero-gradient-text">Melhores</span>
					<br />
					Lojas
				</h1>

				{/* Decorative divider */}
				<div className="flex items-center gap-3 my-6">
					<div className="w-10 h-0.5 bg-[var(--lojas-accent)]" />
					<div className="w-2 h-2 rounded-full bg-[var(--lojas-accent)]" />
					<div className="h-px flex-1 bg-gradient-to-r from-[var(--lojas-border)] to-transparent" />
				</div>

				{/* Subtitle */}
				<p className="text-sm md:text-base text-[var(--lojas-text)] max-w-md leading-relaxed mb-8">
					Encontra as lojas parceiras Double E e compra com total
					confiança. Mais de 120 estabelecimentos verificados à tua
					espera.
				</p>

				{/* Search */}
				<div className="w-full max-w-md">
					<div className="relative group">
						<IoSearchOutline
							className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--lojas-muted)] text-lg pointer-events-none"
							aria-hidden="true"
						/>
						<input
							type="text"
							role="searchbox"
							aria-label="Pesquisar lojas por nome"
							placeholder="Pesquisar loja por nome..."
							value={searchValue}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							className="relative w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-[var(--lojas-border)] text-[var(--lojas-charcoal)] text-sm shadow-sm focus:outline-none transition-all duration-300 placeholder:text-[var(--lojas-muted)] lojas-hero-input"
						/>
					</div>
				</div>

				{/* Mobile stats */}
				<div className="flex md:hidden items-center gap-4 mt-8 pt-6 border-t border-[var(--lojas-border)]">
					<div>
						<p className="text-lg font-bold text-[var(--lojas-charcoal)] font-heading">
							120+
						</p>
						<p className="text-[10px] text-[var(--lojas-muted)] tracking-wider uppercase font-semibold">
							Lojas Parceiras
						</p>
					</div>
					<div className="w-px h-8 bg-[var(--lojas-border)]" />
					<div>
						<p className="text-lg font-bold text-[var(--lojas-charcoal)] font-heading">
							100%
						</p>
						<p className="text-[10px] text-[var(--lojas-muted)] tracking-wider uppercase font-semibold">
							Compra Segura
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LojasHero;
