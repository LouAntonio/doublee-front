import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const OffersSection = () => {

    // Mock data para ofertas
    const dealOfTheDay = {
        id: 1,
        title: 'Bicicleta Ergométrica Fitness Para Cardio E Musculação 6kg Inercia Com Base Cor...',
        oldPrice: 1115600,
        price: 1115500,
        discount: 43,
        freeShipping: false,
        image: 'https://via.placeholder.com/300x300/f5f5f5/666?text=Produto+Destaque'
    };

    const offers = [
        {
            id: 2,
            title: 'Kit 2câmera Ip Icsee Prova D\'água Infravermelho Exter...',
            oldPrice: 339,
            price: 192,
            discount: 43,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Camera+IP'
        },
        {
            id: 3,
            title: 'Bicicleta Ergométrica Spinning Mecânica Roda...',
            oldPrice: 2399,
            price: 1499,
            discount: 37,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Bicicleta'
        },
        {
            id: 4,
            title: 'Smart Tv 58 Philco Led 4k Google Tv Hdr10 P58kga',
            oldPrice: 3284,
            price: 2089,
            discount: 36,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Smart+TV'
        },
        {
            id: 5,
            title: 'Tablet Samsung Galaxy Tab A9+ Wi-fi 64gb Ram 8gb Tel...',
            oldPrice: 1999,
            price: 1079,
            discount: 46,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Tablet'
        },
        {
            id: 6,
            title: 'Notebook Dell Inspiron 15 Intel Core i5',
            oldPrice: 3499,
            price: 2299,
            discount: 34,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Notebook'
        },
        {
            id: 7,
            title: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
            oldPrice: 299,
            price: 179,
            discount: 40,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Fone+JBL'
        },
        {
            id: 8,
            title: 'Aspirador de Pó Robô Inteligente Wi-Fi',
            oldPrice: 1899,
            price: 1199,
            discount: 37,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=Aspirador'
        },
        {
            id: 9,
            title: 'Console PlayStation 5 Slim Digital Edition',
            oldPrice: 3799,
            price: 2599,
            discount: 32,
            freeShipping: false,
            image: 'https://via.placeholder.com/200x200/f5f5f5/666?text=PS5+Slim'
        }
    ];

    const firstRow = offers.slice(0, 4);
    const secondRow = offers.slice(4, 8);

    return (
        <section className="offers-section" style={{ backgroundColor: '#ededed', padding: '20px 0' }}>
            <div className="offers-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <div className="offers-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Deal of the Day - Left Side */}
                    <div className="offers-deal" style={{
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
                        <ProductCard product={dealOfTheDay} />
                    </div>

                    {/* Offers Grid - Right Side */}
                    <div className="offers-grid-section" style={{
                        flex: '1',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        padding: '24px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        minWidth: '0'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '8px',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#333',
                                margin: 0
                            }}>
                                Ofertas
                            </h2>
                            <Link to="/ofertas" style={{
                                fontSize: '14px',
                                color: '#3483fa',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}>
                                Mostrar todas as ofertas
                            </Link>
                        </div>

                        {/* Row 1 */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '12px'
                        }}>
                            {firstRow.map((offer) => (
                                <ProductCard key={offer.id} product={offer} />
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            backgroundColor: '#eee',
                            margin: '4px 0 12px 0'
                        }} />

                        {/* Row 2 */}
                        <div style={{
                            display: 'flex',
                            gap: '12px'
                        }}>
                            {secondRow.map((offer) => (
                                <ProductCard key={offer.id} product={offer} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OffersSection;
