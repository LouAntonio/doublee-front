import React from 'react';
import { IoLocationOutline, IoSearchOutline, IoCartOutline } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Header = () => {
	return (
		<header className="bg-[#fff159] shadow-sm">
			{/* Top Section */}
			<div className="max-w-[1200px] mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-6">
					{/* Logo and Search */}
					<div className="flex items-center gap-12 flex-1">
						{/* Logo */}
						<div className="flex items-center gap-3">
							<img 
								src="/images/logo/dbe.png" 
								alt="Mercado Livre" 
								className="h-9 w-auto" 
							/>
						</div>

						{/* Search Bar */}
						<div className="relative flex-1 max-w-[600px]">
							<input
								type="text"
								placeholder="Buscar produtos, marcas e muito mais..."
								className="w-full bg-white px-4 py-2.5 pr-12 rounded shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm text-gray-600 placeholder-gray-400"
							/>
							<button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
								<IoSearchOutline className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* Promo Banner */}
					<div className="flex items-center gap-3">
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
					<div className="flex items-center justify-between py-2.5">
						{/* Left - Location */}
						<button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 group">
							<IoLocationOutline className="w-4 h-4" />
							<span className="text-xs">Informe seu</span>
							<span className="font-medium text-xs">CEP</span>
						</button>

						{/* Center - Navigation Links */}
						<nav className="flex items-center gap-5">
							<button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-light">
								Categorias
								<MdKeyboardArrowDown className="w-4 h-4" />
							</button>
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
		</header>
	);
};

export default Header;
