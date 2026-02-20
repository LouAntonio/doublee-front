import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoCartOutline, IoStar, IoStarOutline, IoHeartOutline, IoHeart, IoChevronForward, IoShieldCheckmarkOutline, IoStorefrontOutline, IoCheckmarkCircleOutline, IoChatbubbleOutline, IoSearch } from 'react-icons/io5';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { notyf } from '../utils/notyf';

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const [product, setProduct] = useState(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);
	const [wishlisted, setWishlisted] = useState(false);

	const handleToggleWishlist = () => {
		const newState = !wishlisted;
		setWishlisted(newState);
		if (newState) {
			notyf.success('Adicionado à wishlist!');
		} else {
			notyf.error('Removido da wishlist');
		}
	};

	useDocumentTitle(product ? product.title + ' - Double E' : 'Detalhes do Produto - Double E');

	useEffect(() => {
		// Simulando busca de dados do produto
		const fetchProduct = async () => {
			setLoading(true);
			await new Promise(resolve => setTimeout(resolve, 500));

			// Produtos de exemplo
			const mockProducts = [
				{
					id: 1,
					title: 'Arroz Tipo 1 Tio João',
					price: 5.99,
					oldPrice: 7.99,
					discount: 25,
					images: [
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Arroz+Tio+João+1',
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Arroz+Tio+João+2',
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Arroz+Tio+João+3',
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Arroz+Tio+João+4'
					],
					category: 'Alimentos Básicos',
					brand: 'Tio João',
					weight: '1kg',
					description: 'Arroz tipo 1, grãos longos e soltos. Produto de alta qualidade ideal para o dia a dia. Rico em nutrientes essenciais, perfeito para acompanhar suas refeições.',
					rating: 4.5,
					reviews: 128,
					stock: 45,
					seller: {
						name: 'Supermercado Online',
						logo: 'https://via.placeholder.com/100x60/1a6e1a/fff?text=LOJA',
						rating: 4.8,
						sales: '+5000 vendas'
					},
					specs: [
						{ label: 'Marca', value: 'Tio João' },
						{ label: 'Tipo', value: 'Tipo 1' },
						{ label: 'Peso líquido', value: '1kg' },
						{ label: 'Validade', value: '12 meses' }
					],
					features: [
						'Tipo 1 - Alta qualidade',
						'Grãos longos e soltos',
						'Rico em nutrientes',
						'Embalagem com 1kg'
					]
				},
				{
					id: 2,
					title: 'Feijão Preto Camil',
					price: 7.49,
					oldPrice: 9.99,
					discount: 25,
					images: [
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Feijão+Camil+1',
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Feijão+Camil+2',
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Feijão+Camil+3'
					],
					category: 'Alimentos Básicos',
					brand: 'Camil',
					weight: '1kg',
					description: 'Feijão preto tipo 1, selecionado e de alta qualidade. Perfeito para o preparo de feijoada.',
					rating: 4.7,
					reviews: 95,
					stock: 32,
					seller: {
						name: 'Supermercado Online',
						logo: 'https://via.placeholder.com/100x60/1a6e1a/fff?text=LOJA',
						rating: 4.8,
						sales: '+5000 vendas'
					},
					specs: [
						{ label: 'Marca', value: 'Camil' },
						{ label: 'Tipo', value: 'Tipo 1' },
						{ label: 'Peso líquido', value: '1kg' },
						{ label: 'Validade', value: '12 meses' }
					],
					features: [
						'Tipo 1 - Grãos selecionados',
						'Rico em proteínas',
						'Fonte de fibras',
						'Embalagem com 1kg'
					]
				},
				{
					id: 3,
					title: 'Óleo de Soja Liza',
					price: 8.99,
					oldPrice: 11.49,
					discount: 22,
					images: [
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Óleo+Liza+1',
						'https://via.placeholder.com/600x600/f8f8f8/666?text=Óleo+Liza+2'
					],
					category: 'Óleos e Azeites',
					brand: 'Liza',
					weight: '900ml',
					description: 'Óleo de soja refinado, ideal para cozinhar e fritar. Fonte de ácidos graxos essenciais.',
					rating: 4.3,
					reviews: 76,
					stock: 58,
					seller: {
						name: 'Supermercado Online',
						logo: 'https://via.placeholder.com/100x60/1a6e1a/fff?text=LOJA',
						rating: 4.8,
						sales: '+5000 vendas'
					},
					specs: [
						{ label: 'Marca', value: 'Liza' },
						{ label: 'Volume', value: '900ml' },
						{ label: 'Tipo', value: 'Refinado' },
						{ label: 'Validade', value: '18 meses' }
					],
					features: [
						'100% vegetal',
						'Rico em vitamina E',
						'Sem colesterol',
						'Garrafa com 900ml'
					]
				},
				{
					id: 4,
					title: 'Ventilador De Teto Silencioso Econômico Com Luz Led Lâmpada Embutida 3 Cores Ajustáveis Modos Timer Controle Remoto Instalação Fácil No Bocal Ideal Para Quarto Sala Marca Registrada Vital Decor',
					price: 167.90,
					oldPrice: 249.90,
					discount: 32,
					bestseller: true,
					images: [
						'https://http2.mlstatic.com/D_NQ_NP_625503-MLB76890119338_062024-O.webp',
						'https://http2.mlstatic.com/D_NQ_NP_855923-MLB76890119340_062024-O.webp',
						'https://http2.mlstatic.com/D_NQ_NP_812239-MLB76890119339_062024-O.webp',
						'https://http2.mlstatic.com/D_NQ_NP_999831-MLB76890119341_062024-O.webp'
					],
					category: 'Eletrodomésticos',
					brand: 'Vital Decor',
					model: 'Venti-Lux',
					description: 'O ventilador de teto Vital Decor é a solução perfeita para quem busca conforto, economia e praticidade. Com um design moderno e elegante, ele se adapta a qualquer ambiente, seja no quarto, na sala ou no escritório. A iluminação LED embutida oferece 3 cores ajustáveis (branco frio, branco quente e neutro), permitindo criar a atmosfera ideal para cada momento. O motor silencioso garante noites de sono tranquilas, enquanto o controle remoto e o timer programável trazem total comodidade para o seu dia a dia. A instalação é super fácil, diretamente no bocal da lâmpada, sem a necessidade de obras ou furos no teto.',
					rating: 4.8,
					reviews: 1523,
					stock: 120,
					seller: {
						name: 'Vital Decor Oficial',
						location: 'São Paulo, SP',
						logo: 'https://via.placeholder.com/100x60/3483fa/fff?text=VITAL',
						rating: 4.9,
						sales: '+10000 vendas',
						experience: 'Vendedor Platinum | 5 anos no Mercado Livre'
					},
					specs: [
						{ label: 'Marca', value: 'Vital Decor' },
						{ label: 'Modelo', value: 'Venti-Lux' },
						{ label: 'Potência', value: '30W' },
						{ label: 'Diâmetro', value: '52 cm' },
						{ label: 'Material das pás', value: 'Plástico ABS' },
						{ label: 'Voltagem', value: 'Bivolt (110V/220V)' }
					],
					features: [
						'Motor DC silencioso e econômico.',
						'Luz de LED com 3 temperaturas de cor.',
						'6 velocidades de ventilação.',
						'Função timer para desligamento automático.'
					],
					questions: [
						{
							id: 1,
							user: 'Maria S.',
							question: 'Boa noite! A instalação é realmente fácil como diz no anúncio? Preciso de um eletricista?',
							answer: 'Olá, Maria! Sim, a instalação é muito simples, feita diretamente no bocal E27 padrão, como se estivesse rosqueando uma lâmpada. Não é necessário contratar um profissional. Qualquer dúvida, estamos à disposição!'
						},
						{
							id: 2,
							user: 'João P.',
							question: 'Ele clareia bem um quarto de 12m²?',
							answer: 'Olá, João! Sim, a luminária LED de 30W é potente e ilumina muito bem um ambiente de até 15m². Você também pode ajustar a cor da luz para deixar o ambiente mais aconchegante.'
						}
					],
					opinions: [
						{
							id: 1,
							user: 'Ana Clara',
							rating: 5,
							title: 'Excelente! Superou minhas expectativas.',
							comment: 'O ventilador é muito silencioso, venta bem e a luz é ótima. O controle remoto é um diferencial. A instalação foi super fácil, eu mesma fiz em 5 minutos. Recomendo muito!'
						},
						{
							id: 2,
							user: 'Ricardo Alves',
							rating: 5,
							title: 'Produto de ótima qualidade.',
							comment: 'Gostei muito do design e da praticidade. O motor é realmente silencioso. Valeu cada centavo.'
						},
						{
							id: 3,
							user: 'Fernanda Lima',
							rating: 4,
							title: 'Bom, mas poderia ser mais forte.',
							comment: 'O produto é bom, a luz é excelente e é muito silencioso. Achei que a ventilação poderia ser um pouco mais forte, mas para o meu quarto pequeno, atende bem.'
						}
					]
				}
			];

			const foundProduct = mockProducts.find(p => p.id === parseInt(id));
			setProduct(foundProduct);
			setLoading(false);
		};

		fetchProduct();
	}, [id]);

	const handleAddToCart = () => {
		if (product) {
			addToCart(product, quantity);
		}
	};

	const incrementQuantity = () => {
		if (product && quantity < product.stock) {
			setQuantity(prev => prev + 1);
		}
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity(prev => prev - 1);
		}
	};

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				i <= rating
					? <IoStar key={i} style={{ color: '#FFD700', fontSize: '18px' }} />
					: <IoStarOutline key={i} style={{ color: '#FFD700', fontSize: '18px' }} />
			);
		}
		return stars;
	};

	if (loading) {
		return (
			<div>
				<Header />
				<div style={{
					maxWidth: '1200px',
					margin: '0 auto',
					padding: '40px 20px',
					textAlign: 'center'
				}}>
					<p>Carregando...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div>
				<Header />
				<div style={{
					maxWidth: '1200px',
					margin: '0 auto',
					padding: '40px 20px',
					textAlign: 'center'
				}}>
					<h2>Produto não encontrado</h2>
					<button
						onClick={() => navigate('/')}
						style={{
							marginTop: '20px',
							padding: '12px 24px',
							backgroundColor: '#1a6e1a',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer'
						}}
					>
						Voltar à página inicial
					</button>
				</div>
			</div>
		);
	}

	return (
		<div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
			<Header />

			<div style={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: '20px'
			}}>
				{/* Breadcrumb */}
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					marginBottom: '24px',
					fontSize: '13px',
					color: '#666'
				}}>
					<span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#3483fa' }}>
						Início
					</span>
					<IoChevronForward size={12} />
					<span onClick={() => navigate('/categorias')} style={{ cursor: 'pointer', color: '#3483fa' }}>
						{product.category}
					</span>
					<IoChevronForward size={12} />
					<span>{product.title.substring(0, 30)}...</span>
				</div>

				{/* Container Principal */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: '58% 42%',
					gap: '16px',
					marginBottom: '32px'
				}}>
					{/* Coluna Esquerda - Imagens */}
					<div>
						{/* Imagem Principal */}
						<div style={{
							backgroundColor: 'white',
							borderRadius: '8px',
							padding: '40px',
							marginBottom: '16px',
							position: 'relative'
						}}>
							<button
								onClick={handleToggleWishlist}
								title={wishlisted ? 'Remover da wishlist' : 'Adicionar à wishlist'}
								style={{
									position: 'absolute',
									top: '20px',
									right: '20px',
									width: '40px',
									height: '40px',
									border: 'none',
									backgroundColor: 'white',
									borderRadius: '50%',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
									transition: 'transform 0.2s',
									transform: wishlisted ? 'scale(1.1)' : 'scale(1)'
								}}
								onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
								onMouseLeave={(e) => e.currentTarget.style.transform = wishlisted ? 'scale(1.1)' : 'scale(1)'}
							>
								{wishlisted ? (
									<IoHeart size={22} color="#e74c3c" />
								) : (
									<IoHeartOutline size={22} color="#666" />
								)}
							</button>
							<img
								src={product.images[selectedImage]}
								alt={product.title}
								style={{
									width: '100%',
									height: '450px',
									objectFit: 'contain'
								}}
							/>
						</div>

						{/* Miniaturas */}
						<div style={{
							backgroundColor: 'white',
							borderRadius: '8px',
							padding: '16px',
							display: 'flex',
							gap: '8px',
							overflowX: 'auto'
						}}>
							{product.images.map((img, index) => (
								<div
									key={index}
									onClick={() => setSelectedImage(index)}
									style={{
										width: '60px',
										height: '60px',
										border: selectedImage === index ? '2px solid #3483fa' : '1px solid #ddd',
										borderRadius: '6px',
										overflow: 'hidden',
										cursor: 'pointer',
										flexShrink: 0
									}}
								>
									<img
										src={img}
										alt={`${product.title} ${index + 1}`}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Coluna Direita - Informações de Compra */}
					<div style={{
						backgroundColor: 'white',
						borderRadius: '8px',
						padding: '24px',
						height: 'fit-content',
						position: 'sticky',
						top: '20px'
					}}>
						{product.bestseller && (
							<div style={{
								backgroundColor: 'rgba(248, 181, 0, 0.9)',
								color: '#333',
								padding: '4px 10px',
								borderRadius: '4px',
								fontSize: '12px',
								fontWeight: '600',
								display: 'inline-block',
								marginBottom: '12px'
							}}>
								MAIS VENDIDO
							</div>
						)}
						{/* Status e Vendas */}
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							marginBottom: '16px',
							fontSize: '13px',
							color: '#666'
						}}>
							<span style={{ textTransform: 'capitalize' }}>Novo</span>
							<span>|</span>
							<span>+{product.reviews} vendidos</span>
							{product.brand && <><span >|</span><span>{product.brand}</span></>}
						</div>

						{/* Título do Produto */}
						<h1 style={{
							fontSize: '22px',
							fontWeight: '400',
							color: '#333',
							margin: '0 0 16px 0',
							lineHeight: '1.3'
						}}>
							{product.title}
						</h1>

						{/* Rating */}
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							marginBottom: '20px',
							paddingBottom: '20px',
							borderBottom: '1px solid #f0f0f0'
						}}>
							<div style={{ display: 'flex', gap: '2px' }}>
								{renderStars(Math.floor(product.rating))}
							</div>
							<span style={{ color: '#666', fontSize: '13px' }}>
								{product.rating}
							</span>
							<span style={{ color: '#3483fa', fontSize: '13px', cursor: 'pointer' }}>
								({product.reviews} avaliações)
							</span>
						</div>

						{/* Preço */}
						<div style={{ marginBottom: '24px' }}>
							{product.oldPrice && (
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									marginBottom: '8px'
								}}>
									<span style={{
										fontSize: '16px',
										color: '#999',
										textDecoration: 'line-through'
									}}>
										{formatCurrency(product.oldPrice)}
									</span>
									<span style={{
										padding: '4px 8px',
										backgroundColor: '#e8f5e9',
										color: '#1a6e1a',
										borderRadius: '4px',
										fontSize: '13px',
										fontWeight: '600'
									}}>
										{product.discount}% OFF
									</span>
								</div>
							)}
							<div style={{
								display: 'flex',
								alignItems: 'baseline',
								gap: '8px',
								marginBottom: '8px'
							}}>
								<span style={{
									fontSize: '36px',
									fontWeight: '300',
									color: '#333'
								}}>
									{formatCurrency(product.price).split(',')[0]}
								</span>
								<span style={{
									fontSize: '20px',
									fontWeight: '300',
									color: '#333'
								}}>
									{formatCurrency(product.price).split(',')[1] ? ',' + formatCurrency(product.price).split(',')[1] : ''}
								</span>
							</div>
							<div style={{
								fontSize: '16px',
								color: '#1a6e1a',
								marginBottom: '8px'
							}}>
								em <span style={{ fontWeight: '600' }}>12x {formatCurrency(product.price / 12)} sem juros</span>
							</div>
							<div style={{
								fontSize: '14px',
								color: '#1a6e1a',
								marginBottom: '8px'
							}}>
								Frete grátis para todo o país
							</div>
						</div>

						{/* Stock */}
						<div style={{
							padding: '12px',
							backgroundColor: product.stock > 10 ? '#e8f5e9' : '#fff3e0',
							borderRadius: '6px',
							marginBottom: '20px',
							fontSize: '14px'
						}}>
							<span style={{
								color: product.stock > 10 ? '#1a6e1a' : '#f57c00',
								fontWeight: '500'
							}}>
								{product.stock > 10
									? `✓ Estoque disponível`
									: `⚠ Últimas ${product.stock} unidades!`
								}
							</span>
						</div>

						{/* Quantidade */}
						<div style={{ marginBottom: '20px' }}>
							<label style={{
								display: 'block',
								marginBottom: '8px',
								fontWeight: '500',
								fontSize: '14px',
								color: '#333'
							}}>
								Quantidade:
							</label>
							<div style={{
								display: 'inline-flex',
								alignItems: 'center',
								border: '1px solid #ddd',
								borderRadius: '6px',
								overflow: 'hidden',
								backgroundColor: 'white'
							}}>
								<button
									onClick={decrementQuantity}
									disabled={quantity <= 1}
									style={{
										width: '35px',
										height: '35px',
										border: 'none',
										backgroundColor: 'transparent',
										cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
										fontSize: '16px',
										color: quantity <= 1 ? '#ccc' : '#333'
									}}
								>
									−
								</button>
								<div style={{
									minWidth: '45px',
									height: '35px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderLeft: '1px solid #ddd',
									borderRight: '1px solid #ddd',
									fontWeight: '400',
									fontSize: '15px'
								}}>
									{quantity}
								</div>
								<button
									onClick={incrementQuantity}
									disabled={quantity >= product.stock}
									style={{
										width: '35px',
										height: '35px',
										border: 'none',
										backgroundColor: 'transparent',
										cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
										fontSize: '16px',
										color: quantity >= product.stock ? '#ccc' : '#333'
									}}
								>
									+
								</button>
							</div>
							<div style={{
								marginTop: '8px',
								fontSize: '13px',
								color: '#666'
							}}>
								({product.stock} disponíveis)
							</div>
						</div>

						{/* Botões de Ação */}
						<button
							onClick={handleAddToCart}
							disabled={product.stock === 0}
							style={{
								width: '100%',
								padding: '14px',
								backgroundColor: product.stock === 0 ? '#ccc' : '#3483fa',
								color: 'white',
								border: 'none',
								borderRadius: '6px',
								fontSize: '16px',
								fontWeight: '500',
								cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
								marginBottom: '12px',
								transition: 'background-color 0.2s'
							}}
							onMouseEnter={(e) => {
								if (product.stock > 0) {
									e.currentTarget.style.backgroundColor = '#2968c8';
								}
							}}
							onMouseLeave={(e) => {
								if (product.stock > 0) {
									e.currentTarget.style.backgroundColor = '#3483fa';
								}
							}}
						>
							{product.stock === 0 ? 'Produto Indisponível' : 'Comprar agora'}
						</button>

						<button
							onClick={handleAddToCart}
							disabled={product.stock === 0}
							style={{
								width: '100%',
								padding: '14px',
								backgroundColor: 'white',
								color: '#3483fa',
								border: '1px solid #3483fa',
								borderRadius: '6px',
								fontSize: '16px',
								fontWeight: '500',
								cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
								marginBottom: '20px',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								if (product.stock > 0) {
									e.currentTarget.style.backgroundColor = '#f5f7fa';
								}
							}}
							onMouseLeave={(e) => {
								if (product.stock > 0) {
									e.currentTarget.style.backgroundColor = 'white';
								}
							}}
						>
							Adicionar ao carrinho
						</button>

						{/* Benefícios */}
						<div style={{
							padding: '16px 0',
							borderTop: '1px solid #f0f0f0'
						}}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								marginBottom: '12px'
							}}>
								<IoShieldCheckmarkOutline size={24} color="#1a6e1a" />
								<div>
									<div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
										Compra Garantida
									</div>
									<div style={{ fontSize: '12px', color: '#666' }}>
										Receba o produto ou devolvemos seu dinheiro
									</div>
								</div>
							</div>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px'
							}}>
								<IoStorefrontOutline size={24} color="#3483fa" />
								<div>
									<div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
										Devolução grátis
									</div>
									<div style={{ fontSize: '12px', color: '#666' }}>
										Você tem 7 dias a partir da data de recebimento
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Informações do Vendedor */}
				<div style={{
					backgroundColor: 'white',
					borderRadius: '8px',
					padding: '24px',
					marginBottom: '16px'
				}}>
					<h2 style={{
						fontSize: '18px',
						fontWeight: '600',
						color: '#333',
						marginBottom: '20px'
					}}>
						Informações sobre o vendedor
					</h2>
					<div style={{
						display: 'flex',
						alignItems: 'flex-start',
						gap: '20px',
						marginBottom: '20px'
					}}>
						<img
							src={product.seller.logo}
							alt={product.seller.name}
							style={{
								width: '60px',
								height: '60px',
								objectFit: 'contain',
								borderRadius: '50%'
							}}
						/>
						<div style={{ flex: 1 }}>
							<div style={{
								fontSize: '16px',
								fontWeight: '600',
								color: '#333',
								marginBottom: '8px'
							}}>
								{product.seller.name}
							</div>
							{product.seller.experience && (
								<div style={{
									fontSize: '13px',
									color: '#1a6e1a',
									fontWeight: '600',
									marginBottom: '8px'
								}}>
									{product.seller.experience}
								</div>
							)}
							<div style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								fontSize: '13px',
								color: '#666'
							}}>
								{product.seller.location && (
									<>
										<span>{product.seller.location}</span>
										<span>|</span>
									</>
								)}
								<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
									<IoStar color="#1a6e1a" size={16} />
									<span>{product.seller.rating}</span>
								</div>
							</div>
						</div>
					</div>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
						gap: '16px',
						paddingTop: '20px',
						borderTop: '1px solid #f0f0f0'
					}}>
						<div style={{ textAlign: 'center' }}>
							<div style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>{product.seller.sales}</div>
							<div style={{ fontSize: '12px', color: '#666' }}>Vendas nos últimos 60 dias</div>
						</div>
						<div style={{ textAlign: 'center' }}>
							<div style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
								<IoChatbubbleOutline style={{ color: '#1a6e1a', verticalAlign: 'middle', marginRight: '4px' }} />
								Ótimo
							</div>
							<div style={{ fontSize: '12px', color: '#666' }}>Presta um bom atendimento</div>
						</div>
						<div style={{ textAlign: 'center' }}>
							<div style={{ fontSize: '20px', fontWeight: '600', color: '#333' }}>
								<IoCheckmarkCircleOutline style={{ color: '#1a6e1a', verticalAlign: 'middle', marginRight: '4px' }} />
								Rápido
							</div>
							<div style={{ fontSize: '12px', color: '#666' }}>Entrega os produtos no prazo</div>
						</div>
					</div>
				</div>

				{/* O que você precisa saber */}
				{product.features && product.features.length > 0 && (
					<div style={{
						backgroundColor: 'white',
						borderRadius: '8px',
						padding: '32px',
						marginBottom: '16px'
					}}>
						<h2 style={{
							fontSize: '20px',
							fontWeight: '600',
							color: '#333',
							marginBottom: '24px'
						}}>
							O que você precisa saber sobre este produto
						</h2>
						<ul style={{
							listStyle: 'none',
							padding: 0,
							margin: 0,
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '16px'
						}}>
							{product.features.map((feature, index) => (
								<li key={index} style={{
									display: 'flex',
									alignItems: 'flex-start',
									gap: '12px',
									fontSize: '15px',
									color: '#666'
								}}>
									<IoCheckmarkCircleOutline size={20} color="#1a6e1a" style={{ flexShrink: 0, marginTop: '3px' }} />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</div>
				)}
				<div style={{
					backgroundColor: 'white',
					borderRadius: '8px',
					padding: '32px',
					marginBottom: '16px'
				}}>
					<h2 style={{
						fontSize: '20px',
						fontWeight: '600',
						color: '#333',
						marginBottom: '24px'
					}}>
						Descrição
					</h2>
					<p style={{
						fontSize: '15px',
						lineHeight: '1.8',
						color: '#666',
						marginBottom: '0'
					}}>
						{product.description}
					</p>
				</div>

				{/* Características Técnicas */}
				<div style={{
					backgroundColor: 'white',
					borderRadius: '8px',
					padding: '32px'
				}}>
					<h2 style={{
						fontSize: '20px',
						fontWeight: '600',
						color: '#333',
						marginBottom: '24px'
					}}>
						Características principais
					</h2>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
						gap: '16px',
						border: '1px solid #eee',
						borderRadius: '8px',
						padding: '24px'
					}}>
						{product.specs.map((spec, index) => (
							<div
								key={index}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									padding: '12px 0',
									borderBottom: index < product.specs.length - 1 ? '1px solid #f0f0f0' : 'none'
								}}
							>
								<div style={{
									fontSize: '14px',
									fontWeight: '600',
									color: '#333',
								}}>
									{spec.label}
								</div>
								<div style={{
									fontSize: '14px',
									color: '#666'
								}}>
									{spec.value}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Opiniões sobre o produto */}
				{product.opinions && product.opinions.length > 0 && (
					<div style={{
						backgroundColor: 'white',
						borderRadius: '8px',
						padding: '32px',
						marginTop: '16px'
					}}>
						<h2 style={{
							fontSize: '20px',
							fontWeight: '600',
							color: '#333',
							marginBottom: '24px'
						}}>
							Opiniões sobre o produto
						</h2>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '24px',
							paddingBottom: '24px',
							borderBottom: '1px solid #f0f0f0',
							marginBottom: '24px'
						}}>
							<div style={{ textAlign: 'center' }}>
								<div style={{ fontSize: '48px', fontWeight: '300', color: '#333' }}>{product.rating.toFixed(1)}</div>
								<div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
									{renderStars(Math.round(product.rating))}
								</div>
								<div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
									Média entre {product.reviews} opiniões
								</div>
							</div>
							<div style={{ flex: 1 }}>
								{/* Aqui poderia ir um gráfico de barras com a distribuição das notas */}
							</div>
						</div>

						{product.opinions.slice(0, 3).map((opinion) => (
							<div key={opinion.id} style={{
								padding: '20px 0',
								borderBottom: '1px solid #f0f0f0'
							}}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
									<div style={{ display: 'flex' }}>{renderStars(opinion.rating)}</div>
									<div style={{ fontWeight: '600', color: '#333' }}>{opinion.title}</div>
								</div>
								<p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>{opinion.comment}</p>
								<span style={{ fontSize: '13px', color: '#999' }}>Por {opinion.user}</span>
							</div>
						))}
						<button style={{
							marginTop: '24px',
							padding: '12px 24px',
							backgroundColor: 'transparent',
							color: '#3483fa',
							border: '1px solid #3483fa',
							borderRadius: '6px',
							cursor: 'pointer',
							fontWeight: '500'
						}}>
							Ver todas as opiniões
						</button>
					</div>
				)}

				{/* Perguntas e Respostas */}
				{product.questions && product.questions.length > 0 && (
					<div style={{
						backgroundColor: 'white',
						borderRadius: '8px',
						padding: '32px',
						marginTop: '16px'
					}}>
						<h2 style={{
							fontSize: '20px',
							fontWeight: '600',
							color: '#333',
							marginBottom: '24px'
						}}>
							Perguntas e respostas
						</h2>
						<div style={{ marginBottom: '24px' }}>
							<h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>Qual a sua dúvida?</h3>
							<div style={{ position: 'relative' }}>
								<input
									type="text"
									placeholder="Escreva sua pergunta..."
									style={{
										width: '100%',
										padding: '12px 40px 12px 16px',
										borderRadius: '6px',
										border: '1px solid #ddd',
										fontSize: '15px'
									}}
								/>
								<IoSearch size={20} color="#999" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
							</div>
						</div>

						<h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Últimas perguntas</h3>
						{product.questions.map((q) => (
							<div key={q.id} style={{ marginBottom: '20px' }}>
								<div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
									<IoChatbubbleOutline size={18} color="#666" />
									<p style={{ margin: 0, fontSize: '15px', color: '#333' }}>{q.question}</p>
								</div>
								<div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '26px' }}>
									<span style={{ color: '#999', fontSize: '20px', lineHeight: '1' }}>↳</span>
									<p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{q.answer}</p>
								</div>
							</div>
						))}
						<button style={{
							marginTop: '12px',
							padding: '12px 24px',
							backgroundColor: 'transparent',
							color: '#3483fa',
							border: '1px solid #3483fa',
							borderRadius: '6px',
							cursor: 'pointer',
							fontWeight: '500'
						}}>
							Ver todas as perguntas
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetails;
