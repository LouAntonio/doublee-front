import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const DRAG_THRESHOLD = 5;

const HorizontalProductSlider = ({
	title,
	seeAllLink,
	products = [],
	isLoading,
	skeletonCount = 10,
	cardWidthClass = 'w-[180px] sm:w-[200px]',
	renderProduct,
}) => {
	const scrollRef = useRef(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);
	const [itemsPerView, setItemsPerView] = useState(1);

	const pointerState = useRef({
		isDown: false,
		startX: 0,
		startScrollLeft: 0,
		isDragged: false,
	});

	const checkScroll = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		setShowLeftArrow(scrollLeft > 0);
		setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
	}, []);

	const scrollByItems = useCallback((direction) => {
		const el = scrollRef.current;
		if (!el) return;
		const firstCard = el.querySelector('[data-card]');
		if (!firstCard) return;
		const cardWidth = firstCard.offsetWidth;
		const gap = 12;
		const itemWidth = cardWidth + gap;
		const scrollAmount = itemsPerView * itemWidth;
		const maxScroll = el.scrollWidth - el.clientWidth;
		const newScrollLeft =
			direction === 'left'
				? Math.max(0, el.scrollLeft - scrollAmount)
				: Math.min(maxScroll, el.scrollLeft + scrollAmount);

		el.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
		setTimeout(checkScroll, 350);
	}, [itemsPerView, checkScroll]);

	const handlePointerDown = useCallback((clientX) => {
		pointerState.current = {
			isDown: true,
			startX: clientX,
			startScrollLeft: scrollRef.current?.scrollLeft || 0,
			isDragged: false,
		};
	}, []);

	const handlePointerMove = useCallback((clientX) => {
		const ps = pointerState.current;
		if (!ps.isDown || !scrollRef.current) return;
		const dx = clientX - ps.startX;
		if (Math.abs(dx) > DRAG_THRESHOLD) {
			ps.isDragged = true;
		}
		scrollRef.current.scrollLeft = ps.startScrollLeft - dx;
	}, []);

	const handlePointerUp = useCallback(() => {
		pointerState.current.isDown = false;
		checkScroll();
	}, [checkScroll]);

	const handleClickCapture = useCallback((e) => {
		if (pointerState.current.isDragged) {
			e.stopPropagation();
			pointerState.current.isDragged = false;
		}
	}, []);

	const handleMouseDown = useCallback((e) => {
		handlePointerDown(e.clientX);
	}, [handlePointerDown]);

	const handleMouseMove = useCallback((e) => {
		handlePointerMove(e.clientX);
	}, [handlePointerMove]);

	const handleTouchStart = useCallback((e) => {
		handlePointerDown(e.touches[0].clientX);
	}, [handlePointerDown]);

	const handleTouchMove = useCallback((e) => {
		handlePointerMove(e.touches[0].clientX);
		if (pointerState.current.isDragged) {
			e.preventDefault();
		}
	}, [handlePointerMove]);

	useEffect(() => {
		const onWindowMouseUp = () => {
			if (pointerState.current.isDown) {
				handlePointerUp();
			}
		};
		window.addEventListener('mouseup', onWindowMouseUp);
		return () => window.removeEventListener('mouseup', onWindowMouseUp);
	}, [handlePointerUp]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el || products.length === 0) return;

		const observer = new ResizeObserver(() => {
			const firstCard = el.querySelector('[data-card]');
			if (!firstCard) return;
			const cardWidth = firstCard.offsetWidth;
			const gap = 12;
			const itemWidth = cardWidth + gap;
			const containerWidth = el.clientWidth;
			const newItemsPerView = Math.max(1, Math.floor(containerWidth / itemWidth));
			setItemsPerView(newItemsPerView);
			checkScroll();
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [products.length, checkScroll]);

	if (isLoading && products.length === 0) {
		return (
			<section style={{
				backgroundColor: 'transparent', display: 'flex', justifyContent: 'center',
				padding: '24px 0', marginBottom: '16px',
			}}>
				<div style={{
					width: 'calc(100% - 48px)', maxWidth: '1180px', backgroundColor: '#fff',
					borderRadius: '10px', padding: '20px 20px 8px 20px',
					boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
						<div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
					</div>
					<div className="flex gap-3 overflow-hidden">
						{[...Array(skeletonCount)].map((_, i) => (
							<div key={i} className={`flex-shrink-0 ${cardWidthClass}`}><ProductSkeleton /></div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!isLoading && products.length === 0) {
		return null;
	}

	return (
		<section style={{
			backgroundColor: 'transparent', display: 'flex', justifyContent: 'center',
			padding: '24px 0', marginBottom: '16px',
		}}>
			<div style={{
				width: 'calc(100% - 48px)', maxWidth: '1180px', backgroundColor: '#fff',
				borderRadius: '10px', padding: '20px 20px 8px 20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
			}}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
					<h2 className="font-display text-2xl text-[#1C1917] m-0">
						{title}
					</h2>
					{seeAllLink && (
						<Link to={seeAllLink} className="font-body text-sm text-accent hover:underline">
							Ver mais
						</Link>
					)}
				</div>

				<div className="relative">
					{showLeftArrow && products.length > itemsPerView && (
						<button
							onClick={() => scrollByItems('left')}
							className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 p-2.5 rounded-full shadow-lg transition-all z-10 flex items-center justify-center"
							aria-label="Rolar para esquerda"
						>
							<IoChevronBack className="w-5 h-5 text-gray-700" />
						</button>
					)}

					<div
						ref={scrollRef}
						className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth select-none"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handlePointerUp}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handlePointerUp}
						onClickCapture={handleClickCapture}
						onScroll={checkScroll}
					>
						{products.map((product, index) => (
							<div key={product.id} data-card={index === 0 ? '' : undefined} className={`flex-shrink-0 ${cardWidthClass}`}>
								{renderProduct ? renderProduct(product) : <ProductCard product={product} />}
							</div>
						))}
					</div>

					{showRightArrow && products.length > itemsPerView && (
						<button
							onClick={() => scrollByItems('right')}
							className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 p-2.5 rounded-full shadow-lg transition-all z-10 flex items-center justify-center"
							aria-label="Rolar para direita"
						>
							<IoChevronForward className="w-5 h-5 text-gray-700" />
						</button>
					)}
				</div>
			</div>
		</section>
	);
};

export default HorizontalProductSlider;
