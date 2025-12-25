import React, { useState } from 'react';
import { IoLocationOutline, IoSearchOutline, IoCartOutline, IoMenuOutline, IoCloseOutline, IoChevronForward } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState(null);

	const categories = [
		{
			name: 'Tecnologia',
			columns: [
				{
					title: 'Celulares e Telefones',
					items: ['Acessórios para Celulares', 'Peças para Celular']
				},
				{
					title: 'Informática',
					items: ['Componentes para PC', 'Computadores', 'Tablets e Acessórios']
				},
				{
					title: 'Eletrônicos, Áudio e Vídeo',
					items: ['Acessórios para Áudio e Vídeo', 'Áudio Portátil e Acessórios']
				}
			]
		},
		{
			name: 'Casa e Móveis',
			columns: [
				{ title: 'Móveis', items: ['Sofás', 'Camas', 'Mesas'] },
				{ title: 'Decoração', items: ['Quadros', 'Tapetes'] }
			]
		},
		{ name: 'Esportes e Fitness', columns: [{ title: 'Fitness', items: ['Esteiras', 'Halteres'] }] },
		{ name: 'Beleza e Saúde', columns: []}
	];

	return (
		<header className="bg-[#fff159] shadow-sm">
			{/* Top Section */}
			<div className="max-w-[1200px] mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-4">
					{/* Logo and Search */}
					<div className="flex items-center gap-4 lg:gap-12 flex-1">
						{/* Logo */}
						<div className="flex items-center gap-3">
							<img 
								src="/images/logo/dbe.png" 
								alt="Mercado Livre" 
								className="h-7 lg:h-9 w-auto" 
							/>
						</div>

						{/* Search Bar */}
						<div className="relative flex-1 max-w-[600px]">
							<input
								type="text"
								placeholder="Buscar produtos..."
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
						className="lg:hidden text-gray-700 hover:text-gray-900 ml-2"
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
					>
						<div className={`transform transition-transform duration-300 ${menuOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
							<IoMenuOutline className={`w-7 h-7 ${menuOpen ? 'opacity-0 absolute' : 'opacity-100'}`} />
							<IoCloseOutline className={`w-7 h-7 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} />
						</div>
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
									Categorias
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
													className={`px-4 py-3 cursor-pointer text-sm flex items-center justify-between ${
														activeCategory === category.name
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
																	{col.items.map((item) => (
																		<li
																			key={item}
																			className="text-xs text-gray-600 hover:text-blue-500 cursor-pointer mb-1"
																		>
																			{item}
																		</li>
																	))}
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
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Ofertas
							</a>
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Cupons
							</a>
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Supermercado
							</a>
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Moda
							</a>
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light badge relative">
								Mercado Play
								<span className="absolute -top-1 -right-4 bg-green-500 text-white text-[9px] px-1 rounded font-bold">
									GRÁTIS
								</span>
							</a>
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Vender
							</a>
							<a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-light">
								Contato
							</a>
						</nav>

						{/* Right - User Actions */}
						<div className="flex items-center gap-4 text-sm">
							<a href="#" className="text-gray-700 hover:text-gray-900 font-light">
								Crie a sua conta
							</a>
							<a href="#" className="text-gray-700 hover:text-gray-900 font-light">
								Entre
							</a>
							<a href="#" className="text-gray-700 hover:text-gray-900 font-light">
								Compras
							</a>
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
						<button className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							<span>Categorias</span>
							<MdKeyboardArrowDown className="w-4 h-4" />
						</button>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Ofertas
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Cupons
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Supermercado
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Moda
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2">
							<span>Mercado Play</span>
							<span className="bg-green-500 text-white text-[9px] px-1 rounded font-bold">GRÁTIS</span>
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Vender
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Contato
						</a>
						<a href="#" className="px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 border-b border-gray-100 font-medium">
							Crie a sua conta
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">
							Entre
						</a>
						<a href="#" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
							Compras
						</a>
					</nav>
				</div>
			)}
		</header>
	);
};

export default Header;
