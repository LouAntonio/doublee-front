import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const BannerCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [headerHeight, setHeaderHeight] = useState(0);

	const banners = [
		{
			id: 1,
			image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop',
			alt: 'Eletrônicos em destaque',
			bgColor: '#FFE600',
			badge: 'Kutambula MARKETPLACE',
			title: 'Alimentos e Bebidas Africanas',
			subtitle: 'Especiarias, cereais, bebidas tradicionais e muito mais. Produtos frescos de qualidade para sua cozinha.',
			cta: 'Ver Produtos'
		},
		{
			id: 2,
			image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80&auto=format&fit=crop',
			alt: 'promoções e promoção',
			bgColor: '#2968C8',
			badge: 'promoções',
			title: 'Grandes promoções',
			subtitle: 'Descontos especiais em eletrónicos e acessórios.',
			cta: 'Aproveitar'
		},
		{
			id: 3,
			image: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd28?w=1600&q=80&auto=format&fit=crop',
			alt: 'Moda e acessórios',
			bgColor: '#FF6F00',
			badge: 'Moda',
			title: 'Tendências de Moda',
			subtitle: 'Peças e acessórios para renovar seu guarda-roupa.',
			cta: 'Explorar'
		},
		{
			id: 4,
			image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80&auto=format&fit=crop',
			alt: 'Casa e decoração',
			bgColor: '#00A650',
			badge: 'Casa',
			title: 'Ideias para Sua Casa',
			subtitle: 'Decoração, utilidades e móveis com estilo.',
			cta: 'Ver Coleção'
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

	// Measure header height so carousel can fill remaining viewport
	useEffect(() => {
		const updateHeaderHeight = () => {
			if (typeof document === 'undefined') return;
			const header = document.querySelector('header');
			setHeaderHeight(header ? header.offsetHeight : 0);
		};

		updateHeaderHeight();
		window.addEventListener('resize', updateHeaderHeight);
		return () => window.removeEventListener('resize', updateHeaderHeight);
	}, []);

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
		<div
			className="relative overflow-hidden"
			style={{
				height: `calc(80vh - ${headerHeight}px)`
			}}
		>
			{/* Carrossel Container */}
			<div className="relative mx-auto h-full">
				{/* Slides */}
				<div className="relative h-full">
					{banners.map((banner, index) => (
						<div
							key={banner.id}
							className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
						>
							<img
								src={banner.image}
								alt={banner.alt}
								className="w-full h-full object-cover"
								onError={(e) => {
									e.target.src = 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80&auto=format&fit=crop';
								}}
							/>
							{/* Gradient Overlay for better text readability */}
							<div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />

							{/* Content Overlay - badge absolute + centered content */}
							<div className="absolute inset-0 pointer-events-none">
								{/* Badge absolute (doesn't affect vertical centering) */}


								{/* Centered content — padding clears the nav arrow buttons on every breakpoint */}
								<div className="absolute inset-0 flex items-center">
									<div className="w-full max-w-3xl pl-14 pr-14 sm:pl-20 sm:pr-20 md:pl-24 md:pr-10 lg:pl-28 lg:pr-12 xl:pl-32 xl:pr-16 pointer-events-auto">
										{banner.title && (
											<h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-2 sm:mb-3 md:mb-4 text-white transition-all duration-700 delay-100 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
												}`}
												style={{
													textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
												}}>
												{banner.title}
											</h2>
										)}
										{banner.subtitle && (
											<p className={`text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-4 sm:mb-5 md:mb-6 leading-relaxed transition-all duration-700 delay-200 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
												}`}
												style={{
													textShadow: '0 2px 12px rgba(0,0,0,0.6)'
												}}>
												{banner.subtitle}
											</p>
										)}
										{banner.cta && (
											<button className={`pointer-events-auto inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 font-bold px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-sm md:text-base group cursor-pointer ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
												}`}
												style={{
													transitionDelay: index === currentSlide ? '300ms' : '0ms'
												}}>
												{banner.cta}
												<span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
											</button>
										)}
									</div>
								</div>

								{/* Bottom spacer to keep dots clear */}
								<div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" />
							</div>
						</div>
					))}
				</div>

				{/* Navigation Arrows — positioned with consistent inset so they never overlap text */}
				<button
					onClick={prevSlide}
					className="absolute left-2 sm:left-3 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-2.5 md:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-20 group cursor-pointer hover:scale-110 active:scale-95"
					aria-label="Banner anterior"
				>
					<IoChevronBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-2 sm:right-3 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-2.5 md:p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-20 group cursor-pointer hover:scale-110 active:scale-95"
					aria-label="Próximo banner"
				>
					<IoChevronForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
				</button>

				{/* Dots Indicator */}
				<div className="absolute bottom-6 sm:bottom-4 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 z-10 bg-black/20 backdrop-blur-sm px-4 py-2.5 rounded-full">
					{banners.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
								? 'bg-white w-8 sm:w-10 h-2.5 sm:h-3'
								: 'bg-white/60 hover:bg-white/90 w-2.5 sm:w-3 h-2.5 sm:h-3'
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
