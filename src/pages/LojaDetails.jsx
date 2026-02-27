import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    IoStarSharp, IoStar, IoStarOutline, IoChevronBack, IoChevronForward,
    IoStorefrontOutline, IoShieldCheckmarkOutline, IoCallOutline,
    IoMailOutline, IoLocationOutline, IoTimeOutline, IoSearchOutline,
    IoCheckmarkCircleOutline, IoHeartOutline, IoHeart, IoShareSocialOutline,
    IoCartOutline, IoChatbubbleOutline, IoGridOutline, IoListOutline,
} from 'react-icons/io5';
import { FaBoxOpen, FaUsers, FaAward } from 'react-icons/fa';
import Header from '../components/Header';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { notyf } from '../utils/notyf';

/* ─── Store data (mirrors Lojas.jsx) ─────────────────────────────────── */
const stores = [
    {
        id: 1,
        name: 'Kero Supermercado',
        category: 'Supermercado',
        rating: 4.8,
        reviews: 1240,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/e63946/fff?text=KS',
        products: 1800,
        badge: 'Destaque',
        description: 'O Kero Supermercado é uma das maiores redes de supermercados de Angola. Presente em todo o território nacional, oferecemos produtos de alta qualidade com os melhores preços. Comprometidos com a satisfação do nosso cliente desde 2002.',
        address: 'Av. 4 de Fevereiro, 123 – Luanda',
        phone: '+244 923 456 789',
        email: 'cliente@kero.ao',
        hours: 'Seg–Sáb 8h–22h · Dom 9h–20h',
        founded: '2002',
        employees: '5000+',
        ratingDistribution: { 5: 820, 4: 280, 3: 98, 2: 30, 1: 12 },
        opinions: [
            { id: 1, user: 'Ana Luísa', avatar: 'AL', rating: 5, title: 'Excelente atendimento!', comment: 'Sempre encontro tudo o que preciso. Preços acessíveis e staff simpático.', date: '20 Fev. 2026', helpful: 42, verified: true },
            { id: 2, user: 'Carlos M.', avatar: 'CM', rating: 4, title: 'Bom mas pode melhorar.', comment: 'Boa variedade de produtos. As vezes falta stock em alguns artigos populares.', date: '14 Jan. 2026', helpful: 18, verified: true },
            { id: 3, user: 'Sofia T.', avatar: 'ST', rating: 5, title: 'A minha loja favorita!', comment: 'Compro aqui há anos e nunca me decepcionou. Recomendo a todos.', date: '5 Jan. 2026', helpful: 35, verified: false },
        ],
    },
    {
        id: 2,
        name: 'Shoprite Angola',
        category: 'Supermercado',
        rating: 4.6,
        reviews: 980,
        image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/e63946/fff?text=SR',
        products: 2200,
        badge: null,
        description: 'Shoprite Angola é parte da maior cadeia de supermercados africana. Oferece uma vasta gama de produtos alimentares, de higiene e muito mais, com qualidade e preço justo.',
        address: 'Belas Shopping, Talatona – Luanda',
        phone: '+244 912 345 678',
        email: 'angola@shoprite.com',
        hours: 'Seg–Dom 8h–22h',
        founded: '2008',
        employees: '3000+',
        ratingDistribution: { 5: 620, 4: 220, 3: 94, 2: 28, 1: 18 },
        opinions: [
            { id: 1, user: 'Pedro A.', avatar: 'PA', rating: 5, title: 'Muito bom!', comment: 'Grande variedade e produtos sempre frescos. Tem estacionamento, o que é uma mais‑valia.', date: '18 Fev. 2026', helpful: 31, verified: true },
            { id: 2, user: 'Maria C.', avatar: 'MC', rating: 4, title: 'Bom supermercado.', comment: 'Preços razoáveis e boa localização. As caixas às vezes ficam com filas grandes.', date: '9 Fev. 2026', helpful: 14, verified: true },
        ],
    },
    {
        id: 3,
        name: 'TechZone Angola',
        category: 'Tecnologia',
        rating: 4.7,
        reviews: 530,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/0077b6/fff?text=TZ',
        products: 420,
        badge: 'Novo',
        description: 'TechZone é a loja de referência em tecnologia em Angola. Smartphones, laptops, acessórios e gadgets das melhores marcas mundiais, com garantia oficial e suporte técnico especializado.',
        address: 'Shopping Avenida, Ingombota – Luanda',
        phone: '+244 934 567 890',
        email: 'info@techzone.ao',
        hours: 'Seg–Sáb 9h–20h',
        founded: '2020',
        employees: '150+',
        ratingDistribution: { 5: 340, 4: 130, 3: 44, 2: 10, 1: 6 },
        opinions: [
            { id: 1, user: 'Rui B.', avatar: 'RB', rating: 5, title: 'Os melhores gadgets!', comment: 'Comprei um smartphone e o atendimento foi excelente. Vieram com nota e garantia.', date: '22 Fev. 2026', helpful: 56, verified: true },
            { id: 2, user: 'Inês F.', avatar: 'IF', rating: 4, title: 'Boa loja de tech.', comment: 'Grande variedade mas alguns produtos são importados e demoram a chegar.', date: '1 Fev. 2026', helpful: 20, verified: true },
        ],
    },
    {
        id: 4,
        name: 'Moda Fashion Store',
        category: 'Moda',
        rating: 4.5,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/f77f00/fff?text=MF',
        products: 680,
        badge: null,
        description: 'Moda Fashion Store traz as últimas tendências da moda para Angola. Roupas, calçados e acessórios de marcas nacionais e internacionais, combinando estilo e qualidade.',
        address: 'Av. Comandante Gika – Luanda',
        phone: '+244 945 678 901',
        email: 'moda@fashionstore.ao',
        hours: 'Seg–Sáb 9h–21h · Dom 10h–18h',
        founded: '2015',
        employees: '80+',
        ratingDistribution: { 5: 190, 4: 90, 3: 28, 2: 8, 1: 4 },
        opinions: [
            { id: 1, user: 'Joana P.', avatar: 'JP', rating: 5, title: 'Adoro esta loja!', comment: 'Peças lindas e de qualidade. As vendedoras são muito prestativas.', date: '25 Jan. 2026', helpful: 29, verified: true },
        ],
    },
    {
        id: 5,
        name: 'Casa & Lar Angola',
        category: 'Casa e Jardim',
        rating: 4.4,
        reviews: 215,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/2d6a4f/fff?text=CL',
        products: 910,
        badge: null,
        description: 'Casa & Lar Angola é a sua parceira para tornar a sua casa mais bonita e confortável. Móveis, decoração, jardinagem e muito mais com ótima relação qualidade-preço.',
        address: 'Zona Industrial, Viana – Luanda',
        phone: '+244 956 789 012',
        email: 'casaelar@angola.ao',
        hours: 'Seg–Sáb 8h–18h',
        founded: '2012',
        employees: '200+',
        ratingDistribution: { 5: 120, 4: 68, 3: 18, 2: 6, 1: 3 },
        opinions: [
            { id: 1, user: 'Manuel S.', avatar: 'MS', rating: 4, title: 'Bons produtos.', comment: 'Boa variedade de móveis e preços competitivos. Entrega rápida.', date: '10 Jan. 2026', helpful: 15, verified: true },
        ],
    },
    {
        id: 6,
        name: 'Beleza & Cosméticos',
        category: 'Beleza e Saúde',
        rating: 4.9,
        reviews: 740,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/c77dff/fff?text=BC',
        products: 375,
        badge: 'Destaque',
        description: 'Beleza & Cosméticos é a loja especializada em produtos de beleza e cuidado pessoal. Marcas premium nacionais e internacionais, com consultoras especializadas à sua disposição.',
        address: 'Av. Lenine, 456 – Luanda',
        phone: '+244 967 890 123',
        email: 'beleza@cosmeticos.ao',
        hours: 'Seg–Sáb 9h–21h',
        founded: '2016',
        employees: '60+',
        ratingDistribution: { 5: 560, 4: 130, 3: 38, 2: 8, 1: 4 },
        opinions: [
            { id: 1, user: 'Catarina L.', avatar: 'CL', rating: 5, title: 'A melhor loja de beleza!', comment: 'Produto original, entrega super rápida e embalagem impecável. Já é a minha loja preferida!', date: '24 Fev. 2026', helpful: 68, verified: true },
            { id: 2, user: 'Diana M.', avatar: 'DM', rating: 5, title: 'Maravilhoso!', comment: 'A consultora foi muito atenciosa e ajudou‑me a escolher os produtos certos para o meu tipo de pele.', date: '16 Fev. 2026', helpful: 44, verified: true },
        ],
    },
    {
        id: 7,
        name: 'ElectroMart',
        category: 'Electrónica',
        rating: 4.6,
        reviews: 460,
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/023e8a/fff?text=EM',
        products: 550,
        badge: null,
        description: 'ElectroMart é especialista em electrónica e electrodomésticos. Televisores, sistemas de som, máquinas de lavar e refrigeradores das melhores marcas, com instalação incluída.',
        address: 'Mutamba, Ingombota – Luanda',
        phone: '+244 978 901 234',
        email: 'info@electromart.ao',
        hours: 'Seg–Sáb 8h–20h',
        founded: '2010',
        employees: '250+',
        ratingDistribution: { 5: 290, 4: 110, 3: 44, 2: 12, 1: 4 },
        opinions: [
            { id: 1, user: 'António R.', avatar: 'AR', rating: 5, title: 'Ótima loja!', comment: 'Comprei uma TV e a instalação foi feita no mesmo dia. Atendimento incrível.', date: '20 Jan. 2026', helpful: 37, verified: true },
        ],
    },
    {
        id: 8,
        name: 'Sport Center Angola',
        category: 'Desporto',
        rating: 4.3,
        reviews: 190,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/f4a261/fff?text=SC',
        products: 300,
        badge: 'Novo',
        description: 'Sport Center Angola equipou atletas e aficionados do desporto desde a sua fundação. Equipamento de fitness, futebol, basquete, natação e muito mais com as melhores marcas do mundo.',
        address: 'Shopping Gamek, Talatona – Luanda',
        phone: '+244 989 012 345',
        email: 'sport@center.ao',
        hours: 'Seg–Dom 9h–21h',
        founded: '2022',
        employees: '40+',
        ratingDistribution: { 5: 100, 4: 62, 3: 20, 2: 6, 1: 2 },
        opinions: [
            { id: 1, user: 'Hélder N.', avatar: 'HN', rating: 4, title: 'Boa loja de desporto.', comment: 'Boa seleção de chuteiras e equipamentos de ginásio. Preços um pouco altos mas a qualidade compensa.', date: '8 Fev. 2026', helpful: 22, verified: true },
        ],
    },
    {
        id: 9,
        name: 'Livros & Cultura',
        category: 'Livros',
        rating: 4.7,
        reviews: 280,
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/6d4c41/fff?text=LC',
        products: 1200,
        badge: null,
        description: 'Livros & Cultura é o paraíso dos leitores angolanos. Mais de 1200 títulos nacionais e internacionais, papelaria, arte e material escolar. Promovemos a leitura e a cultura em Angola.',
        address: 'Av. Ho Chi Minh, 78 – Luanda',
        phone: '+244 912 123 456',
        email: 'livros@cultura.ao',
        hours: 'Seg–Sáb 9h–20h',
        founded: '2005',
        employees: '30+',
        ratingDistribution: { 5: 180, 4: 72, 3: 20, 2: 6, 1: 2 },
        opinions: [
            { id: 1, user: 'Filomena A.', avatar: 'FA', rating: 5, title: 'Adorei!', comment: 'Encontrei livros que não conseguia em lado nenhum. A equipa é muito culta e prestativa.', date: '12 Fev. 2026', helpful: 29, verified: true },
        ],
    },
    {
        id: 10,
        name: 'Auto Peças Angola',
        category: 'Automóvel',
        rating: 4.2,
        reviews: 145,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/495057/fff?text=AP',
        products: 860,
        badge: null,
        description: 'Auto Peças Angola é o fornecedor de referência para mecânicos e apaixonados por automóveis. Peças genuínas, acessórios e ferramentas para todas as marcas e modelos.',
        address: 'Zona Industrial, Viana – Luanda',
        phone: '+244 923 234 567',
        email: 'autopecas@angola.ao',
        hours: 'Seg–Sáb 7h–18h',
        founded: '2008',
        employees: '120+',
        ratingDistribution: { 5: 80, 4: 44, 3: 14, 2: 5, 1: 2 },
        opinions: [
            { id: 1, user: 'Kiluanje F.', avatar: 'KF', rating: 4, title: 'Bom stock.', comment: 'Encontrei a peça que precisava rapidamente. Atendimento técnico muito competente.', date: '3 Jan. 2026', helpful: 17, verified: true },
        ],
    },
    {
        id: 11,
        name: 'Brinquedos World',
        category: 'Brinquedos',
        rating: 4.5,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/e63946/fff?text=BW',
        products: 430,
        badge: null,
        description: 'Brinquedos World é o mundo da diversão para crianças de todas as idades. Jogos, bonecos, veículos, puzzles e muito mais das marcas mais amadas do mundo.',
        address: 'Belas Shopping, Talatona – Luanda',
        phone: '+244 934 345 678',
        email: 'hello@brinquedosworld.ao',
        hours: 'Seg–Dom 9h–21h',
        founded: '2018',
        employees: '55+',
        ratingDistribution: { 5: 190, 4: 88, 3: 24, 2: 6, 1: 2 },
        opinions: [
            { id: 1, user: 'Lurdes P.', avatar: 'LP', rating: 5, title: 'Os meus filhos adoram!', comment: 'Sempre que vamos ao shopping passamos aqui. Os brinquedos são de qualidade e os preços são bons.', date: '19 Fev. 2026', helpful: 33, verified: true },
        ],
    },
    {
        id: 12,
        name: 'Farmácia Saúde Viva',
        category: 'Beleza e Saúde',
        rating: 4.8,
        reviews: 620,
        image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=80&auto=format&fit=crop',
        logo: 'https://via.placeholder.com/120x120/2ec4b6/fff?text=FS',
        products: 950,
        badge: 'Destaque',
        description: 'Farmácia Saúde Viva cuida da sua saúde e bem-estar. Medicamentos, suplementos, dermocosméticos e produtos de higiene com aconselhamento farmacêutico gratuito.',
        address: 'Av. 21 de Janeiro, Maianga – Luanda',
        phone: '+244 945 456 789',
        email: 'saude@viva.ao',
        hours: 'Seg–Dom 24h',
        founded: '2011',
        employees: '180+',
        ratingDistribution: { 5: 400, 4: 160, 3: 44, 2: 12, 1: 4 },
        opinions: [
            { id: 1, user: 'Graça N.', avatar: 'GN', rating: 5, title: 'Excelente farmácia!', comment: 'O farmacêutico foi muito atencioso e explicou tudo detalhadamente. Preços justos.', date: '23 Fev. 2026', helpful: 52, verified: true },
            { id: 2, user: 'Tomás V.', avatar: 'TV', rating: 5, title: 'Sempre disponível.', comment: 'Funcionam 24h, o que é óptimo para urgências. Staff muito profissional.', date: '17 Jan. 2026', helpful: 40, verified: true },
        ],
    },
];

