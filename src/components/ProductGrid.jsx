import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
	const navigate = useNavigate();
	return (
		<div style={{
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)',
			gap: '12px'
		}}>
			{products.map((product) => (
				<div
					key={product.id}
					style={{
						backgroundColor: '#fff',
						borderRadius: '6px',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}
				>
					<ProductCard
						product={product}
						onClick={() => navigate(`/produto/${product.id}`)}
					/>
				</div>
			))}
		</div>
	);
};

export default ProductGrid;

