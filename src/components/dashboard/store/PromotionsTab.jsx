import React, { useState, useMemo } from 'react';
import { IoFlashOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoWalletOutline } from 'react-icons/io5';
import { usePromotionPackages, usePromotionPurchases, usePurchasePromotion } from '../../../hooks/queries/useStorePromotions';
import { notyf } from '../../../utils/notyf';

const PromotionsTab = ({ store, products, onRefresh }) => {
	const { data: packages = [], isLoading: loadingPackages } = usePromotionPackages();
	const { data: purchases = [], isLoading: loadingPurchases } = usePromotionPurchases(store?.id);
	const purchasePromotion = usePurchasePromotion();
	const [buying, setBuying] = useState(false);

	const [selectedPackage, setSelectedPackage] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState('');

	const loading = loadingPackages || loadingPurchases;

	const activePurchases = useMemo(() => {
		const cutoff = new Date();
		return purchases.filter(p => {
			if (p.status !== 'paid') return false;
			const createdAt = new Date(p.createdAt);
			const durationMs = p.package.durationDays * 24 * 60 * 60 * 1000;
			return cutoff.getTime() < createdAt.getTime() + durationMs;
		});
	}, [purchases]);

	const handlePurchase = async () => {
		if (!selectedPackage) return;

		const payload = {
			packageId: selectedPackage.id,
			storeId: selectedPackage.type === 'STORE' ? store.id : null,
			productId: selectedPackage.type === 'PRODUCT' ? selectedProduct : null
		};

		if (selectedPackage.type === 'PRODUCT' && !selectedProduct) {
			notyf.error('Por favor, selecione um produto.');
			return;
		}

		setBuying(true);
		try {
			await purchasePromotion.mutateAsync(payload);
			setSelectedPackage(null);
			setSelectedProduct('');
			if (onRefresh) onRefresh();
		} catch {
			// handled by mutation
		} finally {
			setBuying(false);
		}
	};

	if (loading) return <div className="py-10 text-center text-[#78716C]">Carregando promoções...</div>;

	return (
		<div className="space-y-8">
			{/* Active Promotions */}
			<section className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<h3 className="text-lg font-bold text-[#1C1917] mb-4 flex items-center gap-2 font-display">
					<IoFlashOutline className="text-accent" />
					Os Meus Destaques
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{activePurchases.length > 0 ? (
						activePurchases.map(purchase => {
							const createdAt = new Date(purchase.createdAt);
							const durationMs = purchase.package.durationDays * 24 * 60 * 60 * 1000;
							const expiryDate = new Date(createdAt.getTime() + durationMs);
							return (
								<div key={purchase.id} className="bg-white p-4 rounded-2xl border border-accent/10 shadow-md flex items-start gap-4 hover:shadow-lg transition-shadow duration-300">
									<div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
										<IoCheckmarkCircleOutline className="text-accent w-6 h-6" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-bold text-[#1C1917] truncate">{purchase.package.name}</p>
										<p className="text-xs text-[#78716C]">
											{purchase.store ? 'Loja em destaque' : `Produto: ${purchase.product.name}`}
										</p>
										<div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-accent bg-orange-50 px-2 py-0.5 rounded-full w-fit">
											<IoTimeOutline />
											Ativo até {expiryDate.toLocaleDateString('pt-AO')}
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="col-span-full py-8 text-center bg-white rounded-2xl border border-dashed border-accent/10">
							<p className="text-[#78716C] text-sm">Ainda não possui destaques ativos.</p>
						</div>
					)}
				</div>
			</section>

			{/* Available Packages */}
			<section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
				<h3 className="text-lg font-bold text-[#1C1917] mb-4 flex items-center gap-2 font-display">
					<IoWalletOutline className="text-accent" />
					Impulsionar a Minha Loja
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{packages.map(pkg => (
						<div
							key={pkg.id}
							onClick={() => setSelectedPackage(pkg)}
							className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${selectedPackage?.id === pkg.id ? 'border-accent bg-orange-50/30 shadow-md' : 'border-accent/10 hover:border-accent/30 bg-white'}`}
						>
							{selectedPackage?.id === pkg.id && (
								<div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl">
									SELECIONADO
								</div>
							)}
							<div className="flex justify-between items-start mb-4">
								<div>
									<h4 className="font-bold text-[#1C1917] text-lg font-display">{pkg.name}</h4>
									<span className={`text-[10px] font-bold uppercase rounded-md px-2 py-0.5 ${pkg.type === 'STORE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
										{pkg.type === 'STORE' ? 'Destaque Loja' : 'Destaque Produto'}
									</span>
								</div>
								<div className="text-right">
									<p className="text-2xl font-black text-[#1C1917]">{parseFloat(pkg.price).toLocaleString('pt-AO')} Kz</p>
									<p className="text-xs text-[#78716C]">{pkg.durationDays} dias de duração</p>
								</div>
							</div>

							{selectedPackage?.id === pkg.id && pkg.type === 'PRODUCT' && (
								<div className="mt-4" onClick={e => e.stopPropagation()}>
									<label className="block text-xs font-bold text-[#1C1917] mb-2 uppercase">Escolha o Produto:</label>
									<select
										className="w-full bg-white border border-accent/20 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/20"
										value={selectedProduct}
										onChange={e => setSelectedProduct(e.target.value)}
									>
										<option value="">Selecione um produto...</option>
										{products.map(p => (
											<option key={p.id} value={p.id}>{p.name}</option>
										))}
									</select>
								</div>
							)}
						</div>
					))}
				</div>

				{selectedPackage && (
					<div className="mt-8 flex justify-center">
						<button
							disabled={buying}
							onClick={handlePurchase}
							className="bg-accent text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-accent/20 hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all disabled:bg-gray-400 disabled:scale-100"
						>
							{buying ? 'Processando...' : `Confirmar Destaque - ${parseFloat(selectedPackage.price).toLocaleString('pt-AO')} Kz`}
						</button>
					</div>
				)}
			</section>
		</div>
	);
};

export default PromotionsTab;