/* ─── Mock products per store ─────────────────────────────────────────── */
const generateProducts = (storeId, storeName, count = 8) => {
    const titles = {
        1: ['Arroz 5kg Esperança', 'Óleo Girassol 1L', 'Massa Esparguete 500g', 'Leite UHT 1L', 'Açúcar Branco 2kg', 'Frango Inteiro (Fresco)', 'Sabão em Pó 1kg', 'Café Moído 250g'],
        2: ['Pão de Forma Fatiado', 'Iogurte Natural 4un', 'Queijo Flamengo 300g', 'Sumo de Laranja 1L', 'Detergente Líquido 1L', 'Papel Higiénico 12un', 'Chá Verde 25 Saquetas', 'Biscoito Água e Sal'],
        3: ['Smartphone Samsung A55', 'Auscultadores Bluetooth', 'Carregador 65W USB-C', 'Teclado Mecânico RGB', 'Rato Sem Fio', 'Disco SSD 512GB', 'Cabo HDMI 2m', 'Webcam Full HD'],
        4: ['Vestido Floral Verão', 'Calças Jeans Slim', 'Camiseta Básica Algodão', 'Sandália Casual Feminina', 'Mochila Urbana', 'Cinturão de Couro', 'Boné Snapback', 'Sobretudo Elegante'],
        5: ['Sofá 3 Lugares', 'Mesa de Centro', 'Luminária de Pé', 'Tapete Sala 2x3m', 'Vaso Decorativo', 'Quadro Abstrato', 'Espelho Redondo 60cm', 'Prateleira Flutuante'],
        6: ['Protetor Solar FPS50', 'Sérum Vitamina C', 'Shampoo Anti-queda', 'Batom Matte Nude', 'Perfume Floral 50ml', 'Creme Hidratante 200ml', 'Máscara Capilar', 'Esmalte Gel'],
        7: ['Smart TV 55" 4K', 'Máquina de Lavar 8kg', 'Frigorífico Dupla Porta', 'Micro-ondas 20L', 'Aspirador Sem Fio', 'Ferro a Vapor', 'Batedeira 500W', 'Cafeteira Expresso'],
        8: ['Bola de Futebol Oficial', 'Chuteira Nike Vapor', 'Luvas de Guarda-redes', 'Halteres 10kg Par', 'Mochila Desportiva', 'Garrafa de Treino 1L', 'Corda de Saltar', 'Joelheira Elástica'],
        9: ['Dom Casmurro', 'O Pensador da Fome', 'Mindset – Carol Dweck', 'O Príncipezinho', 'Sapatos Pretos', 'Caderno Moleskine A5', 'Caneta Parker', 'Atlas de Angola'],
        10: ['Filtro de Óleo Universal', 'Pastilhas de Travão', 'Bateria 60Ah', 'Pneu 195/65 R15', 'Kit Ferramentas 72pcs', 'Faro LED H7', 'Limpador de Para-brisas', 'Cera de Polir 500ml'],
        11: ['LEGO City 500pcs', 'Boneca Bebé Chorão', 'Carro Controlo Remoto', 'Jogo de Tabuleiro', 'Scooter Criança', 'Kit de Pintura', 'Puzzle 1000 Peças', 'Pelúche Urso 50cm'],
        12: ['Vitamina C 1000mg', 'Paracetamol 500mg', 'Probiótico Infantil', 'Protetor Solar Rosto FPS70', 'Vitamina D3 2000UI', 'Magnésio Efervescente', 'Creme Cicatrizante', 'Colágeno Hidrolisado'],
    };
    const prices = [4990, 8490, 12990, 19900, 34990, 67500, 89900, 149900, 239900, 350000];
    return (titles[storeId] || Array.from({ length: count }, (_, i) => `Produto ${i + 1} – ${storeName}`))
        .slice(0, count)
        .map((title, idx) => ({
            id: idx + 1,
            title,
            price: prices[idx % prices.length],
            oldPrice: Math.random() > 0.5 ? Math.round(prices[idx % prices.length] * 1.25) : null,
            image: `https://via.placeholder.com/400x400/f8f8f8/999?text=${encodeURIComponent(title.split(' ').slice(0, 2).join('+'))}`,
            rating: +(3.8 + Math.random() * 1.2).toFixed(1),
            reviewCount: Math.floor(Math.random() * 300) + 10,
        }));
};

