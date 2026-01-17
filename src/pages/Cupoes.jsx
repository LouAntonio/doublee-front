import React, { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { IoTicketOutline, IoCopyOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoStorefrontOutline, IoHardwareChipOutline, IoShirtOutline, IoFastFoodOutline } from 'react-icons/io5';

const CouponCard = ({ coupon }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(coupon.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="bg-white relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200">
			{/* Decorative colored top bar */}
			<div className={`h-2 w-full ${coupon.color}`}></div>

			<div className="p-6 flex-1 flex flex-col">
				<div className="flex justify-between items-start mb-4">
					<div className={`p-3 rounded-full bg-opacity-10 ${coupon.bgColor} ${coupon.textColor}`}>
						{coupon.icon}
					</div>
					<span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
						Válido até {coupon.expiry}
					</span>
				</div>

				<div className="mb-4">
					<div className="flex items-baseline gap-1 mb-1">
						<span className="text-2xl font-bold text-gray-800">{coupon.discount}</span>
						<span className="text-sm font-medium text-gray-600">OFF</span>
					</div>
					<h3 className="font-semibold text-gray-800 mb-1">{coupon.store}</h3>
					<p className="text-sm text-gray-500 leading-relaxed">{coupon.description}</p>
				</div>

				<div className="mt-auto pt-4 border-t border-dashed border-gray-300">
					<div className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
						<code className="text-sm font-mono font-bold text-gray-700 tracking-wider">
							{coupon.code}
						</code>
						<button
							onClick={handleCopy}
							className={`
								flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all duration-200
								${copied
									? 'bg-green-100 text-green-700'
									: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
								}
							`}
						>
							{copied ? (
								<>
									<IoCheckmarkCircleOutline className="w-4 h-4" />
									Copiado!
								</>
							) : (
								<>
									<IoCopyOutline className="w-4 h-4" />
									Pegar
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Circles for ticket effect */}
			<div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full"></div>
			<div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full"></div>
		</div>
	);
};

const Cupoes = () => {
	useDocumentTitle('Cupões - Double E');
	const [activeCategory, setActiveCategory] = useState('Todos');

	const categories = [
		{ id: 'Todos', icon: <IoTicketOutline />, label: 'Todos' },
		{ id: 'Tecnologia', icon: <IoHardwareChipOutline />, label: 'Tecnologia' },
		{ id: 'Moda', icon: <IoShirtOutline />, label: 'Moda' },
		{ id: 'Mercado', icon: <IoStorefrontOutline />, label: 'Mercado' },
		{ id: 'Restaurantes', icon: <IoFastFoodOutline />, label: 'Restaurantes' },
	];

	const coupons = [
		{
			id: 1,
			store: 'Samsung Angola',
			discount: '50.000 Kz',
			description: 'Desconto em todo o site para compras acima de 200.000 Kz.',
			code: 'GALAXY50K',
			expiry: '25/12',
			category: 'Tecnologia',
			icon: <IoHardwareChipOutline className="w-6 h-6" />,
			color: 'bg-blue-600',
			textColor: 'text-blue-600',
			bgColor: 'bg-blue-600'
		},
		{
			id: 2,
			store: 'Sportzone',
			discount: '15%',
			description: 'Cupom válido para calçado desportivo e roupas.',
			code: 'SPORT15',
			expiry: '30/11',
			category: 'Moda',
			icon: <IoShirtOutline className="w-6 h-6" />,
			color: 'bg-orange-500',
			textColor: 'text-orange-500',
			bgColor: 'bg-orange-500'
		},
		{
			id: 3,
			store: 'Shoprite Angola',
			discount: '3.000 Kz',
			description: 'Nas compras acima de 30.000 Kz no supermercado.',
			code: 'SHOPRITE3K',
			expiry: '15/11',
			category: 'Mercado',
			icon: <IoStorefrontOutline className="w-6 h-6" />,
			color: 'bg-green-600',
			textColor: 'text-green-600',
			bgColor: 'bg-green-600'
		},
		{
			id: 4,
			store: 'Tupuca',
			discount: '1.000 Kz',
			description: 'Válido para o primeiro pedido em restaurantes parceiros.',
			code: 'TUPUCA1K',
			expiry: 'Hoje',
			category: 'Restaurantes',
			icon: <IoFastFoodOutline className="w-6 h-6" />,
			color: 'bg-red-500',
			textColor: 'text-red-500',
			bgColor: 'bg-red-500'
		},
		{
			id: 5,
			store: 'Unitel Store',
			discount: '5%',
			description: 'Desconto extra para smartphones e acessórios tecnológicos.',
			code: 'UNITEL5',
			expiry: '20/12',
			category: 'Tecnologia',
			icon: <IoHardwareChipOutline className="w-6 h-6" />,
			color: 'bg-blue-600',
			textColor: 'text-blue-600',
			bgColor: 'bg-blue-600'
		},
		{
			id: 6,
			store: 'Mango Angola',
			discount: '20%',
			description: 'Na compra de 2 ou mais peças da nova coleção.',
			code: 'MANGO20',
			expiry: '10/12',
			category: 'Moda',
			icon: <IoShirtOutline className="w-6 h-6" />,
			color: 'bg-purple-600',
			textColor: 'text-purple-600',
			bgColor: 'bg-purple-600'
		}
	];

	const filteredCoupons = activeCategory === 'Todos'
		? coupons
		: coupons.filter(c => c.category === activeCategory);

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50 pb-16">
				<div className="max-w-[1200px] mx-auto px-4">
					{/* Hero Section */}
					<div
						className="relative overflow-hidden py-12 px-8 mb-8 mt-8 rounded-2xl shadow-xl"
						style={{
							backgroundImage: "url('https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1600&q=80')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					>
						<div className="absolute inset-0 bg-black/45"></div>
						<div className="text-center relative z-10">
							<IoTicketOutline className="w-16 h-16 mx-auto mb-4 opacity-90" />
							<h1 className="text-3xl md:text-4xl font-bold mb-4">Central de Cupões</h1>
							<p className="text-yellow-100 text-lg max-w-2xl mx-auto">
								Poupe nas suas compras com a nossa selecção exclusiva de cupões.
								Basta copiar o código e usar no checkout!
							</p>
						</div>
				</div>

				{/* Category Filters */}
					<div className="flex flex-wrap justify-center gap-3 mb-10">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								className={`
									flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
									${activeCategory === cat.id
										? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105'
										: 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md border border-gray-200'
									}
								`}
							>
								{cat.icon}
								{cat.label}
							</button>
						))}
					</div>

					{/* Coupons Grid */}
					{filteredCoupons.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredCoupons.map((coupon) => (
								<CouponCard key={coupon.id} coupon={coupon} />
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<div className="bg-white p-8 rounded-full inline-block mb-4 shadow-sm">
								<IoTicketOutline className="w-12 h-12 text-gray-300" />
							</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum cupão encontrado</h3>
							<p className="text-gray-500">
								Não temos cupões para esta categoria neste momento.
								<br />Volte mais tarde!
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Cupoes;
