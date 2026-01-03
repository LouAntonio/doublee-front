import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const BannerCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Banners de exemplo (você pode substituir pelas suas imagens)
	const banners = [
		{
			id: 1,
			image: 'https://http2.mlstatic.com/D_NQ_931890-MLA80628622454_112024-OO.webp',
			alt: 'Casas Bahia no Mercado Livre',
			bgColor: '#FFE600'
		},
		{
			id: 2,
			image: 'https://http2.mlstatic.com/D_NQ_934551-MLA80738476886_112024-OO.webp',
			alt: 'Ofertas em Eletrônicos',
			bgColor: '#2968C8'
		},
		{
			id: 3,
			image: 'https://http2.mlstatic.com/D_NQ_660523-MLA80738477147_112024-OO.webp',
			alt: 'Moda e Acessórios',
			bgColor: '#FF6F00'
		},
		{
			id: 4,
			image: 'https://http2.mlstatic.com/D_NQ_822196-MLA80738477001_112024-OO.webp',
			alt: 'Casa e Decoração',
			bgColor: '#00A650'
		}
	];

	// Auto-play
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % banners.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, banners.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % banners.length);
		setIsAutoPlaying(false);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
		setIsAutoPlaying(false);
	};

	const goToSlide = (index) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
	};

	return (
		<div className="relative h-[calc(60vh)] overflow-hidden" style={{ backgroundColor: banners[currentSlide].bgColor }}>
			{/* Carrossel Container */}
			<div className="relative max-w-[1600px] mx-auto">
				{/* Slides */}
				<div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
					{banners.map((banner, index) => (
						<div
							key={banner.id}
							className={`absolute inset-0 transition-opacity duration-500 ${
								index === currentSlide ? 'opacity-100' : 'opacity-0'
							}`}
						>
							<img
								src={banner.image}
								alt={banner.alt}
								className="w-full h-full object-cover"
								onError={(e) => {
									e.target.src = 'https://via.placeholder.com/1600x400/FFE600/000000?text=Banner+' + (index + 1);
								}}
							/>
						</div>
					))}
				</div>

				{/* Navigation Arrows */}
				<button
					onClick={prevSlide}
					className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all z-10 group"
					aria-label="Banner anterior"
				>
					<IoChevronBack className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900" />
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all z-10 group"
					aria-label="Próximo banner"
				>
					<IoChevronForward className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900" />
				</button>

				{/* Dots Indicator */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
					{banners.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`w-2 h-2 rounded-full transition-all ${
								index === currentSlide
									? 'bg-white w-6'
									: 'bg-white/50 hover:bg-white/75'
							}`}
							aria-label={`Ir para slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default BannerCarousel;