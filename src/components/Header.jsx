import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoLocationOutline, IoSearchOutline, IoCartOutline, IoMenuOutline, IoCloseOutline, IoChevronForward, IoPricetagOutline, IoStorefrontOutline, IoShirtOutline, IoPlayCircleOutline, IoCashOutline, IoChatbubbleOutline, IoPersonAddOutline, IoLogInOutline, IoBagOutline, IoTicketOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdCategory } from 'react-icons/md';
import { useCart } from '../context/CartContext';

const Header = () => {
	const { getCartCount } = useCart();
	const cartCount = getCartCount();

	const slugify = (s) =>
		String(s)
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');
	const [menuOpen, setMenuOpen] = useState(false);
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState(null);
	const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
	const [mobileActiveCategory, setMobileActiveCategory] = useState(null);

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
		{ name: 'Beleza e Saúde', columns: [] }
	];

	return (
		<header className="bg-[#fff159] shadow-sm">
			{/* Top Section */}
			<div className="max-w-[1200px] mx-auto px-4 py-3">
				<div className="flex items-center gap-4">
					{/* Logo Section - Fixed Width for Desktop Alignment */}
					<div className="flex items-center lg:w-60 flex-shrink-0">
						<Link to="/" className="flex items-center gap-3">
							<img
								src="/images/logo/dbe.png"
								alt="Mercado Livre"
								className="h-7 lg:h-9 w-auto"
							/>
						</Link>
					</div>

					{/* Search Bar */}
					<div className="relative flex-1 max-w-[600px]">
						<input
							type="text"
							placeholder="Buscar produtos,marcas e muito mais..."
							className="w-full bg-white px-3 lg:px-4 py-2 lg:py-2.5 pr-10 lg:pr-12 rounded shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs lg:text-sm text-gray-600 placeholder-gray-400"
						/>
						<button className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
							<IoSearchOutline className="w-4 h-4 lg:w-5 lg:h-5" />
						</button>
					</div>

					{/* Cart Icon (Mobile) */}
					<Link to="/cart" className="lg:hidden relative hover:bg-yellow-200 p-1.5 rounded transition-colors">
						<IoCartOutline className="w-6 h-6 text-gray-700" />
						{cartCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
								{cartCount > 99 ? '99+' : cartCount}
							</span>
						)}
					</Link>

					{/* Mobile Menu Button */}
					<button
						className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-yellow-200 p-1.5 rounded transition-colors flex items-center justify-center"
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
					>
						{menuOpen ? (
							<IoCloseOutline className="w-6 h-6" />
						) : (
							<IoMenuOutline className="w-6 h-6" />
						)}
					</button>

					{/* Promo Banner (Desktop) - Pushed to right */}
					<div className="hidden lg:flex items-center gap-3 ml-auto">
						<div className="flex items-center gap-2 bg-[#2968C8] text-white px-3 py-1.5 rounded">
							<span className="text-xs font-semibold whitespace-nowrap">🎁 VALE-TROCA</span>
						</div>
						<button className="bg-white text-[#2968C8] px-4 py-2 rounded font-medium text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
							ADICIONE AOS SEUS PRESENTES
						</button>
					</div>
				</div>
			</div>

			{/* Bottom Section - Navigation */}
			<div className="border-t border-yellow-200">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="hidden lg:flex items-center gap-4 py-2.5 relative">
						{/* Left - Location - Fixed Width */}
						<div className="w-60 flex-shrink-0">
							<button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 group">
								<IoLocationOutline className="w-4 h-4" />
								<span className="text-xs">Informe seu</span>
								<span className="font-medium text-xs">CEP</span>
							</button>
						</div>

						{/* Center - Navigation Links - Aligns with Search */}
						<nav className="flex items-center gap-5 flex-1">
							<div
								className="relative"
								onMouseLeave={() => setCategoriesOpen(false)}
							>
								<button
									onMouseEnter={() => setCategoriesOpen(true)}
									className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-light py-2"
								>
									<span>Categorias</span>
									<MdKeyboardArrowDown className="w-4 h-4" />
								</button>
								{/* Categories Dropdown */}
								{categoriesOpen && (
									<>
										{/* Invisible bridge to prevent menu from closing */}
										<div className="absolute top-full left-0 w-full h-3 bg-transparent" />
										<div
											className={`absolute top-[calc(100%+0.5rem)] -left-20 ${activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0
												? 'w-[700px]'
												: 'w-[250px]'
												} bg-white shadow-lg rounded-md flex z-20 transition-all duration-200`}
										>
											{/* Main Categories */}
											<div className={`${activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0
												? 'w-1/3'
												: 'w-full'
												} bg-gray-800 text-white rounded-l-md ${!(activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0) && 'rounded-r-md'
												}`}>
												<ul>
													{categories.map((category) => (
														<li
															key={category.name}
															className={`px-0 py-0 cursor-pointer text-sm ${activeCategory === category.name
																? 'bg-blue-500 text-white'
																: 'hover:bg-gray-700'
																}`}
															onMouseEnter={() => setActiveCategory(category.name)}
														>
															<Link to={`/categorias/${slugify(category.name)}`} className="flex items-center justify-between px-4 py-3 text-sm w-full">
																<span>{category.name}</span>
																{category.columns && category.columns.length > 0 && (
																	<IoChevronForward className="w-4 h-4" />
																)}
															</Link>
														</li>
													))}
												</ul>
											</div>
											{/* Sub Categories */}
											{activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0 && (
												<div className="w-2/3 p-6">
													<h3 className="text-lg font-semibold text-gray-800 mb-4">
														{activeCategory}
													</h3>
													<div className="grid grid-cols-2 gap-x-8 gap-y-4">
														{categories
															.find((cat) => cat.name === activeCategory)
															?.columns.map((col) => (
																<div key={col.title}>
																	<h4 className="font-semibold text-gray-700 mb-2 text-sm">
																		{col.title}
																	</h4>
																	<ul>
																		{col.items.map((item, index) => {
																			const itemText = typeof item === 'string' ? item : item.text;
																			return (
																				<li key={index} className="mb-2">
																					<Link to={`/categorias/${slugify(activeCategory)}/${slugify(itemText)}`} className="text-xs text-gray-600 hover:text-blue-500">
																						{itemText}
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
							<NavLink to="/ofertas" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Ofertas
							</NavLink>
							<NavLink to="/cupoes" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Cupões
							</NavLink>
							<NavLink to="/supermercado" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Supermercado
							</NavLink>
							<NavLink to="/moda" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Moda
							</NavLink>
							<NavLink to="/sobre" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Sobre
							</NavLink>
							<NavLink to="/contato" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Contato
							</NavLink>
						</nav>

						{/* Right - User Actions - Pushed to right */}
						<div className="flex items-center gap-4 text-sm ml-auto">
							<NavLink to="/auth" className="text-gray-700 hover:text-gray-900 font-light">
								Conta
							</NavLink>
							<Link to="/cart" className="relative hover:bg-yellow-200 p-1.5 rounded transition-colors">
								<IoCartOutline className="w-5 h-5 text-gray-700" />
								{cartCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
										{cartCount > 99 ? '99+' : cartCount}
									</span>
								)}
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="lg:hidden border-t border-yellow-200 bg-white shadow-lg">
					<nav className="flex flex-col">
						<NavLink
							to="/categorias"
							className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
						>
							<div className="flex items-center gap-2">
								<MdCategory className="w-5 h-5 text-gray-500" />
								<span>Categorias</span>
							</div>
						</NavLink>

						<NavLink to="/ofertas" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoPricetagOutline className="w-5 h-5 text-gray-500" />
							<span>Ofertas</span>
						</NavLink>
						<NavLink to="/cupoes" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoTicketOutline className="w-5 h-5 text-gray-500" />
							<span>Cupões</span>
						</NavLink>
						<NavLink to="/supermercado" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoStorefrontOutline className="w-5 h-5 text-gray-500" />
							<span>Supermercado</span>
						</NavLink>
						<NavLink to="/moda" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoShirtOutline className="w-5 h-5 text-gray-500" />
							<span>Moda</span>
						</NavLink>
						<NavLink to="/sobre" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoCashOutline className="w-5 h-5 text-gray-500" />
							<span>Sobre</span>
						</NavLink>
						<NavLink to="/contato" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoChatbubbleOutline className="w-5 h-5 text-gray-500" />
							<span>Contato</span>
						</NavLink>
						<NavLink to="/auth" className="flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 border-b border-gray-100 font-medium">
							<IoPersonAddOutline className="w-5 h-5 text-blue-600" />
							<span>Conta</span>
						</NavLink>
					</nav>
				</div>
			)}
		</header>
	);
};

export default Header;
