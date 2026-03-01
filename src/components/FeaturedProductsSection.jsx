import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const FeaturedProductsSection = () => {
	const products = [
		{
			id: 101,
			title: 'Cadeira Gamer Profissional Ergonômica Reclinável Black',
			oldPrice: 1299.90,
			price: 899.90,
			discount: 30,
			isFeatured: true,
			installments: '10x R$ 89,99 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/1a1a1a/fff?text=Cadeira+Gamer'
		},
		{
			id: 102,
			title: 'Monitor Gamer 27 Polegadas 144Hz 1ms Full HD IPS',
			price: 1199.00,
			isFeatured: true,
			installments: '12x R$ 99,91 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/333/fff?text=Monitor+Gamer'
		},
		{
			id: 103,
			title: 'Teclado Mecânico RGB Switch Blue Layout ABNT2',
			oldPrice: 349.90,
			price: 269.90,
			discount: 22,
			isFeatured: true,
			installments: '5x R$ 53,98 sem juros',
			freeShipping: false,
			image: 'https://via.placeholder.com/200x200/444/fff?text=Teclado+Mec'
		},
		{
			id: 104,
			title: 'Mouse Gamer 16000 DPI Sensor Óptico Pro Especial',
			price: 199.00,
			isFeatured: true,
			installments: '4x R$ 49,75 sem juros',
			freeShipping: false,
			image: 'https://via.placeholder.com/200x200/555/fff?text=Mouse+Gamer'
		},
		{
			id: 105,
			title: 'Headset Gamer 7.1 Surround Noise Cancelling Mic',
			oldPrice: 459.00,
			price: 329.00,
			discount: 28,
			isFeatured: true,
			installments: '6x R$ 54,83 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/222/fff?text=Headset+Gamer'
		},
		{
			id: 106,
			title: 'Console Portátil Retro 5000 Jogos Tela 3.5 IPS',
			price: 249.90,
			isFeatured: true,
			installments: '5x R$ 49,98 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/666/fff?text=Console+Retro'
		},
		{
			id: 107,
			title: 'Webcam 4K Ultra HD Com Microfone Stereo Digital',
			oldPrice: 599.00,
			price: 449.00,
			discount: 25,
			isFeatured: true,
			installments: '9x R$ 49,88 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/777/fff?text=Webcam+4K'
		},
		{
			id: 108,
			title: 'Microfone Condensador Profissional Streaming USB',
			price: 279.00,
			isFeatured: true,
			installments: '5x R$ 55,80 sem juros',
			freeShipping: false,
			image: 'https://via.placeholder.com/200x200/888/fff?text=Microfone'
		},
		{
			id: 109,
			title: 'Suporte Articulado Para 2 Monitores Até 32 Pol',
			oldPrice: 299.00,
			price: 189.00,
			discount: 36,
			isFeatured: true,
			installments: '3x R$ 63,00 sem juros',
			freeShipping: false,
			image: 'https://via.placeholder.com/200x200/999/fff?text=Suporte+Mon'
		},
		{
			id: 110,
			title: 'SSD M.2 NVMe 1TB Velocidade Até 3500MB/s Gen3',
			price: 499.00,
			isFeatured: true,
			installments: '10x R$ 49,90 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/aaa/fff?text=SSD+1TB'
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
                        Produtos em destaque
					</h2>
					<Link to="/destaques" style={{
						color: '#3483fa',
						fontSize: '14px',
						textDecoration: 'none',
						fontWeight: '400'
					}}>
                        Ver mais destaques
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

export default FeaturedProductsSection;
