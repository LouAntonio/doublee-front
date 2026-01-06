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
			title: 'Entrega',
			description: 'Condições de entrega para Angola.',
			caption: 'Ver condições'
		},
		{
			id: 2,
			icon: '👤',
			title: 'Entre na sua conta',
			description: 'Aproveite ofertas para comprar tudo que quiser.',
			caption: 'Cadastre-se'
		},
		{
			id: 3,
			icon: '📍',
			title: 'Insira sua localização',
			description: 'Confira os custos e prazos de entrega.',
			caption: 'Definir endereço'
		},
		{
			id: 4,
			icon: '💳',
			title: 'Pagamento',
			description: 'Pague suas compras com rapidez e segurança.',
			caption: 'Saiba mais'
		},
		{
			id: 5,
			icon: '💰',
			title: 'Menos de Kz100',
			description: 'Confira produtos com preços baixos.',
			caption: 'Ver ofertas'
		},
		{
			id: 6,
			icon: '🛍️',
			title: 'Mais vendidos',
			description: 'Explore os produtos que são sucesso.',
			caption: 'Veja mais'
		},
		{
			id: 7,
			icon: '⚡',
			title: 'Ofertas do dia',
			description: 'Descontos imperdíveis todos os dias.',
			caption: 'Confira as ofertas'
		},
		{
			id: 8,
			icon: '🏆',
			title: 'Top Sellers',
			description: 'Os vendedores mais bem avaliados.',
			caption: 'Saiba mais'
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
								className="flex-shrink-0 w-[200px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group flex flex-col h-[320px] items-center"
							>
								<div className="p-6 flex flex-col flex-1 items-center text-center w-full">
									{/* Title */}
									<h3 className="font-semibold text-gray-900 mb-3 text-base">
										{category.title}
									</h3>
									{/* Icon */}
									<div className="mb-3 flex items-center justify-center h-24">
										<div className="w-20 h-20 bg-[#fff159] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
											<span className="text-4xl">{category.icon}</span>
										</div>
									</div>
									{/* Description */}
									<p className="text-sm text-gray-600 leading-snug px-2">
										{category.description}
									</p>
									{/* caption - aligned to bottom */}
									<div className="mt-auto w-full flex justify-center">
										<button
											type="button"
											className="mt-4 inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-medium shadow-sm transition-colors"
											aria-label={category.caption}
										>
											{category.caption}
										</button>
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
