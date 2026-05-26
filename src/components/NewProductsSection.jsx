import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useProducts } from '../hooks/queries/useProducts';

const SCROLL_SPEED = 1;
const SCROLL_INTERVAL = 30;

const NewProductsSection = () => {
	const { data, isLoading } = useProducts({ sort: 'newest', limit: 20 });
	const scrollRef = useRef(null);
	const intervalRef = useRef(null);
	const [isPaused, setIsPaused] = useState(false);

	const products = data?.products ?? [];
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

	const handleMouseEnter = useCallback(() => {
		setIsPaused(true);
		stopScroll();
	}, [stopScroll]);

	const handleMouseLeave = useCallback(() => {
		setIsPaused(false);
	}, []);

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
						{[...Array(10)].map((_, i) => (
							<div key={i} className="flex-shrink-0 w-[180px] sm:w-[200px]"><ProductSkeleton /></div>
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
                        Novidades
					</h2>
					<Link to="/produtos?sort=newest" className="font-body text-sm text-accent hover:underline">
                        Ver mais
					</Link>
				</div>

				<div
					ref={scrollRef}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					className="flex gap-3 overflow-hidden"
				>
					{duplicated.map((product, index) => (
						<div key={`${product.id}-${index}`} className="flex-shrink-0 w-[180px] sm:w-[200px]">
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default NewProductsSection;