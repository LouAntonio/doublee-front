import React, { useState } from 'react';
import { IoAddOutline, IoTrashOutline, IoTicketOutline, IoCheckmarkCircleOutline, IoCalendarOutline } from 'react-icons/io5';
import { useMyCoupons, useCreateCoupon, useDeleteCoupon } from '../../../hooks/queries/useStoreCoupons';
import DashboardModal from '../DashboardModal';


const CouponsTab = () => {
	const { data: coupons, isLoading: loading } = useMyCoupons();
	const createCoupon = useCreateCoupon();
	const deleteCoupon = useDeleteCoupon();
	const [isCreating, setIsCreating] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [formData, setFormData] = useState({
		code: '',
		discount: '',
		expiryDate: '',
		visible: true
	});

	const handleCreate = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		try {
			await createCoupon.mutateAsync(formData);
			setIsModalOpen(false);
			setFormData({ code: '', discount: '', expiryDate: '', visible: true });
		} catch {
			// handled by mutation
		} finally {
			setIsCreating(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem a certeza que deseja eliminar este cupão?')) return;
		try {
			await deleteCoupon.mutateAsync(id);
		} catch {
			// handled by mutation
		}
	};


	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<div>
					<h2 className="text-xl font-bold text-[#1C1917] font-display">Meus Cupões</h2>
					<p className="text-sm text-[#78716C]">Crie e gira códigos de desconto para os seus clientes.</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
				>
					<IoAddOutline className="w-5 h-5" />
					Novo Cupão
				</button>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{[1, 2, 3].map(i => (
						<div key={i} className="bg-white border border-accent/10 rounded-2xl p-5 shadow-md animate-pulse">
							<div className="flex items-center gap-4 mb-4">
								<div className="w-12 h-12 bg-sand rounded-xl"></div>
								<div className="space-y-2 flex-1">
									<div className="h-4 bg-sand rounded w-2/3"></div>
									<div className="h-3 bg-sand rounded w-1/2"></div>
								</div>
							</div>
							<div className="space-y-2 pt-4 border-t border-accent/5">
								<div className="h-2 bg-sand rounded w-3/4"></div>
								<div className="h-2 bg-sand rounded w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			) : coupons.length > 0 ? (

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{coupons.map((coupon, idx) => (
						<div key={coupon.id} className="bg-white border border-accent/10 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.05 * (idx + 1)}s`, animationFillMode: 'forwards' }}>
							<div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									onClick={() => handleDelete(coupon.id)}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
								>
									<IoTrashOutline className="w-5 h-5" />
								</button>
							</div>

							<div className="flex items-center gap-4 mb-4">
								<div className="p-3 bg-orange-50 text-accent rounded-xl">
									<IoTicketOutline className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-bold text-[#1C1917] tracking-wider text-lg font-display">{coupon.code}</h3>
									<p className="text-accent font-semibold">{coupon.discount}% de DESCONTO</p>
								</div>
							</div>

							<div className="space-y-2 pt-4 border-t border-accent/5">
								<div className="flex items-center gap-2 text-xs text-[#78716C]">
									<IoCalendarOutline className="w-4 h-4" />
									<span>Expira em: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-[#78716C]">
									<IoCheckmarkCircleOutline className={`w-4 h-4 ${coupon.visible ? 'text-green-500' : 'text-gray-300'}`} />
									<span>{coupon.visible ? 'Visível na Central de Cupões' : 'Invisível na Central'}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-accent/10">
					<IoTicketOutline className="w-12 h-12 text-[#78716C] mx-auto mb-3" />
					<p className="text-[#1C1917] font-medium">Ainda não tem nenhum cupão ativo.</p>
					<button
						onClick={() => setIsModalOpen(true)}
						className="mt-4 text-accent text-sm font-bold hover:text-accent-dark"
					>
						Criar o primeiro agora
					</button>
				</div>
			)}

			<DashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="sm">
				<div className="p-6 border-b border-accent/10 flex justify-between items-center bg-sand rounded-t-2xl">
					<h3 className="text-lg font-bold text-[#1C1917] font-display">Novo Cupão</h3>
					<button onClick={() => setIsModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer">
						<IoAddOutline className="w-6 h-6 rotate-45" />
					</button>
				</div>
				<form onSubmit={handleCreate} className="p-6 space-y-4">
					<div>
						<label className="block text-xs font-bold text-[#78716C] uppercase mb-1 tracking-wider">CÓDIGO (EX: VERAO24)</label>
						<input
							type="text"
							required
							value={formData.code}
							onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
							placeholder="DIGITE O CÓDIGO"
							className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:border-accent outline-none transition-all font-mono tracking-widest text-lg bg-white"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-bold text-[#78716C] uppercase mb-1 tracking-wider">DESCONTO (%)</label>
							<input
								type="number"
								required
								min="1"
								max="100"
								value={formData.discount}
								onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
								placeholder="%"
								className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:border-accent outline-none transition-all bg-white"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-[#78716C] uppercase mb-1 tracking-wider">VALIDADE</label>
							<input
								type="date"
								required
								min={new Date().toISOString().split('T')[0]}
								value={formData.expiryDate}
								onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
								className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:border-accent outline-none transition-all bg-white"
							/>
						</div>
					</div>
					<div className="flex items-center gap-3 py-2">
						<input
							type="checkbox"
							id="visible"
							checked={formData.visible}
							onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
							className="w-4 h-4 text-accent rounded focus:ring-accent"
						/>
						<label htmlFor="visible" className="text-sm text-[#78716C] font-medium select-none">Mostrar na página pública de cupões</label>
					</div>
					<button
						type="submit"
						disabled={isCreating}
						className={`w-full bg-accent text-white py-4 rounded-full font-bold hover:bg-accent-dark transition-all shadow-lg shadow-accent/20 mt-2 cursor-pointer flex items-center justify-center gap-2 ${isCreating ? 'opacity-70 cursor-not-allowed' : ''}`}
					>
						{isCreating ? (
							<>
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								A processar...
							</>
						) : (
							'Criar Cupão'
						)}
					</button>

				</form>
			</DashboardModal>
		</div>
	);
};

export default CouponsTab;
