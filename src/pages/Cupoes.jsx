import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import CouponCard from '../components/CouponCard';
import CouponCardSkeleton from '../components/CouponCardSkeleton';
import { IoTicketOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { getPublicCoupons } from '../services/coupons';

const Cupoes = () => {
	useDocumentTitle('Cupões - Double E');

	const { data: coupons = [], isLoading, isError, refetch } = useQuery({
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
			<div className="min-h-screen bg-sand pb-16">
				<div className="relative overflow-hidden py-16 md:py-20 px-4 mb-10 bg-gradient-to-br from-accent via-accent to-accent-dark">
					<div className="absolute inset-0 cupoes-hero-pattern" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.06)_0%,transparent_50%)]" />

					<div className="max-w-[1200px] mx-auto relative z-10">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm mb-6 shadow-lg animate-float-bob">
								<IoTicketOutline className="w-10 h-10 text-white" />
							</div>
							<h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-3 tracking-tight">
								Central de Cupões
							</h1>
							<p className="text-amber-100 text-lg max-w-2xl mx-auto leading-relaxed">
								Poupe nas suas compras com a nossa seleção exclusiva de cupões.
								Basta copiar o código e usar no <strong className="text-white">checkout</strong>!
							</p>
						</div>
					</div>
				</div>

				<div className="max-w-[1200px] mx-auto px-4">
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }, (_, i) => (
								<CouponCardSkeleton key={i} />
							))}
						</div>
					) : isError ? (
						<div className="text-center py-20">
							<div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl inline-block mb-4 shadow-lg border border-amber-100">
								<IoTicketOutline className="w-12 h-12 text-accent/50" />
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2 font-display">
								Erro ao carregar cupões
							</h3>
							<p className="text-gray-500 mb-6">
								Não foi possível carregar os cupões de desconto.
							</p>
							<button
								onClick={() => refetch()}
								className="bg-accent text-white px-6 py-2.5 rounded-xl font-bold hover:bg-accent-dark transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
							>
								Tentar novamente
							</button>
						</div>
					) : coupons.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{coupons.map((coupon, index) => (
								<CouponCard key={coupon.id} coupon={coupon} index={index} />
							))}
						</div>
					) : (
						<div className="text-center py-20">
							<div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl inline-block mb-4 shadow-lg border border-amber-100">
								<IoTicketOutline className="w-12 h-12 text-accent/50" />
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2 font-display">
								Nenhum cupão disponível
							</h3>
							<p className="text-gray-500 max-w-md mx-auto">
								Não temos cupões neste momento.
								<br />
								<span className="text-accent font-semibold">Volte mais tarde</span> para novas ofertas!
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Cupoes;
