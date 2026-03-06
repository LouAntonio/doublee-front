import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
	IoStarSharp, IoStar, IoStarOutline, IoChevronBack, IoChevronForward,
	IoStorefrontOutline, IoShieldCheckmarkOutline, IoCallOutline,
	IoMailOutline, IoLocationOutline, IoTimeOutline, IoSearchOutline,
	IoCheckmarkCircleOutline, IoShareSocialOutline,
	IoCartOutline, IoChatbubbleOutline, IoGridOutline, IoListOutline,
} from 'react-icons/io5';
import { FaBoxOpen, FaUsers, FaAward, FaFacebook, FaWhatsapp, FaLink } from 'react-icons/fa';
import Header from '../components/Header';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { notyf } from '../utils/notyf';
import apiRequest from '../services/api';

/* ─── Helper components ───────────────────────────────────────────────── */
const StarRow = ({ rating, size = 'text-sm' }) => (
	<div className="flex items-center gap-0.5">
		{[1, 2, 3, 4, 5].map(i => (
			<IoStarSharp key={i} className={`${size} ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
		))}
	</div>
);

const RatingBar = ({ label, count, total }) => {
	const pct = total ? Math.round((count / total) * 100) : 0;
	return (
		<div className="flex items-center gap-3">
			<span className="text-xs text-gray-500 w-8 text-right">{label}★</span>
			<div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
				<div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
			</div>
			<span className="text-xs text-gray-400 w-8">{count}</span>
		</div>
	);
};

/* ─── Main Component ──────────────────────────────────────────────────── */
const LojaDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addToCart } = useCart();

	const [store, setStore] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('produtos');
	const [productSearch, setProductSearch] = useState('');
	const [gridView, setGridView] = useState(true);
	const [products, setProducts] = useState([]);
	const [showShareMenu, setShowShareMenu] = useState(false);

	useDocumentTitle(store ? `${store.name} – Double E` : 'Detalhes da Loja – Double E');

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			setLoading(true);
			try {
				const resp = await apiRequest(`/stores/${id}`);
				if (!mounted) return;
				if (resp && resp.success) {
					const s = resp.data.store;

					const opinions = (s.reviews || []).map(r => ({
						id: r.id,
						user: r.user?.name || 'Usuário',
						avatar: (r.user?.name || 'U').split(' ').map(x => x[0]).slice(0, 2).join(''),
						rating: r.rating,
						title: '',
						comment: r.comment || '',
						date: new Date(r.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
						helpful: 0,
						verified: false,
					}));

					const ratingDistribution = {
						5: opinions.filter(o => o.rating === 5).length,
						4: opinions.filter(o => o.rating === 4).length,
						3: opinions.filter(o => o.rating === 3).length,
						2: opinions.filter(o => o.rating === 2).length,
						1: opinions.filter(o => o.rating === 1).length,
					};

					const mapped = {
						id: s.id,
						name: s.name,
						description: s.description || '',
						logo: s.logo || '/images/logo/default-store.png',
						image: s.banner || s.logo || '/images/logo/default-store.png',
						category: 'Loja',
						rating: s.rating ?? 0,
						reviews: s.qtdRatings ?? opinions.length,
						products: 0,
						badge: s.featured ? 'Destaque' : null,
						address: s.location || s.province || '—',
						phone: s.phone || '—',
						email: s.email || '—',
						hours: s.workingHours || '—',
						createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' }) : '—',
						founded: '',
						employees: '',
						ratingDistribution,
						opinions,
					};

					// Buscar produtos reais da API filtrando pela loja
					try {
						const prodResp = await apiRequest(`/products?storeId=${s.id}&limit=24`);
						const apiProducts = (prodResp && prodResp.success && prodResp.data && prodResp.data.products) ? prodResp.data.products : [];
						const totalProducts = prodResp && prodResp.success && prodResp.data && prodResp.data.pagination ? prodResp.data.pagination.total : apiProducts.length;
						// Mapear para o formato esperado pelo componente
						const mappedProducts = apiProducts.map(p => ({
							id: p.id,
							title: p.name,
							price: p.promotionalPrice ?? p.price,
							oldPrice: p.promotionalPrice ? p.price : null,
							image: p.image || `https://via.placeholder.com/400x400/f8f8f8/999?text=${encodeURIComponent(p.name.split(' ').slice(0, 2).join('+'))}`,
							rating: p.rating ?? 0,
							reviewCount: p.qtdRatings ?? 0,
						}));

						mapped.products = totalProducts || mappedProducts.length;
						setStore(mapped);
						setProducts(mappedProducts);
					} catch (err) {
						console.error('Error fetching products:', err);
						setStore(mapped);
						setProducts([]);
					}
				} else {
					setStore(null);
					notyf.error(resp?.msg || 'Erro ao obter a loja.');
				}
			} catch (err) {
				console.error(err);
				if (mounted) {
					setStore(null);
					notyf.error('Erro ao comunicar com o servidor.');
				}
			} finally {
				if (mounted) setLoading(false);
			}
		};

		load();

		return () => { mounted = false; };
	}, [id]);


	const handleAddToCart = (product) => {
		addToCart(product, 1);
		notyf.success('Produto adicionado ao carrinho!');
	};

	const currentUrl = window.location.href;

	const handleShare = (network) => {
		const text = `Confira a loja ${store?.name} na Double E!`;
		if (network === 'facebook') {
			window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
		} else if (network === 'whatsapp') {
			window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`, '_blank');
		} else if (network === 'copy') {
			navigator.clipboard.writeText(currentUrl);
			notyf.success('Link copiado!');
		}
		setShowShareMenu(false);
	};

	const filteredProducts = products.filter(p =>
		p.title.toLowerCase().includes(productSearch.toLowerCase())
	);

	const totalRatings = store
		? Object.values(store.ratingDistribution).reduce((a, b) => a + b, 0)
		: 0;

	/* ── Loading ── */
	if (loading) {
		return (
			<div className="bg-gray-50 min-h-screen flex flex-col">
				<Header />
				{/* Skeleton Hero banner */}
				<div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-200 animate-pulse" />

				<div className="max-w-[1200px] w-full mx-auto px-4 mb-10 flex-1">
					{/* Skeleton Store card */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-10 relative z-10 p-5 sm:p-7 flex flex-col sm:flex-row gap-5">
						<div className="flex-shrink-0">
							<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-300 border-4 border-white shadow-md animate-pulse" />
						</div>
						<div className="flex-1 min-w-0 py-2">
							<div className="h-8 bg-gray-300 rounded w-1/2 sm:w-1/3 mb-4 animate-pulse" />
							<div className="flex flex-wrap gap-4 mb-4">
								<div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
								<div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
								<div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
							</div>
							<div className="flex flex-wrap gap-2.5">
								<div className="h-8 bg-gray-100 rounded-lg w-28 animate-pulse" />
								<div className="h-8 bg-gray-100 rounded-lg w-32 animate-pulse" />
								<div className="h-8 bg-gray-100 rounded-lg w-24 animate-pulse" />
							</div>
						</div>
					</div>

					{/* Skeleton Tabs & Content */}
					<div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
						<div className="flex border-b border-gray-100 p-4 gap-6 animate-pulse">
							<div className="h-5 bg-gray-300 rounded w-24" />
							<div className="h-5 bg-gray-200 rounded w-24" />
							<div className="h-5 bg-gray-200 rounded w-24" />
						</div>
						<div className="p-5 sm:p-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-64">
									<div className="h-1/2 bg-gray-200" />
									<div className="p-3 flex flex-col flex-1 gap-2">
										<div className="h-4 bg-gray-300 rounded w-full" />
										<div className="h-4 bg-gray-200 rounded w-2/3" />
										<div className="h-6 bg-gray-200 rounded-xl w-full mt-auto" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	/* ── Not found ── */
	if (!store) {
		return (
			<div className="bg-gray-50 min-h-screen">
				<Header />
				<div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
					<IoStorefrontOutline className="text-6xl text-gray-300 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-700 mb-2">Loja não encontrada</h2>
					<p className="text-gray-400 mb-6">A loja que procura não existe ou foi removida.</p>
					<button
						onClick={() => navigate('/lojas')}
						className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
					>
						Ver todas as lojas
					</button>
				</div>
			</div>
		);
	}

	const tabs = [
		{ key: 'produtos', label: `Produtos (${store.products.toLocaleString('pt-AO')})` },
		{ key: 'avaliacoes', label: `Avaliações (${store.reviews})` },
		{ key: 'sobre', label: 'Sobre a Loja' },
	];

	return (
		<div className="bg-gray-50 min-h-screen">
			<Header />

			{/* ── Hero banner ── */}
			<div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
				<img
					src={store.image}
					alt={store.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

				{/* Back button */}
				<button
					onClick={() => navigate('/lojas')}
					className="absolute top-5 left-4 sm:left-6 flex items-center gap-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-sm font-medium px-3.5 py-2 rounded-full transition-all cursor-pointer"
				>
					<IoChevronBack className="text-base" />
					Lojas
				</button>

				{/* Share */}
				<div className="absolute top-5 right-4 sm:right-6">
					<button
						onClick={() => setShowShareMenu(!showShareMenu)}
						className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full transition-all cursor-pointer"
					>
						<IoShareSocialOutline className="text-lg" />
					</button>

					{showShareMenu && (
						<div className="absolute top-11 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
							<button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
								<FaFacebook className="text-blue-600 text-base" /> Facebook
							</button>
							<button onClick={() => handleShare('whatsapp')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
								<FaWhatsapp className="text-green-500 text-base" /> WhatsApp
							</button>
							<button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
								<FaLink className="text-gray-500 text-base" /> Copiar Link
							</button>
						</div>
					)}
				</div>

				{/* Badge */}
				{store.badge && (
					<span className={`absolute top-5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1.5 rounded-full shadow ${store.badge === 'Destaque' ? 'bg-[#F97316] text-white' : 'bg-emerald-500 text-white'}`}>
						{store.badge === 'Destaque' ? '⭐ Destaque' : '🆕 Novo'}
					</span>
				)}
			</div>

			{/* ── Store card ── */}
			<div className="max-w-[1200px] mx-auto px-4 mb-10">
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-10 relative z-10 p-5 sm:p-7">
					<div className="flex flex-col sm:flex-row gap-5 sm:items-start">
						{/* Logo */}
						<div className="flex-shrink-0">
							<img
								src={store.logo}
								alt={store.name}
								className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
							/>
						</div>

						{/* Info */}
						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">{store.name}</h1>
									<span className="inline-block mt-1 text-xs font-semibold text-[#F97316] bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full">
										{store.category}
									</span>
								</div>

								{/* Actions (intentionally left empty) */}
								<div className="flex items-center gap-2" />
							</div>

							{/* Stats row */}
							<div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
								<div className="flex items-center gap-1.5">
									<div className="flex items-center gap-0.5">
										{[1, 2, 3, 4, 5].map(i => (
											<IoStarSharp key={i} className={`text-sm ${i <= Math.round(store.rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
										))}
									</div>
									<span className="text-sm font-bold text-gray-800">{store.rating}</span>
									<span className="text-sm text-gray-400">({store.reviews.toLocaleString('pt-AO')} avaliações)</span>
								</div>
								<div className="flex items-center gap-1.5 text-sm text-gray-500">
									<FaBoxOpen className="text-[#F97316]" />
									<span>{store.products.toLocaleString('pt-AO')} produtos</span>
								</div>
								<div className="flex items-center gap-1.5 text-sm text-gray-500">
									<IoShieldCheckmarkOutline className="text-emerald-500" />
									<span>Loja Verificada</span>
								</div>
							</div>
						</div>
					</div>

					{/* Quick info pills */}
					<div className="mt-5 flex flex-wrap gap-2.5">
						{[
							{ icon: <IoLocationOutline />, text: store.address },
							{ icon: <IoTimeOutline />, text: store.hours },
							{ icon: <IoCallOutline />, text: store.phone },
							{ icon: <IoMailOutline />, text: store.email },
						].map((item, i) => (
							<div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600">
								<span className="text-[#F97316]">{item.icon}</span>
								{item.text}
							</div>
						))}
					</div>
				</div>

				{/* ── Tabs ── */}
				<div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
					{/* Tab bar */}
					<div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
						{tabs.map(tab => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`flex-shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === tab.key
									? 'border-[#F97316] text-[#F97316]'
									: 'border-transparent text-gray-500 hover:text-gray-700'
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div className="p-5 sm:p-7">
						{/* ── Tab: Produtos ── */}
						{activeTab === 'produtos' && (
							<div>
								{/* Toolbar */}
								<div className="flex flex-col sm:flex-row gap-3 mb-6">
									<div className="relative flex-1">
										<IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Pesquisar produto…"
											value={productSearch}
											onChange={e => setProductSearch(e.target.value)}
											className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none transition-colors"
										/>
									</div>
									<div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
										<button
											onClick={() => setGridView(true)}
											className={`p-2 rounded-lg transition-all cursor-pointer ${gridView ? 'bg-white shadow text-[#F97316]' : 'text-gray-400'}`}
										>
											<IoGridOutline />
										</button>
										<button
											onClick={() => setGridView(false)}
											className={`p-2 rounded-lg transition-all cursor-pointer ${!gridView ? 'bg-white shadow text-[#F97316]' : 'text-gray-400'}`}
										>
											<IoListOutline />
										</button>
									</div>
								</div>

								{filteredProducts.length === 0 ? (
									<div className="text-center py-16 text-gray-400">
										<FaBoxOpen className="text-4xl mx-auto mb-3 opacity-25" />
										<p className="font-medium">Nenhum produto encontrado.</p>
									</div>
								) : gridView ? (
									<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
										{filteredProducts.map(product => (
											<div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
												<div className="relative aspect-square overflow-hidden bg-gray-50">
													<img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
													{product.oldPrice && (
														<span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
															-{Math.round((1 - product.price / product.oldPrice) * 100)}%
														</span>
													)}
												</div>
												<div className="p-3 flex flex-col flex-1">
													<p className="text-xs text-gray-700 font-medium line-clamp-2 leading-tight mb-2 flex-1">{product.title}</p>
													<div className="flex items-center gap-1 mb-2">
														<StarRow rating={product.rating} />
														<span className="text-[10px] text-gray-400">({product.reviewCount})</span>
													</div>
													<div className="mb-3">
														<span className="text-sm font-bold text-gray-800">{formatCurrency(product.price)}</span>
														{product.oldPrice && (
															<span className="ml-1.5 text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
														)}
													</div>
													<button
														onClick={() => handleAddToCart(product)}
														className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-50 text-[#F97316] text-xs font-semibold hover:bg-[#F97316] hover:text-white border border-orange-100 hover:border-[#F97316] transition-colors cursor-pointer"
													>
														<IoCartOutline />
														Adicionar
													</button>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="flex flex-col gap-3">
										{filteredProducts.map(product => (
											<div key={product.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-md transition-shadow">
												<div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
													<img src={product.image} alt={product.title} className="w-full h-full object-cover" />
												</div>
												<div className="flex-1 min-w-0 flex flex-col justify-center">
													<p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{product.title}</p>
													<div className="flex items-center gap-1 mb-1.5">
														<StarRow rating={product.rating} />
														<span className="text-xs text-gray-400">({product.reviewCount})</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-bold text-gray-800">{formatCurrency(product.price)}</span>
														{product.oldPrice && (
															<span className="text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
														)}
													</div>
												</div>
												<div className="flex items-center flex-shrink-0">
													<button
														onClick={() => handleAddToCart(product)}
														className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-orange-50 text-[#F97316] text-xs font-semibold hover:bg-[#F97316] hover:text-white border border-orange-100 hover:border-[#F97316] transition-colors cursor-pointer"
													>
														<IoCartOutline />
														Adicionar
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{/* ── Tab: Avaliações ── */}
						{activeTab === 'avaliacoes' && (
							<div className="flex flex-col lg:flex-row gap-8">
								{/* Summary */}
								<div className="lg:w-64 flex-shrink-0">
									<div className="flex flex-col items-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
										<span className="text-5xl font-black text-gray-800 leading-none">{store.rating}</span>
										<div className="flex items-center gap-1 my-2">
											{[1, 2, 3, 4, 5].map(i => (
												<IoStarSharp key={i} className={`text-xl ${i <= Math.round(store.rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
											))}
										</div>
										<p className="text-sm text-gray-500">{store.reviews.toLocaleString('pt-AO')} avaliações</p>

										<div className="w-full mt-5 flex flex-col gap-2">
											{[5, 4, 3, 2, 1].map(star => (
												<RatingBar
													key={star}
													label={star}
													count={store.ratingDistribution[star]}
													total={totalRatings}
												/>
											))}
										</div>
									</div>
								</div>

								{/* Review list */}
								<div className="flex-1 flex flex-col gap-4">
									{store.opinions.map(op => (
										<div key={op.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
											<div className="flex items-start justify-between gap-3 mb-3">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
														{op.avatar}
													</div>
													<div>
														<div className="flex items-center gap-2">
															<span className="text-sm font-bold text-gray-800">{op.user}</span>
															{op.verified && (
																<span className="flex items-center gap-0.5 text-emerald-600 text-[10px] font-semibold">
																	<IoCheckmarkCircleOutline className="text-xs" /> Verificado
																</span>
															)}
														</div>
														<StarRow rating={op.rating} size="text-xs" />
													</div>
												</div>
												<span className="text-xs text-gray-400 flex-shrink-0">{op.date}</span>
											</div>
											<p className="text-sm font-semibold text-gray-800 mb-1">{op.title}</p>
											<p className="text-sm text-gray-600 leading-relaxed">{op.comment}</p>
											<div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
												<IoChatbubbleOutline />
												<span>{op.helpful} pessoas acharam útil</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* ── Tab: Sobre ── */}
						{activeTab === 'sobre' && (
							<div className="flex flex-col lg:flex-row gap-8">
								{/* Description */}
								<div className="flex-1">
									<h3 className="text-base font-bold text-gray-800 mb-3">Sobre a {store.name}</h3>
									<p className="text-sm text-gray-600 leading-relaxed mb-6">{store.description}</p>

									{/* Key stats */}
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
										{[
											{ icon: <FaAward className="text-[#F97316] text-xl" />, label: 'Desde', value: store.createdAt },
											{ icon: <FaBoxOpen className="text-[#F97316] text-xl" />, label: 'Produtos', value: store.products.toLocaleString('pt-AO') + '+' },
										].map((stat, i) => (
											<div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
												{stat.icon}
												<div>
													<p className="text-lg font-black text-gray-800 leading-none">{stat.value}</p>
													<p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Contact card */}
								<div className="lg:w-72 flex-shrink-0">
									<div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
										<h3 className="text-sm font-bold text-gray-800 mb-4">Informações de Contacto</h3>
										<div className="flex flex-col gap-3.5">
											{[
												{ icon: <IoLocationOutline className="text-[#F97316] text-base" />, label: 'Endereço', value: store.address },
												{ icon: <IoCallOutline className="text-[#F97316] text-base" />, label: 'Telefone', value: store.phone },
												{ icon: <IoMailOutline className="text-[#F97316] text-base" />, label: 'Email', value: store.email },
												{ icon: <IoTimeOutline className="text-[#F97316] text-base" />, label: 'Horário', value: store.hours },
											].map((item, i) => (
												<div key={i} className="flex items-start gap-2.5">
													<div className="mt-0.5 flex-shrink-0">{item.icon}</div>
													<div>
														<p className="text-xs text-gray-400">{item.label}</p>
														<p className="text-sm text-gray-700 font-medium leading-snug">{item.value}</p>
													</div>
												</div>
											))}
										</div>

										<div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-2">
											<IoShieldCheckmarkOutline className="text-emerald-500 text-lg" />
											<p className="text-xs text-gray-500">Loja verificada e aprovada pela Double E</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Sugestão de outras lojas removida conforme pedido. */}
			</div>
		</div>
	);
};

export default LojaDetails;
