import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
	IoSearchOutline,
	IoCartOutline,
	IoMenuOutline,
	IoCloseOutline,
	IoChevronForward,
	IoPricetagOutline,
	IoStorefrontOutline,
	IoShirtOutline,
	IoCashOutline,
	IoChatbubbleOutline,
	IoPersonAddOutline,
	IoTicketOutline,
	IoHeartOutline,
	IoPersonOutline,
	IoTrendingUpOutline,
	IoBookOutline,
	IoLogOutOutline,
} from 'react-icons/io5';
import { MdKeyboardArrowDown, MdCategory } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../services/api';

const Header = () => {
	const { getCartCount } = useCart();
	const cartCount = getCartCount();
	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const userMenuRef = useRef(null);
	const [hasApprovedStore, setHasApprovedStore] = useState(false);

	useEffect(() => {
		let cancelled = false;
		const fetchStoreStatus = async () => {
			if (!isAuthenticated) {
				if (!cancelled) setHasApprovedStore(false);
				return;
			}
			try {
				const data = await apiRequest('/stores/status');
				if (!cancelled) setHasApprovedStore(data?.success && data?.data?.status === 'approved');
			} catch {
				if (!cancelled) setHasApprovedStore(false);
			}
		};
		fetchStoreStatus();
		return () => { cancelled = true; };
	}, [isAuthenticated]);

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
				setUserMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => {
		logout();
		setUserMenuOpen(false);
		navigate('/auth');
	};

	const slugify = (s) =>
		String(s)
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');

	const [menuOpen, setMenuOpen] = useState(false);
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState(null);

	const categories = [
		{
			name: 'Tecnologia',
			columns: [
				{
					title: 'Celulares e Telefones',
					items: [
						{ text: 'Acessórios para Celulares' },
						{ text: 'Peças para Celular' }
					]
				},
				{
					title: 'Informática',
					items: [
						{ text: 'Componentes para PC' },
						{ text: 'Computadores' },
						{ text: 'Tablets e Acessórios' }
					]
				},
				{
					title: 'Eletrônicos, Áudio e Vídeo',
					items: [
						{ text: 'Acessórios para Áudio e Vídeo' },
						{ text: 'Áudio Portátil e Acessórios' }
					]
				}
			]
		},
		{
			name: 'Casa e Móveis',
			columns: [
				{
					title: 'Móveis',
					items: [
						{ text: 'Sofás' },
						{ text: 'Camas' },
						{ text: 'Mesas' }
					]
				},
				{
					title: 'Decoração',
					items: [
						{ text: 'Quadros' },
						{ text: 'Tapetes' }
					]
				}
			]
		},
		{
			name: 'Esportes e Fitness',
			columns: [
				{
					title: 'Fitness',
					items: [
						{ text: 'Esteiras' },
						{ text: 'Halteres' }
					]
				}
			]
		},
		{ name: 'Beleza e Saúde', columns: [] },
		{ name: 'Moda', columns: [] },
		{ name: 'Produtos', columns: [] },
	];

	return (
		<header className="shadow-sm">
			{/* ── Row 1: Orange bar ── */}
			<div className="bg-[#F97316]">
				<div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center gap-4">
					{/* Logo */}
					<Link to="/" className="flex-shrink-0 mr-2">
						<img
							src="/images/logo/dbe.png"
							alt="Double E"
							title='Double E'
							className="h-8 w-auto brightness-0 invert"
						/>
					</Link>

					{/* Search Bar */}
					<div className="flex flex-1 max-w-[700px] mx-auto">
						<div className="relative flex w-full">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
								<IoSearchOutline className="w-4 h-4" />
							</span>
							<input
								type="text"
								placeholder="Roupas, eletrónicos, gastáveis..."
								className="w-full bg-white pl-10 pr-4 py-2.5 rounded-l-full text-sm text-gray-700 placeholder-gray-400 border-none focus:outline-none"
							/>
							<button className="bg-white border-l border-gray-200 px-5 py-2.5 rounded-r-full text-sm font-semibold text-[#F97316] hover:bg-orange-50 transition-colors whitespace-nowrap focus:outline-none cursor-pointer">
								Buscar
							</button>
						</div>
					</div>

					{/* Right Icons */}
					<div className="flex items-center gap-1 ml-auto flex-shrink-0">
						{/* Store dashboard — only when store is approved */}
						{isAuthenticated && hasApprovedStore && (
							<Link
								to="/dashboard?tab=store"
								className="relative p-2 rounded-full text-white hover:bg-orange-500 transition-colors"
								aria-label="Minha Loja"
								title="Minha Loja"
							>
								<IoStorefrontOutline className="w-6 h-6" />
							</Link>
						)}

						{/* Wishlist */}
						<Link
							to="/wishlist"
							className="relative p-2 rounded-full text-white hover:bg-orange-500 transition-colors"
							aria-label="Lista de desejos"
						>
							<IoHeartOutline className="w-6 h-6" />
						</Link>

						{/* Cart */}
						<Link
							to="/cart"
							className="relative p-2 rounded-full text-white hover:bg-orange-500 transition-colors"
							aria-label="Carrinho"
						>
							<IoCartOutline className="w-6 h-6" />
							{cartCount > 0 && (
								<span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
									{cartCount > 99 ? '99+' : cartCount}
								</span>
							)}
						</Link>

						{/* User */}
						{isAuthenticated ? (
							<div className="relative" ref={userMenuRef}>
								<button
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className="relative p-2 rounded-full text-white hover:bg-orange-500 transition-colors cursor-pointer flex items-center gap-1.5"
									aria-label="Conta"
								>
									<IoPersonOutline className="w-6 h-6" />
									<span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
								</button>
								{userMenuOpen && (
									<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
										<div className="px-4 py-2 border-b border-gray-100">
											<p className="text-sm font-semibold text-gray-800">{user?.name} {user?.surname}</p>
											<p className="text-xs text-gray-500 truncate">{user?.email}</p>
										</div>
										<Link
											to="/dashboard"
											onClick={() => setUserMenuOpen(false)}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
										>
											<IoPersonOutline className="w-4 h-4" />
											Minha Conta
										</Link>
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
										>
											<IoLogOutOutline className="w-4 h-4" />
											Sair
										</button>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/auth"
								className="relative p-2 rounded-full text-white hover:bg-orange-500 transition-colors"
								aria-label="Conta"
							>
								<IoPersonOutline className="w-6 h-6" />
							</Link>
						)}

						{/* Mobile hamburger */}
						<button
							className="lg:hidden p-2 rounded-full text-white hover:bg-orange-500 transition-colors cursor-pointer"
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
						>
							{menuOpen ? (
								<IoCloseOutline className="w-6 h-6" />
							) : (
								<IoMenuOutline className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* ── Row 2: Light bar with categories + nav ── */}
			<div className="bg-[#FFF7ED] border-b border-orange-100 hidden lg:block">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="flex items-center gap-4 py-2 relative">
						{/* Categories Dropdown Trigger */}
						<div
							className="relative"
							onMouseLeave={() => { setCategoriesOpen(false); setActiveCategory(null); }}
						>
							<button
								onMouseEnter={() => setCategoriesOpen(true)}
								className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded text-sm font-medium text-gray-700 transition-colors cursor-pointer"
							>
								<IoMenuOutline className="w-4 h-4" />
								<span>Categorias</span>
								<MdKeyboardArrowDown className="w-4 h-4" />
							</button>

							{/* Dropdown */}
							{categoriesOpen && (
								<>
									<div className="absolute top-full left-0 w-full h-2 bg-transparent" />
									<div
										className={`absolute top-[calc(100%+0.4rem)] left-0 ${activeCategory && categories.find(c => c.name === activeCategory)?.columns?.length > 0
											? 'w-[680px]'
											: 'w-[240px]'
										} bg-white shadow-xl rounded-lg flex z-50 overflow-hidden transition-all duration-150`}
									>
										{/* Main list */}
										<div className={`${activeCategory && categories.find(c => c.name === activeCategory)?.columns?.length > 0
											? 'w-1/3'
											: 'w-full'
										} bg-gray-800 text-white`}>
											<ul>
												{categories.map((category) => (
													<li
														key={category.name}
														className={`cursor-pointer text-sm ${activeCategory === category.name
															? 'bg-[#F97316]'
															: 'hover:bg-gray-700'
														}`}
														onMouseEnter={() => setActiveCategory(category.name)}
													>
														<Link
															to={`/categorias/${slugify(category.name)}`}
															className="flex items-center justify-between px-4 py-3 w-full"
														>
															<span>{category.name}</span>
															{category.columns?.length > 0 && (
																<IoChevronForward className="w-3.5 h-3.5 opacity-60" />
															)}
														</Link>
													</li>
												))}
											</ul>
										</div>

										{/* Sub-categories */}
										{activeCategory && categories.find(c => c.name === activeCategory)?.columns?.length > 0 && (
											<div className="w-2/3 p-5">
												<h3 className="text-base font-semibold text-gray-800 mb-3">
													{activeCategory}
												</h3>
												<div className="grid grid-cols-2 gap-x-6 gap-y-3">
													{categories
														.find((c) => c.name === activeCategory)
														?.columns.map((col) => (
															<div key={col.title}>
																<h4 className="font-semibold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">
																	{col.title}
																</h4>
																<ul className="space-y-1">
																	{col.items.map((item, i) => {
																		const text = typeof item === 'string' ? item : item.text;
																		return (
																			<li key={i}>
																				<Link
																					to={`/categorias/${slugify(activeCategory)}/${slugify(text)}`}
																					className="text-xs text-gray-500 hover:text-[#F97316] transition-colors"
																				>
																					{text}
																				</Link>
																			</li>
																		);
																	})}
																</ul>
															</div>
														))}
												</div>
											</div>
										)}
									</div>
								</>
							)}
						</div>

						{/* Nav links */}
						<nav className="flex items-center gap-1 flex-1">
							<NavLink to="/lojas" className={({ isActive }) => `text-sm px-3 py-1.5 rounded transition-colors ${isActive ? 'text-[#F97316] font-medium' : 'text-gray-600 hover:text-[#F97316]'}`}>
								Lojas
							</NavLink>
							<NavLink to="/produtos" className={({ isActive }) => `text-sm px-3 py-1.5 rounded transition-colors ${isActive ? 'text-[#F97316] font-medium' : 'text-gray-600 hover:text-[#F97316]'}`}>
								Produtos
							</NavLink>
							<NavLink to="/promocoes" className={({ isActive }) => `text-sm px-3 py-1.5 rounded transition-colors ${isActive ? 'text-[#F97316] font-medium' : 'text-gray-600 hover:text-[#F97316]'}`}>
								Promoções
							</NavLink>
							<NavLink to="/cupoes" className={({ isActive }) => `text-sm px-3 py-1.5 rounded transition-colors ${isActive ? 'text-[#F97316] font-medium' : 'text-gray-600 hover:text-[#F97316]'}`}>
								Cupões
							</NavLink>
							<NavLink to="/sobre" className={({ isActive }) => `text-sm px-3 py-1.5 rounded transition-colors ${isActive ? 'text-[#F97316] font-medium' : 'text-gray-600 hover:text-[#F97316]'}`}>
								Sobre
							</NavLink>
							<NavLink to="/contato" className={({ isActive }) => `text-sm px-3 py-1.5 rounded transition-colors ${isActive ? 'text-[#F97316] font-medium' : 'text-gray-600 hover:text-[#F97316]'}`}>
								Contato
							</NavLink>
						</nav>

						{/* Right utility links */}
						<div className="flex items-center gap-1 ml-auto">
							<NavLink
								to="/vender"
								className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#F97316] px-3 py-1.5 rounded border border-gray-200 hover:border-orange-300 bg-white transition-colors"
							>
								<IoTrendingUpOutline className="w-3.5 h-3.5" />
								<span>Venda Connosco</span>
							</NavLink>
							<NavLink
								to="/como-funciona"
								className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#F97316] px-3 py-1.5 rounded border border-gray-200 hover:border-orange-300 bg-white transition-colors"
							>
								<IoBookOutline className="w-3.5 h-3.5" />
								<span>Como Funciona</span>
							</NavLink>
						</div>
					</div>
				</div>
			</div>

			{/* ── Mobile Menu ── */}
			{menuOpen && (
				<div className="lg:hidden border-t border-orange-100 bg-white shadow-lg">
					<nav className="flex flex-col">
						<NavLink to="/categorias" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<MdCategory className="w-5 h-5 text-gray-400" />
							<span>Categorias</span>
						</NavLink>
						<NavLink to="/lojas" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<IoShirtOutline className="w-5 h-5 text-gray-400" />
							<span>Lojas</span>
						</NavLink>
						<NavLink to="/produtos" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<IoStorefrontOutline className="w-5 h-5 text-gray-400" />
							<span>Produtos</span>
						</NavLink>
						<NavLink to="/promocoes" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<IoPricetagOutline className="w-5 h-5 text-gray-400" />
							<span>Promoções</span>
						</NavLink>
						<NavLink to="/cupoes" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<IoTicketOutline className="w-5 h-5 text-gray-400" />
							<span>Cupões</span>
						</NavLink>
						<NavLink to="/sobre" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<IoCashOutline className="w-5 h-5 text-gray-400" />
							<span>Sobre</span>
						</NavLink>
						<NavLink to="/contato" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 border-b border-gray-100">
							<IoChatbubbleOutline className="w-5 h-5 text-gray-400" />
							<span>Contato</span>
						</NavLink>
						<div className="border-t border-gray-100 mt-1">
							<NavLink to="/vender" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 border-b border-gray-100">
								<IoTrendingUpOutline className="w-5 h-5 text-gray-400" />
								<span>Venda Connosco</span>
							</NavLink>
							<NavLink to="/como-funciona" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 border-b border-gray-100">
								<IoBookOutline className="w-5 h-5 text-gray-400" />
								<span>Como Funciona</span>
							</NavLink>
						</div>
						{isAuthenticated ? (
							<>
								<div className="px-4 py-2 border-b border-gray-100">
									<p className="text-sm font-semibold text-gray-800">{user?.name} {user?.surname}</p>
									<p className="text-xs text-gray-500">{user?.email}</p>
								</div>
								<NavLink
									to="/dashboard"
									onClick={() => setMenuOpen(false)}
									className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 border-b border-gray-100"
								>
									<IoPersonOutline className="w-5 h-5 text-gray-400" />
									<span>Minha Conta</span>
								</NavLink>
								<button
									onClick={handleLogout}
									className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full cursor-pointer"
								>
									<IoLogOutOutline className="w-5 h-5" />
									<span>Sair</span>
								</button>
							</>
						) : (
							<NavLink to="/auth" className="flex items-center gap-3 px-4 py-3 text-sm text-[#F97316] hover:bg-orange-50 font-medium">
								<IoPersonAddOutline className="w-5 h-5 text-[#F97316]" />
								<span>Conta</span>
							</NavLink>
						)}
					</nav>
				</div>
			)}
		</header>
	);
};

export default Header;
