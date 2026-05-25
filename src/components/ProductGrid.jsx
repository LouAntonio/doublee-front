import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
	const navigate = useNavigate();
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
			{products.map((product, index) => (
				<div
					key={product.id}
					className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow promocoes-stagger"
					style={{ animationDelay: `${(index % 8) * 60}ms` }}
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

