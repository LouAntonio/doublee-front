import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoLocationOutline, IoSearchOutline, IoCartOutline, IoMenuOutline, IoCloseOutline, IoChevronForward, IoPricetagOutline, IoStorefrontOutline, IoShirtOutline, IoPlayCircleOutline, IoCashOutline, IoChatbubbleOutline, IoPersonAddOutline, IoLogInOutline, IoBagOutline, IoTicketOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown, MdCategory } from 'react-icons/md';

const Header = () => {
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
				<div className="flex items-center justify-between gap-4">
					{/* Logo and Search */}
					<div className="flex items-center gap-4 lg:gap-12 flex-1">
						{/* Logo */}
					<Link to="/" className="flex items-center gap-3">
						<img
							src="/images/logo/dbe.png"
							alt="Mercado Livre"
							className="h-7 lg:h-9 w-auto"
						/>
					</Link>
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
					</div>

					{/* Cart Icon (Mobile) */}
					<button className="lg:hidden relative hover:bg-yellow-200 p-1.5 rounded transition-colors">
						<IoCartOutline className="w-6 h-6 text-gray-700" />
					</button>

					{/* Mobile Menu Button (moved to the right) */}
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

					{/* Promo Banner (Desktop) */}
					<div className="hidden lg:flex items-center gap-3">
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
					<div className="hidden lg:flex items-center justify-between py-2.5 relative">
						{/* Left - Location */}
						<button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 group">
							<IoLocationOutline className="w-4 h-4" />
							<span className="text-xs">Informe seu</span>
							<span className="font-medium text-xs">CEP</span>
						</button>

						{/* Center - Navigation Links */}
						<nav className="flex items-center gap-5">
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
											className={`absolute top-[calc(100%+0.5rem)] -left-20 ${
												activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0
													? 'w-[700px]'
													: 'w-[250px]'
											} bg-white shadow-lg rounded-md flex z-20 transition-all duration-200`}
										>
											{/* Main Categories */}
										<div className={`${
											activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0
												? 'w-1/3'
												: 'w-full'
										} bg-gray-800 text-white rounded-l-md ${
											!(activeCategory && categories.find(cat => cat.name === activeCategory)?.columns?.length > 0) && 'rounded-r-md'
										}`}>
												<ul>
													{categories.map((category) => (
														<li
															key={category.name}
														className={`px-4 py-3 cursor-pointer text-sm flex items-center justify-between ${activeCategory === category.name
																? 'bg-blue-500 text-white'
																: 'hover:bg-gray-700'
															}`}
														onMouseEnter={() => setActiveCategory(category.name)}
													>
														<span>{category.name}</span>
														{category.columns && category.columns.length > 0 && (
															<IoChevronForward className="w-4 h-4" />
														)}
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
																					<li
																						key={index}
																						className="text-xs text-gray-600 hover:text-blue-500 cursor-pointer mb-2"
																					>
																						<span>{itemText}</span>
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
							<button type="button" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Supermercado
							</button>
							<button type="button" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Moda
							</button>
							<button type="button" className="text-sm text-gray-700 hover:text-gray-900 font-light badge relative">
								Mercado Play
								<span className="absolute -top-1 -right-4 bg-green-500 text-white text-[9px] px-1 rounded font-bold">
									GRÁTIS
								</span>
							</button>
							<NavLink to="/sobre" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Sobre
							</NavLink>
							<NavLink to="/contato" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Contato
							</NavLink>
						</nav>

						{/* Right - User Actions */}
						<div className="flex items-center gap-4 text-sm">
						<NavLink to="/auth" className="text-gray-700 hover:text-gray-900 font-light">
							Crie a sua conta
						</NavLink>
						<NavLink to="/auth" className="text-gray-700 hover:text-gray-900 font-light">
							Entre
						</NavLink>
							<button type="button" className="text-gray-700 hover:text-gray-900 font-light">
								Compras
							</button>
							<button className="relative hover:bg-yellow-200 p-1.5 rounded transition-colors">
								<IoCartOutline className="w-5 h-5 text-gray-700" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="lg:hidden border-t border-yellow-200 bg-white shadow-lg">
					<nav className="flex flex-col">
						<button className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoLocationOutline className="w-4 h-4" />
							<span className="text-xs">Informe seu CEP</span>
						</button>
					<NavLink 
						to="/categorias"
						className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
					>
						<div className="flex items-center gap-2">
							<MdCategory className="w-5 h-5 text-gray-500" />
							<span>Categorias</span>
						</div>
						<IoChevronForward className="w-4 h-4" />
					</NavLink>

					<NavLink to="/ofertas" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
						<IoPricetagOutline className="w-5 h-5 text-gray-500" />
						<span>Ofertas</span>
					</NavLink>
					<NavLink to="/cupoes" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
						<IoTicketOutline className="w-5 h-5 text-gray-500" />
						<span>Cupões</span>
					</NavLink>
						<button type="button" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoStorefrontOutline className="w-5 h-5 text-gray-500" />
							<span>Supermercado</span>
						</button>
						<button type="button" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoShirtOutline className="w-5 h-5 text-gray-500" />
							<span>Moda</span>
						</button>
						<button type="button" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<IoPlayCircleOutline className="w-5 h-5 text-gray-500" />
							<div className="flex items-center gap-2">
								<span>Mercado Play</span>
								<span className="bg-green-500 text-white text-[9px] px-1 rounded font-bold">GRÁTIS</span>
							</div>
						</button>
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
						<span>Crie a sua conta</span>
					</NavLink>
					<NavLink to="/auth" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
						<IoLogInOutline className="w-5 h-5 text-gray-500" />
						<span>Entre</span>
					</NavLink>
						<button type="button" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
							<IoBagOutline className="w-5 h-5 text-gray-500" />
							<span>Compras</span>
						</button>
					</nav>
				</div>
			)}
		</header>
	);
};

export default Header;
