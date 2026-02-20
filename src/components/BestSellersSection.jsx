import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const BestSellersSection = () => {
	const products = [
		{
			id: 1,
			title: 'Piscina Inflável Fun Redonda 1400l Com Kit...',
			oldPrice: 279,
			price: 159.90,
			discount: 42,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/4169E1/fff?text=Piscina'
		},
		{
			id: 2,
			title: 'Mangueira De Jardim 10m Metros Marqs Home...',
			oldPrice: 32.90,
			price: 28.89,
			discount: 12,
			installments: null,
			coupon: 'Cupom 6% OFF',
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/00A650/fff?text=Mangueira'
		},
		{
			id: 3,
			title: 'Piscina Banheira Inflável Redonda 450 Litro...',
			oldPrice: 112.62,
			price: 67.80,
			discount: 39,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/1E90FF/fff?text=Banheira'
		},
		{
			id: 4,
			title: 'Lona Térmica Para Piscinas 3 X 3 Thermocap Cor Verde',
			oldPrice: 181.44,
			price: 154.22,
			discount: 15,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/008B8B/fff?text=Lona'
		},
		{
			id: 5,
			title: 'Genco 3 Em 1 Múltipla Ação Balde 10kg Cloro Para...',
			oldPrice: null,
			price: 199.90,
			discount: null,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/FFD700/333?text=Genco'
		},
		{
			id: 6,
			title: 'Piscina Infantil Quadrada Estrutural Pvc 1500 Litros...',
			oldPrice: null,
			price: 232.99,
			discount: null,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/87CEEB/333?text=Piscina+Infantil'
		},
		{
			id: 7,
			title: 'Kit Limpeza Piscina Completo 7 Peças Aspirador...',
			oldPrice: 289.90,
			price: 189.90,
			discount: 34,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/4682B4/fff?text=Kit+Limpeza'
		},
		{
			id: 8,
			title: 'Bomba Filtrante Para Piscina 3785 L/h 110v...',
			oldPrice: 349,
			price: 259.90,
			discount: 25,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/5F9EA0/fff?text=Bomba'
		},
		{
			id: 9,
			title: 'Filtro Para Piscina Cartucho Refil Intex Tipo A...',
			oldPrice: 59.90,
			price: 39.90,
			discount: 33,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/6A5ACD/fff?text=Filtro'
		},
		{
			id: 10,
			title: 'Escada Para Piscina 3 Degraus Aço Inox Resistente...',
			oldPrice: 499.90,
			price: 379.90,
			discount: 24,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/CD853F/fff?text=Escada'
		}
	];

	const firstRow = products.slice(0, 5);
	const secondRow = products.slice(5, 10);

	const rowStyle = {
		display: 'flex',
		gap: '12px',
		marginBottom: '12px'
	};

	const cardWrapperStyle = {
		flex: '1 1 0',
		minWidth: 0
	};

	return (
		<section style={{
			backgroundColor: 'transparent',
			display: 'flex',
			justifyContent: 'center',
			padding: '24px 0',
			marginBottom: '16px'
		}}>
			<div style={{
				width: 'calc(100% - 48px)',
				maxWidth: '1180px',
				backgroundColor: '#fff',
				borderRadius: '10px',
				padding: '20px 20px 8px 20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
			}}>
				{/* Header */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '20px'
				}}>
					<h2 style={{
						fontSize: '24px',
						fontWeight: '400',
						color: '#333',
						margin: 0
					}}>
						Mais vendidos da semana em Piscinas e Acessórios
					</h2>
					<Link to="/mais-vendidos" style={{
						color: '#3483fa',
						fontSize: '14px',
						textDecoration: 'none',
						fontWeight: '400'
					}}>
						Ir para Mais vendidos
					</Link>
				</div>

				{/* Row 1 */}
				<div style={rowStyle}>
					{firstRow.map((product) => (
						<div key={product.id} style={cardWrapperStyle}>
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{/* Row 2 */}
				<div style={rowStyle}>
					{secondRow.map((product) => (
						<div key={product.id} style={cardWrapperStyle}>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default BestSellersSection;

