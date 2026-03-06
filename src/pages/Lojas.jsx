import React, { useState, useEffect, useRef } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { IoSearchOutline, IoStarSharp, IoChevronBack, IoChevronForward, IoStorefrontOutline, IoShieldCheckmarkOutline, IoTrophyOutline } from 'react-icons/io5';
import { FaStore, FaBoxOpen, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiRequest from '../services/api';

const ITEMS_PER_PAGE = 8;

const stats = [
	{ icon: <IoStorefrontOutline className="text-2xl" />, value: '120+', label: 'Lojas Parceiras' },
	{ icon: <FaBoxOpen className="text-2xl" />, value: '50 mil+', label: 'Produtos Disponíveis' },
	{ icon: <FaUsers className="text-2xl" />, value: '200 mil+', label: 'Clientes Satisfeitos' },
	{ icon: <IoShieldCheckmarkOutline className="text-2xl" />, value: '100%', label: 'Compra Segura' },
];

const StoreLogo = ({ logo, name }) => {
	if (logo) {
		return (
			<img
				src={logo}
				alt={name}
				className="w-full h-full object-cover"
			/>
		);
	}
	const initials = name ? name.slice(0, 2).toUpperCase() : '??';
	return (
		<div className="w-full h-full flex items-center justify-center bg-orange-100 text-[#F97316] font-bold text-lg">
			{initials}
		</div>
	);
};

const Lojas = () => {
	useDocumentTitle('Lojas - Double E');
	const [search, setSearch] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [stores, setStores] = useState([]);
	const [featuredStores, setFeaturedStores] = useState([]);
	const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
	const [loading, setLoading] = useState(true);
	const [loadingFeatured, setLoadingFeatured] = useState(true);
	const debounceRef = useRef(null);

	// Fetch featured stores once on mount
	useEffect(() => {
		const fetchFeatured = async () => {
			setLoadingFeatured(true);
			const res = await apiRequest('/stores/featured');
			if (res.success) {
				setFeaturedStores(res.data.stores);
			}
			setLoadingFeatured(false);
		};
		fetchFeatured();
	}, []);

	// Fetch paginated stores when page changes (immediately)
	// When search changes, debounce the fetch and reset to page 1
	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);

		const doFetch = async () => {
			setLoading(true);
			const params = new URLSearchParams({
				page: currentPage,
				limit: ITEMS_PER_PAGE,
				...(search.trim() ? { search: search.trim() } : {}),
			});
			const res = await apiRequest(`/stores?${params}`);
			if (res.success) {
				setStores(res.data.stores);
				setPagination(res.data.pagination);
			}
			setLoading(false);
		};

		debounceRef.current = setTimeout(doFetch, search ? 400 : 0);
		return () => clearTimeout(debounceRef.current);
	}, [search, currentPage]);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleInputKeyDown = (e) => {
		if (e.key === 'Enter') {
			const trimmed = inputValue.trim();
			setSearch(trimmed);
			setCurrentPage(1);
		}
	};

	const totalPages = pagination.totalPages || 1;

	return (
		<div className="bg-gray-50 flex flex-col">
			{/* Header + Hero fill 100vh */}
			<div className="h-screen flex flex-col">
				<Header />

				{/* ── Hero ── */}
				<div className="relative overflow-hidden flex-1">
					<img
						src="./images/slider/1.webp"
						alt="Lojas"
						className="absolute inset-0 w-full h-full object-cover"
					/>
					{/* Multi-layer gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-orange-950/60 to-orange-900/40" />
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

					{/* Animated background elements */}
					<div className="absolute top-10 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-20 right-20 w-60 h-60 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

					<div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 h-full py-12">
						{/* Badge */}
						<span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full mb-6 border border-white/30 shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
							<IoTrophyOutline className="text-base" /> Lojas verificadas e aprovadas
						</span>

						{/* Main Headline */}
						<div className="mb-6 overflow-hidden">
							<h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] mb-2 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
								As Melhores
							</h1>
							<h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both" style={{ color: '#FFA500' }}>
								Lojas
							</h1>
						</div>

						{/* Divider */}
						<div className="w-16 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mb-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-200" />

						{/* Subtitle */}
						<p className="text-base sm:text-lg md:text-xl max-w-2xl opacity-95 mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
							Encontre as lojas parceiras Double E e compre com total confiança. Mais de 120 estabelecimentos verificados esperando por você.
						</p>

						{/* Search Bar */}
						<div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
							<div className="relative group">
								<div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-500/20 rounded-full blur-xl opacity-0  transition-opacity duration-300" />
								<IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
								<input
									type="text"
									placeholder="Pesquisar loja por nome..."
									value={inputValue}
									onChange={handleInputChange}
									onKeyDown={handleInputKeyDown}
									className="relative w-full pl-14 pr-6 py-4 sm:py-5 rounded-full text-gray-500 text-sm sm:text-base shadow-2xl focus:outline-none  transition-all duration-300 placeholder:text-gray-500 font-medium"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>{/* end h-screen wrapper */}

			{/* ── Stats bar ── */}
			<div className="bg-white border-b border-gray-100 shadow-sm">
				<div className="max-w-[1200px] mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
					{stats.map((s, i) => (
						<div key={i} className="flex items-center gap-3">
							<div className="w-11 h-11 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center flex-shrink-0">
								{s.icon}
							</div>
							<div>
								<p className="text-lg font-bold text-gray-800 leading-tight">{s.value}</p>
								<p className="text-xs text-gray-500">{s.label}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ── Destaques ── */}
			{!search && featuredStores.length > 0 && (
				<div className="px-4 py-10 bg-gradient-to-b from-orange-50 to-gray-50">
					<div className="max-w-[1200px] mx-auto">
						<div className="flex items-center gap-2 mb-6">
							<IoTrophyOutline className="text-[#F97316] text-xl" />
							<h2 className="text-xl font-bold text-gray-800">Lojas em Destaque</h2>
						</div>
						{loadingFeatured ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="relative overflow-hidden rounded-2xl shadow-md h-52 block bg-gray-200 animate-pulse">
										<div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200/20 to-transparent" />
										<div className="absolute top-3 left-3">
											<div className="h-6 w-20 bg-gray-300 rounded-full" />
										</div>
										<div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
											<div className="w-10 h-10 rounded-full border-2 border-white shadow flex-shrink-0 overflow-hidden bg-gray-300" />
											<div className="min-w-0 flex-1">
												<div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
												<div className="h-3 bg-gray-300 rounded w-1/2" />
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
								{featuredStores.map(store => (
									<Link
										to={`/loja/${store.id}`}
										key={store.id}
										className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-52 block bg-gray-800"
									>
										{store.banner ? (
											<img
												src={store.banner}
												alt={store.name}
												className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
											/>
										) : (
											<div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600" />
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
										<div className="absolute top-3 left-3">
											<span className="bg-[#F97316] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
												⭐ Destaque
											</span>
										</div>
										<div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
											<div className="w-10 h-10 rounded-full border-2 border-white shadow flex-shrink-0 overflow-hidden">
												<StoreLogo logo={store.logo} name={store.name} />
											</div>
											<div className="min-w-0">
												<p className="text-white font-bold text-sm truncate leading-tight">{store.name}</p>
												<div className="flex items-center gap-1 mt-0.5">
													<IoStarSharp className="text-yellow-400 text-xs" />
													<span className="text-white/90 text-xs font-medium">{store.rating}</span>
													<span className="text-white/60 text-xs">({store.qtdRatings ?? 0})</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			)}

			{/* ── All stores ── */}
			<div className="px-4 pb-14 flex-1">
				<div className="max-w-[1200px] mx-auto">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-gray-800">
							{search ? 'Resultados da pesquisa' : 'Todas as Lojas'}
						</h2>
						<span className="text-sm text-gray-400">
							{pagination.total} {pagination.total === 1 ? 'loja' : 'lojas'}
						</span>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
							{[...Array(ITEMS_PER_PAGE)].map((_, i) => (
								<div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
									<div className="relative h-40 bg-gray-200">
										<div className="absolute top-3 right-3 h-6 w-20 bg-gray-300 rounded-full" />
										<div className="absolute -bottom-6 left-4">
											<div className="w-14 h-14 rounded-xl border-[3px] border-white shadow-md bg-gray-300" />
										</div>
									</div>
									<div className="pt-9 px-4 pb-4 flex flex-col flex-1">
										<div className="mb-3">
											<div className="h-5 bg-gray-200 rounded w-2/3" />
										</div>
										<div className="flex items-center gap-0.5 mb-4">
											<div className="h-4 bg-gray-200 rounded w-1/3" />
										</div>
										<div className="mt-auto block text-center py-2.5 rounded-xl h-10 bg-gray-100" />
									</div>
								</div>
							))}
						</div>
					) : stores.length === 0 ? (
						<div className="text-center py-24 text-gray-400">
							<FaStore className="text-5xl mx-auto mb-4 opacity-20" />
							<p className="text-lg font-medium">Nenhuma loja encontrada.</p>
							<p className="text-sm mt-1">Tente outro nome.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
							{stores.map(store => (
								<div
									key={store.id}
									className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col"
								>
									{/* Cover */}
									<div className="relative h-40 overflow-hidden bg-gray-100">
										{store.banner ? (
											<img
												src={store.banner}
												alt={store.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										) : (
											<div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 group-hover:scale-105 transition-transform duration-500" />
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
										{store.featured && (
											<span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow bg-[#F97316] text-white">
												⭐ Destaque
											</span>
										)}
										{/* Logo overlapping */}
										<div className="absolute -bottom-6 left-4">
											<div
												className="w-14 h-14 rounded-xl overflow-hidden"
												style={{ border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
											>
												<StoreLogo logo={store.logo} name={store.name} />
											</div>
										</div>
									</div>

									{/* Body */}
									<div className="pt-9 px-4 pb-4 flex flex-col flex-1">
										<div className="mb-3">
											<h3 className="font-bold text-gray-800 text-base leading-tight truncate">{store.name}</h3>
										</div>

										<div className="flex items-center gap-0.5 mb-4">
											{[...Array(5)].map((_, i) => (
												<IoStarSharp
													key={i}
													className={i < Math.round(store.rating ?? 0) ? 'text-yellow-400 text-xs' : 'text-gray-200 text-xs'}
												/>
											))}
											<span className="ml-1 text-xs font-semibold text-gray-700">{store.rating}</span>
											<span className="text-xs text-gray-400 ml-0.5">({store.qtdRatings ?? 0})</span>
										</div>

										<Link
											to={`/loja/${store.id}`}
											className="mt-auto block text-center py-2.5 rounded-xl text-sm font-semibold bg-orange-50 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-colors duration-200 border border-orange-100 hover:border-[#F97316]"
										>
											Ver Loja →
										</Link>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2 mt-12">
							<button
								onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
							>
								<IoChevronBack />
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
								<button
									key={page}
									onClick={() => setCurrentPage(page)}
									className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${currentPage === page
										? 'bg-[#F97316] text-white border-[#F97316] shadow-md'
										: 'border-gray-200 text-gray-600 hover:border-[#F97316] hover:text-[#F97316]'
									}`}
								>
									{page}
								</button>
							))}
							<button
								onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
							>
								<IoChevronForward />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Lojas;
