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
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import { useStoreStatus } from '../hooks/queries/useDashboard';

const Header = () => {
	const cartCount = useCartStore((s) => s.getCartCount());
	const user = useAuthStore((s) => s.user);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const logout = useAuthStore((s) => s.logout);
	const navigate = useNavigate();
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const searchInputRef = useRef(null);
	const userMenuRef = useRef(null);
	const { data: storeStatus } = useStoreStatus({ enabled: isAuthenticated });
	const hasApprovedStore = storeStatus === 'approved';

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

	// Focus search input when overlay opens
	useEffect(() => {
		if (searchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [searchOpen]);

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
						{ text: 'AcessÃ³rios para Celulares' },
						{ text: 'PeÃ§as para Celular' }
					]
				},
				{
					title: 'InformÃ¡tica',
					items: [
						{ text: 'Componentes para PC' },
						{ text: 'Computadores' },
						{ text: 'Tablets e AcessÃ³rios' }
					]
				},
				{
					title: 'EletrÃ´nicos, Ãudio e VÃ­deo',
					items: [
						{ text: 'AcessÃ³rios para Ãudio e VÃ­deo' },
						{ text: 'Ãudio PortÃ¡til e AcessÃ³rios' }
					]
				}
			]
		},
		{
			name: 'Casa e MÃ³veis',
			columns: [
				{
					title: 'MÃ³veis',
					items: [
						{ text: 'SofÃ¡s' },
						{ text: 'Camas' },
						{ text: 'Mesas' }
					]
				},
				{
					title: 'DecoraÃ§Ã£o',
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
		{ name: 'Beleza e SaÃºde', columns: [] },
		{ name: 'Moda', columns: [] },
		{ name: 'Produtos', columns: [] },
	];

	return (
		<header className="shadow-sm">
			{/* â”€â”€ Row 1: Top bar â”€â”€ */}
			<div className="bg-accent">
				<div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center gap-2 md:gap-4">
					{/* Logo */}
					<Link to="/" className="flex-shrink-0 mr-1 md:mr-2">
						<img
							src="/images/logo/logoBranco.png"
							alt="Kusumba"
							title='Kusumba'
							className="h-7 md:h-8 w-auto brightness-0 invert"
						/>
					</Link>

					{/* Search Bar â€” hidden on mobile, full on md+ */}
					<div className="hidden md:flex flex-1 max-w-[700px] mx-auto">
						<div className="relative flex w-full">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]/60 pointer-events-none">
								<IoSearchOutline className="w-4 h-4" />
							</span>
							<input
								type="text"
								placeholder="Roupas, eletrÃ³nicos, gastÃ¡veis..."
								className="w-full bg-white pl-10 pr-4 py-2.5 rounded-l-full text-sm font-body text-[#1C1917] placeholder-[#78716C]/50 border-none focus:outline-none"
							/>
							<button className="bg-white border-l border-[#1C1917]/10 px-5 py-2.5 rounded-r-full text-sm font-display font-semibold text-accent hover:bg-sand transition-colors whitespace-nowrap focus:outline-none cursor-pointer">
								Buscar
							</button>
						</div>
					</div>

					{/* Right Icons */}
					<div className="flex items-center gap-0.5 md:gap-1 ml-auto flex-shrink-0">
						{/* Mobile search toggle */}
						<button
							className="md:hidden p-2 rounded-full text-white hover:bg-accent-dark transition-colors cursor-pointer"
							onClick={() => setSearchOpen(!searchOpen)}
							aria-label="Buscar"
						>
							<IoSearchOutline className="w-5 h-5" />
						</button>

						{/* Store dashboard â€” only when store is approved */}
						{isAuthenticated && hasApprovedStore && (
							<Link
								to="/loja/dashboard"
								className="relative p-2 rounded-full text-white hover:bg-accent-dark transition-colors"
								aria-label="Gerir Loja"
								title="Gerir Loja"
							>
								<IoStorefrontOutline className="w-5 h-5 md:w-6 md:h-6" />
							</Link>
						)}

						{/* Wishlist */}
						<Link
							to="/wishlist"
							className="relative p-2 rounded-full text-white hover:bg-accent-dark transition-colors"
							aria-label="Lista de desejos"
						>
							<IoHeartOutline className="w-5 h-5 md:w-6 md:h-6" />
						</Link>

						{/* Cart */}
						<Link
							to="/cart"
							className="relative p-2 rounded-full text-white hover:bg-accent-dark transition-colors"
							aria-label="Carrinho"
						>
							<IoCartOutline className="w-5 h-5 md:w-6 md:h-6" />
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
									className="relative p-2 rounded-full text-white hover:bg-accent-dark transition-colors cursor-pointer flex items-center gap-1.5"
									aria-label="Conta"
								>
									<IoPersonOutline className="w-5 h-5 md:w-6 md:h-6" />
								</button>
								{userMenuOpen && (
									<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#1C1917]/10 py-1 z-50">
										<div className="px-4 py-2 border-b border-[#1C1917]/10">
											<p className="text-sm font-display font-semibold text-[#1C1917]">{user?.name} {user?.surname}</p>
											<p className="text-xs font-body text-[#78716C] truncate">{user?.email}</p>
										</div>
										<Link
											to="/dashboard"
											onClick={() => setUserMenuOpen(false)}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-[#78716C] hover:bg-sand transition-colors"
										>
											<IoPersonOutline className="w-4 h-4" />
											Minha Conta
										</Link>
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
								className="relative p-2 rounded-full text-white hover:bg-accent-dark transition-colors"
								aria-label="Conta"
							>
								<IoPersonOutline className="w-5 h-5 md:w-6 md:h-6" />
							</Link>
						)}

						{/* Mobile hamburger */}
						<button
							className="lg:hidden p-2 rounded-full text-white hover:bg-accent-dark transition-colors cursor-pointer"
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
						>
							{menuOpen ? (
								<IoCloseOutline className="w-5 h-5 md:w-6 md:h-6" />
							) : (
								<IoMenuOutline className="w-5 h-5 md:w-6 md:h-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Search Overlay */}
				{searchOpen && (
					<div className="md:hidden px-4 pb-4 animate-fade-in-up">
						<div className="relative flex w-full">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]/60 pointer-events-none">
								<IoSearchOutline className="w-4 h-4" />
							</span>
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Roupas, eletrÃ³nicos, gastÃ¡veis..."
								className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full text-sm font-body text-[#1C1917] placeholder-[#78716C]/50 border-none focus:outline-none"
							/>
						</div>
					</div>
				)}
			</div>

			{/* â”€â”€ Row 2: Navigation â”€â”€ */}
			<div className="bg-sand border-b border-[#1C1917]/10 hidden lg:block">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="flex items-center gap-4 py-2 relative">
						{/* Categories Dropdown Trigger */}
						<div
							className="relative"
							onMouseLeave={() => { setCategoriesOpen(false); setActiveCategory(null); }}
						>
							<button
								onMouseEnter={() => setCategoriesOpen(true)}
								className="flex items-center gap-2 bg-white/80 border border-[#1C1917]/10 px-3 py-1.5 rounded text-sm font-display font-medium text-[#78716C] hover:text-accent transition-colors cursor-pointer"
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
										} bg-white shadow-xl rounded-lg flex z-50 overflow-hidden animate-fade-in-up`}
										style={{ animationDuration: '0.2s' }}
									>
										{/* Main list */}
										<div className={`${activeCategory && categories.find(c => c.name === activeCategory)?.columns?.length > 0
											? 'w-1/3'
											: 'w-full'
										} bg-[#1C1917] text-white`}>
											<ul>
												{categories.map((category) => (
													<li
														key={category.name}
														className={`cursor-pointer text-sm font-body ${activeCategory === category.name
															? 'bg-accent'
															: 'hover:bg-[#1C1917]/80'
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
												<h3 className="text-base font-display font-semibold text-[#1C1917] mb-3">
													{activeCategory}
												</h3>
												<div className="grid grid-cols-2 gap-x-6 gap-y-3">
													{categories
														.find((c) => c.name === activeCategory)
														?.columns.map((col) => (
															<div key={col.title}>
																<h4 className="font-semibold text-[#78716C] mb-1.5 text-xs uppercase tracking-wide font-display">
																	{col.title}
																</h4>
																<ul className="space-y-1">
																	{col.items.map((item, i) => {
																		const text = typeof item === 'string' ? item : item.text;
																		return (
																			<li key={i}>
																				<Link
																					to={`/categorias/${slugify(activeCategory)}/${slugify(text)}`}
																					className="text-xs font-body text-[#78716C] hover:text-accent transition-colors"
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
							<NavLink to="/lojas" className={({ isActive }) => `text-sm px-3 py-1.5 rounded font-body transition-colors ${isActive ? 'text-accent font-medium' : 'text-[#78716C] hover:text-accent'}`}>
								Lojas
							</NavLink>
							<NavLink to="/produtos" className={({ isActive }) => `text-sm px-3 py-1.5 rounded font-body transition-colors ${isActive ? 'text-accent font-medium' : 'text-[#78716C] hover:text-accent'}`}>
								Produtos
							</NavLink>
							<NavLink to="/promocoes" className={({ isActive }) => `text-sm px-3 py-1.5 rounded font-body transition-colors ${isActive ? 'text-accent font-medium' : 'text-[#78716C] hover:text-accent'}`}>
								PromoÃ§Ãµes
							</NavLink>
							<NavLink to="/cupoes" className={({ isActive }) => `text-sm px-3 py-1.5 rounded font-body transition-colors ${isActive ? 'text-accent font-medium' : 'text-[#78716C] hover:text-accent'}`}>
								CupÃµes
							</NavLink>
							<NavLink to="/sobre" className={({ isActive }) => `text-sm px-3 py-1.5 rounded font-body transition-colors ${isActive ? 'text-accent font-medium' : 'text-[#78716C] hover:text-accent'}`}>
								Sobre
							</NavLink>
							<NavLink to="/contato" className={({ isActive }) => `text-sm px-3 py-1.5 rounded font-body transition-colors ${isActive ? 'text-accent font-medium' : 'text-[#78716C] hover:text-accent'}`}>
								Contato
							</NavLink>
						</nav>

						{/* Right utility links */}
						<div className="flex items-center gap-1 ml-auto">
							<NavLink
								to="/vender"
								className="flex items-center gap-1.5 text-xs font-body text-[#78716C] hover:text-accent px-3 py-1.5 rounded border border-[#1C1917]/10 hover:border-accent/30 bg-white/80 transition-colors"
							>
								<IoTrendingUpOutline className="w-3.5 h-3.5" />
								<span>Venda Connosco</span>
							</NavLink>
							<NavLink
								to="/como-funciona"
								className="flex items-center gap-1.5 text-xs font-body text-[#78716C] hover:text-accent px-3 py-1.5 rounded border border-[#1C1917]/10 hover:border-accent/30 bg-white/80 transition-colors"
							>
								<IoBookOutline className="w-3.5 h-3.5" />
								<span>Como Funciona</span>
							</NavLink>
						</div>
					</div>
				</div>
			</div>

			{/* â”€â”€ Mobile Menu â”€â”€ */}
			<div
				className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
					menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
				} border-b border-[#1C1917]/10 bg-white shadow-lg`}
			>
				<nav className="flex flex-col">
					<NavLink to="/categorias" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<MdCategory className="w-5 h-5 text-[#78716C]/60" />
						<span>Categorias</span>
					</NavLink>
					<NavLink to="/lojas" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<IoShirtOutline className="w-5 h-5 text-[#78716C]/60" />
						<span>Lojas</span>
					</NavLink>
					<NavLink to="/produtos" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<IoStorefrontOutline className="w-5 h-5 text-[#78716C]/60" />
						<span>Produtos</span>
					</NavLink>
					<NavLink to="/promocoes" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<IoPricetagOutline className="w-5 h-5 text-[#78716C]/60" />
						<span>PromoÃ§Ãµes</span>
					</NavLink>
					<NavLink to="/cupoes" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<IoTicketOutline className="w-5 h-5 text-[#78716C]/60" />
						<span>CupÃµes</span>
					</NavLink>
					<NavLink to="/sobre" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<IoCashOutline className="w-5 h-5 text-[#78716C]/60" />
						<span>Sobre</span>
					</NavLink>
					<NavLink to="/contato" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
						<IoChatbubbleOutline className="w-5 h-5 text-[#78716C]/60" />
						<span>Contato</span>
					</NavLink>
					<div className="border-t border-[#1C1917]/10 mt-1">
						<NavLink to="/vender" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
							<IoTrendingUpOutline className="w-5 h-5 text-[#78716C]/60" />
							<span>Venda Connosco</span>
						</NavLink>
						<NavLink to="/como-funciona" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10">
							<IoBookOutline className="w-5 h-5 text-[#78716C]/60" />
							<span>Como Funciona</span>
						</NavLink>
					</div>
					{isAuthenticated ? (
						<>
							<div className="px-4 py-2 border-b border-[#1C1917]/10">
								<p className="text-sm font-display font-semibold text-[#1C1917]">{user?.name} {user?.surname}</p>
								<p className="text-xs font-body text-[#78716C]">{user?.email}</p>
							</div>
							<NavLink
								to="/dashboard"
								onClick={() => setMenuOpen(false)}
								className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10"
							>
								<IoPersonOutline className="w-5 h-5 text-[#78716C]/60" />
								<span>Minha Conta</span>
							</NavLink>
							{hasApprovedStore && (
								<NavLink
									to="/loja/dashboard"
									onClick={() => setMenuOpen(false)}
									className="flex items-center gap-3 px-4 py-3 text-sm font-body text-[#78716C] hover:bg-sand border-b border-[#1C1917]/10"
								>
									<IoStorefrontOutline className="w-5 h-5 text-[#78716C]/60" />
									<span>Gerir Loja</span>
								</NavLink>
							)}
							<button
								onClick={handleLogout}
								className="flex items-center gap-3 px-4 py-3 text-sm font-body text-red-500 hover:bg-red-50 w-full cursor-pointer"
							>
								<IoLogOutOutline className="w-5 h-5" />
								<span>Sair</span>
							</button>
						</>
					) : (
						<NavLink to="/auth" className="flex items-center gap-3 px-4 py-3 text-sm font-body text-accent hover:bg-sand font-medium">
							<IoPersonAddOutline className="w-5 h-5 text-accent" />
							<span>Conta</span>
						</NavLink>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;

