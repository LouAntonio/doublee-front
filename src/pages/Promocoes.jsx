import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const Promocoes = () => {
	useDocumentTitle('Produtos em Promoção - Double E');

	// Countdown timer logic
	const [timeLeft, setTimeLeft] = React.useState({ hours: 12, minutes: 45, seconds: 30 });

	React.useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
				if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
				if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
				return prev;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const pad = (n) => n.toString().padStart(2, '0');

	const offers = [
		{
			id: 1,
			title: 'Smartphone Samsung Galaxy S23 Ultra 5G 256GB Cream',
			price: 899000,
			oldPrice: 1199000,
			discount: 25,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Galaxy+S23',
			coupon: 'SAMSUNG25'
		},
		{
			id: 2,
			title: 'Smart TV 55" 4K UHD LG LED Wi-Fi Bluetooth HDR10',
			price: 459000,
			oldPrice: 699000,
			discount: 34,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=TV+LG+55',
			coupon: 'TVLG10'
		},
		{
			id: 3,
			title: 'Notebook Dell Inspiron 15 3000 Intel Core i5 8GB 256GB SSD',
			price: 529000,
			oldPrice: 729000,
			discount: 27,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Dell+Inspiron'
		},
		{
			id: 4,
			title: 'Geladeira Brastemp Frost Free Duplex 375L Branca',
			price: 689000,
			oldPrice: 899000,
			discount: 23,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Geladeira',
			coupon: 'COZINHA20'
		},
		{
			id: 5,
			title: 'Fritadeira Sem Óleo Air Fryer Mondial 4L',
			price: 89000,
			oldPrice: 149000,
			discount: 40,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Air+Fryer'
		},
		{
			id: 6,
			title: 'Console Sony PlayStation 5 825GB',
			price: 3899000,
			oldPrice: 4499000,
			discount: 13,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=PS5',
			coupon: 'GAME100'
		},
		{
			id: 7,
			title: 'Máquina de Lavar Electrolux 13kg Branca',
			price: 2199000,
			oldPrice: 2899000,
			discount: 24,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Lavadora'
		},
		{
			id: 8,
			title: 'Iphone 14 128GB Estelar',
			price: 5699000,
			oldPrice: 6499000,
			discount: 12,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=iPhone+14'
		},
		{
			id: 9,
			title: 'Micro-ondas Electrolux 34L Branco',
			price: 159000,
			oldPrice: 219000,
			discount: 27,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Microondas'
		},
		{
			id: 10,
			title: 'Cafeteira Expresso Nespresso Essenza Mini',
			price: 89000,
			oldPrice: 129000,
			discount: 31,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Nespresso',
			coupon: 'CAFE15'
		},
		{
			id: 11,
			title: 'Soundbar JBL Cinema 2.1 Canais 110W',
			price: 129900,
			oldPrice: 189900,
			discount: 31,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Soundbar'
		},
		{
			id: 12,
			title: 'Robô Aspirador de Pó Multilaser',
			price: 49900,
			oldPrice: 79900,
			discount: 37,
			image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Robo+Aspirador'
		}
	];

	// Filter and Pagination state
	const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });
	const [selectedCategories, setSelectedCategories] = React.useState([]);
	const [rating, setRating] = React.useState(null);
	const [sortOption, setSortOption] = React.useState('relevance');
	const [currentPage, setCurrentPage] = React.useState(1);
	const itemsPerPage = 12;

	// Apply sorting
	const getSortedOffers = () => {
		let sorted = [...offers];
		if (sortOption === 'lowest') {
			sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
		} else if (sortOption === 'highest') {
			sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
		} else if (sortOption === 'name') {
			sorted.sort((a, b) => String(a.title).localeCompare(String(b.title)));
		}
		// Filter by selected categories (mock logic as offers don't have category field in this snippet, assumes generic match if implemented)
		// For now we just return sorted
		return sorted;
	};

	const sortedOffers = getSortedOffers();

	// Pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentOffers = sortedOffers.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(sortedOffers.length / itemsPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50 flex flex-col">

				<div className="max-w-[1200px] mx-auto px-4 w-full flex-1 py-8">
					{/* Hero Banner with Background Image - Constrained Width */}
					<div
						className="relative bg-cover bg-center text-white py-12 mb-8 shadow-lg rounded-xl overflow-hidden"
						style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
					>
						{/* Overlay for readability */}
						<div className="absolute inset-0 bg-black/50 z-0"></div>

						<div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8">
							<div className="mb-6 md:mb-0">
								<h1 className="text-4xl font-extrabold mb-2 tracking-tight">Produtos em Promoção</h1>
								<p className="text-gray-100 text-lg max-w-xl">
                                    Aproveite descontos exclusivos por tempo limitado.
                                    Corra antes que o estoque acabe!
								</p>
							</div>

							{/* Countdown Timer Card */}
							<div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-center min-w-[300px]">
								<p className="text-blue-50 text-sm font-semibold uppercase tracking-wider mb-3">Termina em:</p>
								<div className="flex justify-center gap-4 text-3xl font-bold font-mono">
									<div className="bg-white text-blue-800 rounded-lg p-2 w-16 shadow-lg">
										{pad(timeLeft.hours)}
										<span className="block text-xs font-sans font-normal text-blue-600 mt-1">HORAS</span>
									</div>
									<span className="self-center -mt-6">:</span>
									<div className="bg-white text-blue-800 rounded-lg p-2 w-16 shadow-lg">
										{pad(timeLeft.minutes)}
										<span className="block text-xs font-sans font-normal text-blue-600 mt-1">MIN</span>
									</div>
									<span className="self-center -mt-6">:</span>
									<div className="bg-white text-blue-800 rounded-lg p-2 w-16 shadow-lg">
										{pad(timeLeft.seconds)}
										<span className="block text-xs font-sans font-normal text-blue-600 mt-1">SEG</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex gap-6">
						{/* Sidebar Filters */}
						<FilterSidebar
							categories={['Mais Vendidos', 'Smartphones', 'Notebooks', 'TVs', 'Casa', 'Beleza', 'Moda']}
							priceRange={priceRange}
							setPriceRange={setPriceRange}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							rating={rating}
							setRating={setRating}
						/>

						{/* Main Content */}
						<div className="flex-1">
							{/* Section Header & Sorting */}
							<div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
								<div className="flex items-center gap-2">
									<span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
									<div>
										<h2 className="text-xl font-bold text-gray-800">Destaques do Dia</h2>
										<span className="text-xs text-gray-500 font-medium">{offers.length} produtos encontrados</span>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<span className="text-sm text-gray-600">Ordenar por:</span>
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
									>
										<option value="relevance">Relevância</option>
										<option value="lowest">Menor Preço</option>
										<option value="highest">Maior Preço</option>
										<option value="name">Nome (A-Z)</option>
									</select>
								</div>
							</div>

							{/* Product Grid */}
							<ProductGrid products={currentOffers} />

							{/* Pagination */}
							<div className="flex justify-center items-center mt-8 gap-2">
								<button
									onClick={() => paginate(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-colors ${currentPage === 1
										? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
										: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-gray-200'
									}`}
								>
									<IoChevronBack size={18} />
								</button>

								{Array.from({ length: totalPages }).map((_, i) => (
									<button
										key={i}
										onClick={() => paginate(i + 1)}
										className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-all font-medium ${currentPage === i + 1
											? 'bg-blue-600 text-white border-blue-600'
											: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-gray-200'
										}`}
									>
										{i + 1}
									</button>
								))}

								<button
									onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-colors ${currentPage === totalPages
										? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
										: 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-gray-200'
									}`}
								>
									<IoChevronForward size={18} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Promocoes;
