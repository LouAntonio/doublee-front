import React, { useRef, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const CategoryCarousel = () => {
	const scrollContainerRef = useRef(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);

	const categories = [
		{
			id: 1,
			icon: '🎁',
			title: 'Frete grátis',
			description: 'Benefício por ser sua primeira compra.'
		},
		{
			id: 2,
			icon: '👤',
			title: 'Entre na sua conta',
			description: 'Aproveite ofertas para comprar tudo que quiser.'
		},
		{
			id: 3,
			icon: '📍',
			title: 'Insira sua localização',
			description: 'Confira os custos e prazos de entrega.'
		},
		{
			id: 4,
			icon: '💳',
			title: 'Meios de pagamento',
			description: 'Pague suas compras com rapidez e segurança.'
		},
		{
			id: 5,
			icon: '💰',
			title: 'Menos de R$100',
			description: 'Confira produtos com preços baixos.'
		},
		{
			id: 6,
			icon: '🛍️',
			title: 'Mais vendidos',
			description: 'Explore os produtos que são sucesso.'
		},
		{
			id: 7,
			icon: '⚡',
			title: 'Ofertas do dia',
			description: 'Descontos imperdíveis todos os dias.'
		},
		{
			id: 8,
			icon: '🏆',
			title: 'Top Sellers',
			description: 'Os vendedores mais bem avaliados.'
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
			const scrollAmount = 280; // Largura aproximada de um card
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
		<div className="relative bg-transparent -mt-[20vh] pt-2 pb-8">
			<div className="max-w-[1200px] mx-auto px-4">
				{/* Carrossel Container */}
				<div className="relative">
					{/* Left Arrow */}
					{showLeftArrow && (
						<button
							onClick={() => scroll('left')}
							className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-all z-10 hidden lg:flex items-center justify-center"
							aria-label="Rolar para esquerda"
						>
							<IoChevronBack className="w-6 h-6 text-gray-700" />
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
								className="flex-shrink-0 w-[260px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
							>
								<div className="p-6">
									{/* Icon */}
									<div className="text-5xl mb-4 flex items-center justify-center h-24">
										<div className="w-20 h-20 bg-[#fff159] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
											<span className="text-4xl">{category.icon}</span>
										</div>
									</div>
									{/* Content */}
									<div className="text-center">
										<h3 className="font-semibold text-gray-900 mb-2 text-base">
											{category.title}
										</h3>
										<p className="text-sm text-gray-600 leading-snug">
											{category.description}
										</p>
									</div>
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
							<IoChevronForward className="w-6 h-6 text-gray-700" />
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
