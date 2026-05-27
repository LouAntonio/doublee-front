import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

const SCROLL_SPEED = 1;
const SCROLL_INTERVAL = 30;
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
	const intervalRef = useRef(null);
	const [isPaused, setIsPaused] = useState(false);

	const pointerState = useRef({
		isDown: false,
		startX: 0,
		startScrollLeft: 0,
		isDragged: false,
	});

	const duplicated = [...products, ...products];

	const startScroll = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			const el = scrollRef.current;
			if (!el) return;
			const half = el.scrollWidth / 2;
			if (el.scrollLeft >= half) {
				el.scrollLeft = 0;
			} else {
				el.scrollLeft += SCROLL_SPEED;
			}
		}, SCROLL_INTERVAL);
	}, []);

	const stopScroll = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const handlePointerDown = useCallback((clientX) => {
		stopScroll();
		setIsPaused(true);
		pointerState.current = {
			isDown: true,
			startX: clientX,
			startScrollLeft: scrollRef.current?.scrollLeft || 0,
			isDragged: false,
		};
	}, [stopScroll]);

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
		setIsPaused(false);
	}, []);

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

	const handleMouseEnter = useCallback(() => {
		setIsPaused(true);
		stopScroll();
	}, [stopScroll]);

	const handleMouseLeave = useCallback(() => {
		if (pointerState.current.isDown) return;
		setIsPaused(false);
	}, []);

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
		if (isPaused || products.length === 0) return;
		startScroll();
		return stopScroll;
	}, [isPaused, products.length, startScroll, stopScroll]);

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

				<div
					ref={scrollRef}
					className="flex gap-3 overflow-hidden select-none"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handlePointerUp}
					onMouseLeave={handleMouseLeave}
					onMouseEnter={handleMouseEnter}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handlePointerUp}
					onClickCapture={handleClickCapture}
				>
					{duplicated.map((product, index) => (
						<div key={`${product.id}-${index}`} className={`flex-shrink-0 ${cardWidthClass}`}>
							{renderProduct ? renderProduct(product) : <ProductCard product={product} />}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HorizontalProductSlider;
