import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-icons/io5';

const CategoryCarousel = () => {
	const scrollContainerRef = useRef(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);

	const categories = [
		{
			id: 1,
			title: 'Frete grátis',
			description: 'Benefício por ser sua primeira compra.',
			link: 'Mostrar produtos',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<rect x="25" y="35" width="50" height="35" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<path d="M25 45 L50 30 L75 45" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<circle cx="70" cy="25" r="8" fill="#4CAF50"/>
					<path d="M67 25 L69 27 L73 23" stroke="white" strokeWidth="2" fill="none"/>
				</svg>
			)
		},
		{
			id: 2,
			title: 'Entre na sua conta',
			description: 'Aproveite ofertas para comprar tudo que quiser.',
			link: 'Entrar na sua conta',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<rect x="20" y="30" width="60" height="45" rx="5" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<circle cx="50" cy="47" r="12" fill="white" stroke="#333" strokeWidth="2"/>
					<circle cx="50" cy="44" r="5" fill="#333"/>
					<path d="M42 55 Q50 60 58 55" stroke="#333" strokeWidth="2" fill="none"/>
				</svg>
			)
		},
		{
			id: 3,
			title: 'Insira sua localização',
			description: 'Confira os custos e prazos de entrega.',
			link: 'Informar localização',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<rect x="25" y="25" width="50" height="50" rx="5" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<path d="M50 35 L50 50 M50 50 L60 50" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
					<circle cx="50" cy="45" r="18" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 4"/>
				</svg>
			)
		},
		{
			id: 4,
			title: 'Meios de pagamento',
			description: 'Pague suas compras com rapidez e segurança.',
			link: 'Mostrar meios',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<rect x="20" y="35" width="60" height="38" rx="5" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<rect x="20" y="35" width="60" height="12" fill="#333"/>
					<rect x="28" y="55" width="20" height="8" rx="2" fill="white" stroke="#333" strokeWidth="1"/>
				</svg>
			)
		},
		{
			id: 5,
			title: 'Menos de R$100',
			description: 'Confira produtos com preços baixos.',
			link: 'Mostrar produtos',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<circle cx="50" cy="50" r="25" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<text x="50" y="58" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#333">R$</text>
					<circle cx="72" cy="30" r="8" fill="#4CAF50"/>
					<path d="M70 30 L71.5 31.5 L74 29" stroke="white" strokeWidth="2" fill="none"/>
				</svg>
			)
		},
		{
			id: 6,
			title: 'Mais vendidos',
			description: 'Explore os produtos que são sucesso.',
			link: 'Ver produtos',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<path d="M30 70 L30 45 L40 45 L40 70 M45 70 L45 35 L55 35 L55 70 M60 70 L60 25 L70 25 L70 70" 
						fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<line x1="25" y1="70" x2="75" y2="70" stroke="#333" strokeWidth="2"/>
				</svg>
			)
		},
		{
			id: 7,
			title: 'Ofertas do dia',
			description: 'Descontos imperdíveis todos os dias.',
			link: 'Ver ofertas',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					<rect x="30" y="25" width="40" height="50" rx="3" fill="#FFE600" stroke="#333" strokeWidth="2"/>
					<circle cx="38" cy="35" r="3" fill="#333"/>
					<circle cx="62" cy="35" r="3" fill="#333"/>
					<path d="M40 50 Q50 58 60 50" stroke="#333" strokeWidth="2" fill="none"/>
					<path d="M50 15 L53 23 L50 21 L47 23 Z" fill="#FF4444"/>
				</svg>
			)
		},
		{
			id: 8,
			title: 'Compra garantida',
			description: 'Você pode devolver sua compra grátis.',
			link: 'Como funciona',
			icon: (
				<svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
					{/* Box */}
					<rect x="30" y="40" width="35" height="35" rx="2" fill="white" stroke="#333" strokeWidth="2.5"/>
					
					{/* Tape on box */}
					<rect x="30" y="52" width="35" height="8" fill="#FFE600"/>
					<line x1="30" y1="56" x2="65" y2="56" stroke="#333" strokeWidth="1" strokeDasharray="3 2"/>
					
					{/* Small lines on box */}
					<line x1="35" y1="45" x2="35" y2="50" stroke="#333" strokeWidth="1.5"/>
					<line x1="60" y1="45" x2="60" y2="50" stroke="#333" strokeWidth="1.5"/>
					
					{/* Check circle */}
					<circle cx="72" cy="28" r="13" fill="#4CAF50" stroke="#fff" strokeWidth="2"/>
					<path d="M67 28 L70 31 L77 24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			)
		}
	];

	const checkScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setShowLeftArrow(scrollLeft > 0);
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	const scroll = (direction) => {
		if (scrollContainerRef.current) {
			const scrollAmount = 280;
			const newScrollLeft = 
				direction === 'left'
					? scrollContainerRef.current.scrollLeft - scrollAmount
					: scrollContainerRef.current.scrollLeft + scrollAmount;

			scrollContainerRef.current.scrollTo({
				left: newScrollLeft,
				behavior: 'smooth'
			});

			setTimeout(checkScroll, 300);
		}
	};

	return (
		<div className="relative bg-gray-100 -mt-16 pt-2 pb-8">
			<div className="max-w-[1200px] mx-auto px-4">
				<div className="relative">
					{/* Left Arrow */}
					{showLeftArrow && (
						<button
							onClick={() => scroll('left')}
							className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-all z-10 hidden lg:flex items-center justify-center"
							aria-label="Rolar para esquerda"
						>
							<ChevronLeft className="w-6 h-6 text-gray-700" />
						</button>
					)}

					{/* Cards Container */}
					<div
						ref={scrollContainerRef}
						onScroll={checkScroll}
						className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
						style={{
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}
					>
						{categories.map((category) => (
							<div
								key={category.id}
								className="flex-shrink-0 w-[220px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
							>
								<div className="p-6 flex flex-col items-center text-center h-full">
									{/* Title */}
									<h3 className="font-semibold text-gray-900 mb-6 text-lg leading-tight">
										{category.title}
									</h3>
									
									{/* Icon */}
									<div className="flex-1 flex items-center justify-center mb-6">
										<div className="group-hover:scale-105 transition-transform">
											{category.icon}
										</div>
									</div>
									
									{/* Description */}
									<p className="text-sm text-blue-600 leading-snug mb-6 px-2">
										{category.description}
									</p>
									
									{/* Link Button */}
									<button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2.5 px-4 rounded-md text-sm transition-colors">
										{category.link}
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Right Arrow */}
					{showRightArrow && (
						<button
							onClick={() => scroll('right')}
							className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-all z-10 hidden lg:flex items-center justify-center"
							aria-label="Rolar para direita"
						>
							<ChevronRight className="w-6 h-6 text-gray-700" />
						</button>
					)}
				</div>

				{/* Mobile scroll indicator */}
				<div className="flex lg:hidden justify-center mt-4 gap-1">
					{Array.from({ length: Math.ceil(categories.length / 2) }).map((_, index) => (
						<div
							key={index}
							className="w-2 h-2 rounded-full bg-gray-300"
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoryCarousel;