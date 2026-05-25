import React, { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { IoTicketOutline, IoCopyOutline, IoCheckmarkCircleOutline, IoHardwareChipOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { getPublicCoupons } from '../services/coupons';

const CouponCard = ({ coupon }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(coupon.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="bg-white relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200">
			<div className="h-2 w-full bg-primary-600"></div>
			<div className="p-6 flex-1 flex flex-col">
				<div className="flex justify-between items-start mb-4">
					<div className="p-3 rounded-full bg-primary-50 text-primary-600">
						<IoHardwareChipOutline className="w-6 h-6" />
					</div>
					<span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Válido até {new Date(coupon.expiryDate).toLocaleDateString()}
					</span>
				</div>

				<div className="mb-4">
					<div className="flex items-baseline gap-1 mb-1">
						<span className="text-2xl font-bold text-gray-800">{coupon.discount}%</span>
						<span className="text-sm font-medium text-gray-600">OFF</span>
					</div>
					<h3 className="font-semibold text-gray-800 mb-1">{coupon.store?.name}</h3>
					<p className="text-sm text-gray-500 leading-relaxed">Aproveite este desconto exclusivo na loja {coupon.store?.name}.</p>
				</div>

				<div className="mt-auto pt-4 border-t border-dashed border-gray-300">
					<div className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
						<code className="text-sm font-mono font-bold text-gray-700 tracking-wider">
							{coupon.code}
						</code>
						<button
							onClick={handleCopy}
							className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
								copied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
							}`}
						>
							{copied ? (
								<><IoCheckmarkCircleOutline className="w-4 h-4" /> Copiado!</>
							) : (
								<><IoCopyOutline className="w-4 h-4" /> Pegar</>
							)}
						</button>
					</div>
				</div>
			</div>
			<div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full"></div>
			<div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full"></div>
		</div>
	);
};

const Cupoes = () => {
	useDocumentTitle('Cupões - Double E');

	const { data: coupons = [], isLoading } = useQuery({
		queryKey: ['coupons', 'public'],
		queryFn: async () => {
			const res = await getPublicCoupons();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar cupões');
			return res.data || [];
		},
		staleTime: 1000 * 60 * 5,
	});

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50 pb-16">
				<div className="max-w-[1200px] mx-auto px-4">
					<div
						className="relative overflow-hidden py-12 px-8 mb-8 mt-8 rounded-2xl shadow-xl"
						style={{
							backgroundImage: "url('https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1600&q=80')",
							backgroundSize: 'cover', backgroundPosition: 'center',
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

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
								<div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
									<div className="h-2 w-full bg-gray-200"></div>
									<div className="p-6 space-y-4">
										<div className="flex justify-between items-start">
											<div className="w-12 h-12 bg-gray-200 rounded-full"></div>
											<div className="h-4 bg-gray-200 rounded w-24"></div>
										</div>
										<div className="space-y-2">
											<div className="h-6 bg-gray-200 rounded w-1/2"></div>
											<div className="h-4 bg-gray-200 rounded w-3/4"></div>
										</div>
										<div className="pt-4 border-t border-dashed border-gray-200">
											<div className="h-10 bg-gray-200 rounded-lg"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : coupons.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{coupons.map((coupon) => (
								<CouponCard key={coupon.id} coupon={coupon} />
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<div className="bg-white p-8 rounded-full inline-block mb-4 shadow-sm">
								<IoTicketOutline className="w-12 h-12 text-gray-300" />
							</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum cupão encontrado</h3>
							<p className="text-gray-500">Não temos cupões neste momento.<br />Volte mais tarde!</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Cupoes;
