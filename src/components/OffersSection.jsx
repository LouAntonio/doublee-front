import React, { useState, useEffect } from 'react';

const OffersSection = () => {
	const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	// Mock data para ofertas
	const dealOfTheDay = {
		id: 1,
		title: 'Bicicleta Ergométrica Fitness Para Cardio E Musculação 6kg Inercia Com Base Cor...',
		oldPrice: 1094,
		price: 619.99,
		discount: 43,
		installments: '12x R$ 59,95',
		freeShipping: true,
		image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Produto+Destaque'
	};

	const offers = [
		{
			id: 2,
			title: 'Kit 2câmera Ip Icsee Prova D\'água Infravermelho Exter...',
			oldPrice: 339,
			price: 192,
			discount: 43,
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Camera+IP'
		},
		{
			id: 3,
			title: 'Bicicleta Ergométrica Spinning Mecânica Roda...',
			oldPrice: 2399,
			price: 1499,
			discount: 37,
			installments: '10x R$ 149,90 sem juros',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Bicicleta'
		},
		{
			id: 4,
			title: 'Smart Tv 58 Philco Led 4k Google Tv Hdr10 P58kga',
			oldPrice: 3284,
			price: 2089,
			discount: 36,
			installments: 'ou R$ 2.199 em 10x',
			installmentsNoInterest: 'R$ 219,90 sem juros',
			pix: 'ou R$ 2.089 em Pix',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Smart+TV'
		},
		{
			id: 5,
			title: 'Tablet Samsung Galaxy Tab A9+ Wi-fi 64gb Ram 8gb Tel...',
			oldPrice: 1999,
			price: 1079,
			discount: 46,
			installments: 'ou R$ 1.199 em 10x R$ 119,90',
			installmentsNoInterest: 'sem juros',
			pix: 'ou R$ 1.079 em Pix',
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Tablet'
		},
		{
			id: 6,
			title: 'Notebook Dell Inspiron 15 Intel Core i5',
			oldPrice: 3499,
			price: 2299,
			discount: 34,
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Notebook'
		},
		{
			id: 7,
			title: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
			oldPrice: 299,
			price: 179,
			discount: 40,
			freeShipping: true,
			image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Fone+JBL'
		}
	];

	// Ajusta itemsPerPage de acordo com a largura da tela (sempre entre 1 e 4)
	useEffect(() => {
		const calculate = () => {
			const w = window.innerWidth;
			if (w >= 1200) return 4;
			if (w >= 900) return 3;
			if (w >= 600) return 2;
			return 1;
		};

		const update = () => {
			const next = calculate();
			setItemsPerPage((current) => {
				if (current !== next) return next;
				return current;
			});
			setCurrentOfferIndex(0);
		};

		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const totalPages = Math.ceil(offers.length / itemsPerPage);

	const nextOffers = () => {
		setCurrentOfferIndex((prev) => (prev + 1) % totalPages);
	};

	const prevOffers = () => {
		setCurrentOfferIndex((prev) => (prev - 1 + totalPages) % totalPages);
	};

	const getCurrentOffers = () => {
		const start = currentOfferIndex * itemsPerPage;
		return offers.slice(start, start + itemsPerPage);
	};

	return (
		<section style={{ backgroundColor: '#ededed', padding: '20px 0' }}>
			<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
				<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
					{/* Deal of the Day - Left Side */}
					<div style={{
						flex: '0 0 320px',
						backgroundColor: '#fff',
						borderRadius: '6px',
						padding: '24px',
						boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
					}}>
						<h2 style={{
							fontSize: '24px',
							fontWeight: '600',
							marginBottom: '20px',
							color: '#333'
						}}>
							Oferta do dia
						</h2>
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '16px'
						}}>
							<div style={{
								width: '100%',
								aspectRatio: '1',
								backgroundColor: '#f5f5f5',
								borderRadius: '4px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
								position: 'relative'
							}}>
								<img 
									src={dealOfTheDay.image} 
									alt={dealOfTheDay.title}
									style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
								/>
								{dealOfTheDay.discount && (
									<div style={{
										position: 'absolute',
										top: '12px',
										right: '12px',
										backgroundColor: '#fff',
										padding: '4px 8px',
										borderRadius: '4px',
										fontSize: '14px',
										fontWeight: '600',
										color: '#00a650'
									}}>
										{dealOfTheDay.discount}% OFF
									</div>
								)}
							</div>
							<div style={{ width: '100%' }}>
								<h3 style={{
									fontSize: '14px',
									color: '#666',
									marginBottom: '8px',
									fontWeight: '400',
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden'
								}}>
									{dealOfTheDay.title}
								</h3>
								<div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
									<span style={{
										fontSize: '14px',
										color: '#999',
										textDecoration: 'line-through'
									}}>
										R$ {dealOfTheDay.oldPrice}
									</span>
								</div>
								<div style={{ marginBottom: '8px' }}>
									<span style={{
										fontSize: '32px',
										fontWeight: '400',
										color: '#333'
									}}>
										R$ {dealOfTheDay.price.toFixed(2).replace('.', ',')}
									</span>
									<span style={{
										fontSize: '14px',
										color: '#00a650',
										marginLeft: '8px',
										fontWeight: '600'
									}}>
										{dealOfTheDay.discount}% OFF
									</span>
								</div>
								{dealOfTheDay.installments && (
									<p style={{
										fontSize: '14px',
										color: '#666',
										marginBottom: '8px'
									}}>
										{dealOfTheDay.installments}
									</p>
								)}
								{dealOfTheDay.freeShipping && (
									<div style={{
										fontSize: '14px',
										color: '#00a650',
										fontWeight: '600'
									}}>
										Frete grátis <span style={{ fontWeight: '400', color: '#666' }}>por ser sua primeira compra</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Offers Carousel - Right Side */}
					<div style={{
						flex: '1',
						backgroundColor: '#fff',
						borderRadius: '6px',
						padding: '24px',
						boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
						minWidth: '0'
					}}>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '20px'
						}}>
							<h2 style={{
								fontSize: '24px',
								fontWeight: '600',
								color: '#333'
							}}>
								Ofertas
							</h2>
							<a href="#" style={{
								fontSize: '14px',
								color: '#3483fa',
								textDecoration: 'none',
								fontWeight: '600'
							}}>
								Mostrar todas as ofertas
							</a>
						</div>

						<div style={{ position: 'relative' }}>
							{/* Navigation Arrows */}
							{currentOfferIndex > 0 && (
								<button
									onClick={prevOffers}
									style={{
										position: 'absolute',
										left: '-12px',
										top: '50%',
										transform: 'translateY(-50%)',
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										backgroundColor: '#fff',
										border: 'none',
										boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										zIndex: 1,
										transition: 'box-shadow 0.2s'
									}}
									onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'}
									onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
								>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path d="M15 18l-6-6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</button>
							)}
							
							{currentOfferIndex < totalPages - 1 && (
								<button
									onClick={nextOffers}
									style={{
										position: 'absolute',
										right: '-12px',
										top: '50%',
										transform: 'translateY(-50%)',
										width: '40px',
										height: '40px',
										borderRadius: '50%',
										backgroundColor: '#fff',
										border: 'none',
										boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										zIndex: 1,
										transition: 'box-shadow 0.2s'
									}}
									onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'}
									onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
								>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path d="M9 18l6-6-6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</button>
							)}

							{/* Offers Grid */}
							<div style={{ overflow: 'hidden' }}>
								<div style={{
									display: 'flex',
									gap: '16px',
									alignItems: 'stretch',
									flexWrap: 'nowrap'
								}}>
								{getCurrentOffers().map((offer) => (
									<div
										key={offer.id}
										style={{
											cursor: 'pointer',
											transition: 'transform 0.2s',
											padding: '12px',
											borderRadius: '4px',
											flex: `0 0 ${100 / itemsPerPage}%`,
											maxWidth: `${100 / itemsPerPage}%`,
											boxSizing: 'border-box'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = 'translateY(-4px)';
											e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = 'none';
										}}
									>
										<div style={{
											width: '100%',
											aspectRatio: '1',
											backgroundColor: '#f5f5f5',
											borderRadius: '4px',
											marginBottom: '12px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											overflow: 'hidden'
										}}>
											<img 
												src={offer.image} 
												alt={offer.title}
												style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
											/>
										</div>
										<h3 style={{
											fontSize: '13px',
											color: '#666',
											marginBottom: '8px',
											fontWeight: '400',
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
											minHeight: '2.6em'
										}}>
											{offer.title}
										</h3>
										{offer.oldPrice && (
											<div style={{
												fontSize: '13px',
												color: '#999',
												textDecoration: 'line-through',
												marginBottom: '4px'
											}}>
												R$ {offer.oldPrice}
											</div>
										)}
										<div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
											<span style={{
												fontSize: '24px',
												fontWeight: '400',
												color: '#333'
											}}>
												R$ {offer.price.toLocaleString('pt-BR')}
											</span>
											{offer.discount && (
												<span style={{
													fontSize: '13px',
													color: '#00a650',
													fontWeight: '600'
												}}>
													{offer.discount}% OFF
												</span>
											)}
										</div>
										{offer.installments && (
											<p style={{
												fontSize: '12px',
												color: '#666',
												marginBottom: '4px'
											}}>
												{offer.installments}
											</p>
										)}
										{offer.installmentsNoInterest && (
											<p style={{
												fontSize: '12px',
												color: '#666',
												marginBottom: '4px'
											}}>
												{offer.installmentsNoInterest}
											</p>
										)}
										{offer.pix && (
											<p style={{
												fontSize: '12px',
												color: '#00a650',
												marginBottom: '4px'
											}}>
												{offer.pix}
											</p>
										)}
										{offer.freeShipping && (
											<div style={{
												fontSize: '13px',
												color: '#00a650',
												fontWeight: '600'
											}}>
												Frete grátis <span style={{ fontWeight: '400', color: '#666' }}>por ser sua primeira compra</span>
											</div>
										)}
									</div>
								))}
								</div>
							</div>

							{/* Pagination Dots */}
							<div style={{
								display: 'flex',
								justifyContent: 'center',
								gap: '8px',
								marginTop: '20px'
							}}>
								{Array.from({ length: totalPages }).map((_, idx) => (
									<button
										key={idx}
										onClick={() => setCurrentOfferIndex(idx)}
										style={{
											width: '8px',
											height: '8px',
											borderRadius: '50%',
											border: 'none',
											backgroundColor: idx === currentOfferIndex ? '#3483fa' : '#d9d9d9',
											cursor: 'pointer',
											padding: 0,
											transition: 'background-color 0.3s'
										}}
										aria-label={`Página ${idx + 1}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OffersSection;