/* ─── Helper components ───────────────────────────────────────────────── */
const StarRow = ({ rating, size = 'text-sm' }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <IoStarSharp key={i} className={`${size} ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
        ))}
    </div>
);

const RatingBar = ({ label, count, total }) => {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-8 text-right">{label}★</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-400 w-8">{count}</span>
        </div>
    );
};

/* ─── Main Component ──────────────────────────────────────────────────── */
const LojaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('produtos');
    const [productSearch, setProductSearch] = useState('');
    const [gridView, setGridView] = useState(true);
    const [followed, setFollowed] = useState(false);
    const [products, setProducts] = useState([]);

    useDocumentTitle(store ? `${store.name} – Double E` : 'Detalhes da Loja – Double E');

    useEffect(() => {
        const found = stores.find(s => s.id === parseInt(id));
        setTimeout(() => {
            setStore(found || null);
            if (found) setProducts(generateProducts(found.id, found.name));
            setLoading(false);
        }, 400);
    }, [id]);

    const handleFollow = () => {
        const next = !followed;
        setFollowed(next);
        notyf[next ? 'success' : 'error'](next ? `A seguir ${store.name}!` : `Deixou de seguir ${store.name}`);
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        notyf.success('Produto adicionado ao carrinho!');
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(productSearch.toLowerCase())
    );

    const totalRatings = store
        ? Object.values(store.ratingDistribution).reduce((a, b) => a + b, 0)
        : 0;

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Header />
                <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
                    <div className="inline-block w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500">A carregar loja…</p>
                </div>
            </div>
        );
    }

    /* ── Not found ── */
    if (!store) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <Header />
                <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
                    <IoStorefrontOutline className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Loja não encontrada</h2>
                    <p className="text-gray-400 mb-6">A loja que procura não existe ou foi removida.</p>
                    <button
                        onClick={() => navigate('/lojas')}
                        className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                        Ver todas as lojas
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { key: 'produtos', label: `Produtos (${store.products.toLocaleString('pt-AO')})` },
        { key: 'avaliacoes', label: `Avaliações (${store.reviews})` },
        { key: 'sobre', label: 'Sobre a Loja' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />

            {/* ── Hero banner ── */}
            <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

                {/* Back button */}
                <button
                    onClick={() => navigate('/lojas')}
                    className="absolute top-5 left-4 sm:left-6 flex items-center gap-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-sm font-medium px-3.5 py-2 rounded-full transition-all cursor-pointer"
                >
                    <IoChevronBack className="text-base" />
                    Lojas
                </button>

                {/* Share */}
                <button className="absolute top-5 right-4 sm:right-6 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full transition-all cursor-pointer">
                    <IoShareSocialOutline className="text-lg" />
                </button>

                {/* Badge */}
                {store.badge && (
                    <span className={`absolute top-5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1.5 rounded-full shadow ${store.badge === 'Destaque' ? 'bg-[#F97316] text-white' : 'bg-emerald-500 text-white'}`}>
                        {store.badge === 'Destaque' ? '⭐ Destaque' : '🆕 Novo'}
                    </span>
                )}
            </div>

            {/* ── Store card ── */}
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-10 relative z-10 p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src={store.logo}
                                alt={store.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">{store.name}</h1>
                                    <span className="inline-block mt-1 text-xs font-semibold text-[#F97316] bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full">
                                        {store.category}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleFollow}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${followed
                                            ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                                            : 'bg-orange-50 text-[#F97316] border-orange-100 hover:bg-[#F97316] hover:text-white hover:border-[#F97316]'
                                            }`}
                                    >
                                        {followed ? <IoHeart /> : <IoHeartOutline />}
                                        {followed ? 'A seguir' : 'Seguir'}
                                    </button>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <IoStarSharp key={i} className={`text-sm ${i <= Math.round(store.rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{store.rating}</span>
                                    <span className="text-sm text-gray-400">({store.reviews.toLocaleString('pt-AO')} avaliações)</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <FaBoxOpen className="text-[#F97316]" />
                                    <span>{store.products.toLocaleString('pt-AO')} produtos</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <IoShieldCheckmarkOutline className="text-emerald-500" />
                                    <span>Loja Verificada</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick info pills */}
                    <div className="mt-5 flex flex-wrap gap-2.5">
                        {[
                            { icon: <IoLocationOutline />, text: store.address },
                            { icon: <IoTimeOutline />, text: store.hours },
                            { icon: <IoCallOutline />, text: store.phone },
                            { icon: <IoMailOutline />, text: store.email },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600">
                                <span className="text-[#F97316]">{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    {/* Tab bar */}
                    <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === tab.key
                                    ? 'border-[#F97316] text-[#F97316]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-5 sm:p-7">
                        {/* ── Tab: Produtos ── */}
                        {activeTab === 'produtos' && (
                            <div>
                                {/* Toolbar */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                    <div className="relative flex-1">
                                        <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Pesquisar produto…"
                                            value={productSearch}
                                            onChange={e => setProductSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#F97316] transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setGridView(true)}
                                            className={`p-2 rounded-lg transition-all cursor-pointer ${gridView ? 'bg-white shadow text-[#F97316]' : 'text-gray-400'}`}
                                        >
                                            <IoGridOutline />
                                        </button>
                                        <button
                                            onClick={() => setGridView(false)}
                                            className={`p-2 rounded-lg transition-all cursor-pointer ${!gridView ? 'bg-white shadow text-[#F97316]' : 'text-gray-400'}`}
                                        >
                                            <IoListOutline />
                                        </button>
                                    </div>
                                </div>

                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400">
                                        <FaBoxOpen className="text-4xl mx-auto mb-3 opacity-25" />
                                        <p className="font-medium">Nenhum produto encontrado.</p>
                                    </div>
                                ) : gridView ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {filteredProducts.map(product => (
                                            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    {product.oldPrice && (
                                                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-3 flex flex-col flex-1">
                                                    <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-tight mb-2 flex-1">{product.title}</p>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <StarRow rating={product.rating} />
                                                        <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                                                    </div>
                                                    <div className="mb-3">
                                                        <span className="text-sm font-bold text-gray-800">{formatCurrency(product.price)}</span>
                                                        {product.oldPrice && (
                                                            <span className="ml-1.5 text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-50 text-[#F97316] text-xs font-semibold hover:bg-[#F97316] hover:text-white border border-orange-100 hover:border-[#F97316] transition-colors cursor-pointer"
                                                    >
                                                        <IoCartOutline />
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {filteredProducts.map(product => (
                                            <div key={product.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-md transition-shadow">
                                                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{product.title}</p>
                                                    <div className="flex items-center gap-1 mb-1.5">
                                                        <StarRow rating={product.rating} />
                                                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-800">{formatCurrency(product.price)}</span>
                                                        {product.oldPrice && (
                                                            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.oldPrice)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center flex-shrink-0">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-orange-50 text-[#F97316] text-xs font-semibold hover:bg-[#F97316] hover:text-white border border-orange-100 hover:border-[#F97316] transition-colors cursor-pointer"
                                                    >
                                                        <IoCartOutline />
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Tab: Avaliações ── */}
                        {activeTab === 'avaliacoes' && (
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Summary */}
                                <div className="lg:w-64 flex-shrink-0">
                                    <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <span className="text-5xl font-black text-gray-800 leading-none">{store.rating}</span>
                                        <div className="flex items-center gap-1 my-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <IoStarSharp key={i} className={`text-xl ${i <= Math.round(store.rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">{store.reviews.toLocaleString('pt-AO')} avaliações</p>

                                        <div className="w-full mt-5 flex flex-col gap-2">
                                            {[5, 4, 3, 2, 1].map(star => (
                                                <RatingBar
                                                    key={star}
                                                    label={star}
                                                    count={store.ratingDistribution[star]}
                                                    total={totalRatings}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Review list */}
                                <div className="flex-1 flex flex-col gap-4">
                                    {store.opinions.map(op => (
                                        <div key={op.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {op.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-gray-800">{op.user}</span>
                                                            {op.verified && (
                                                                <span className="flex items-center gap-0.5 text-emerald-600 text-[10px] font-semibold">
                                                                    <IoCheckmarkCircleOutline className="text-xs" /> Verificado
                                                                </span>
                                                            )}
                                                        </div>
                                                        <StarRow rating={op.rating} size="text-xs" />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{op.date}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800 mb-1">{op.title}</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{op.comment}</p>
                                            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                                                <IoChatbubbleOutline />
                                                <span>{op.helpful} pessoas acharam útil</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Sobre ── */}
                        {activeTab === 'sobre' && (
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Description */}
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-gray-800 mb-3">Sobre a {store.name}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">{store.description}</p>

                                    {/* Key stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {[
                                            { icon: <FaAward className="text-[#F97316] text-xl" />, label: 'Desde', value: store.founded },
                                            { icon: <FaUsers className="text-[#F97316] text-xl" />, label: 'Colaboradores', value: store.employees },
                                            { icon: <FaBoxOpen className="text-[#F97316] text-xl" />, label: 'Produtos', value: store.products.toLocaleString('pt-AO') + '+' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
                                                {stat.icon}
                                                <div>
                                                    <p className="text-lg font-black text-gray-800 leading-none">{stat.value}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact card */}
                                <div className="lg:w-72 flex-shrink-0">
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                        <h3 className="text-sm font-bold text-gray-800 mb-4">Informações de Contacto</h3>
                                        <div className="flex flex-col gap-3.5">
                                            {[
                                                { icon: <IoLocationOutline className="text-[#F97316] text-base" />, label: 'Endereço', value: store.address },
                                                { icon: <IoCallOutline className="text-[#F97316] text-base" />, label: 'Telefone', value: store.phone },
                                                { icon: <IoMailOutline className="text-[#F97316] text-base" />, label: 'Email', value: store.email },
                                                { icon: <IoTimeOutline className="text-[#F97316] text-base" />, label: 'Horário', value: store.hours },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">{item.label}</p>
                                                        <p className="text-sm text-gray-700 font-medium leading-snug">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-2">
                                            <IoShieldCheckmarkOutline className="text-emerald-500 text-lg" />
                                            <p className="text-xs text-gray-500">Loja verificada e aprovada pela Double E</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sugestão de outras lojas removida conforme pedido. */}
            </div>
        </div>
    );
};

export default LojaDetails;
