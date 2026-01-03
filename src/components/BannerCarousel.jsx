import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const BannerCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	const banners = [
		{
			id: 1,
			image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop',
			alt: 'Eletrônicos em destaque',
			bgColor: '#FFE600'
		},
		{
			id: 2,
			image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80&auto=format&fit=crop',
			alt: 'Ofertas e promoções',
			bgColor: '#2968C8'
		},
		{
			id: 3,
			image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd28?w=1600&q=80&auto=format&fit=crop',
			alt: 'Moda e acessórios',
			bgColor: '#FF6F00'
		},
		{
			id: 4,
			image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80&auto=format&fit=crop',
			alt: 'Casa e decoração',
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
									e.target.src = 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80&auto=format&fit=crop';
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