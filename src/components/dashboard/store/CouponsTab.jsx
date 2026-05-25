import React, { useState, useEffect } from 'react';
import { IoAddOutline, IoTrashOutline, IoTicketOutline, IoCheckmarkCircleOutline, IoCalendarOutline } from 'react-icons/io5';
import http from '../../../services/http';
import { notyf } from '../../../utils/notyf';


const CouponsTab = () => {
	const [coupons, setCoupons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [formData, setFormData] = useState({
		code: '',
		discount: '',
		expiryDate: '',
		visible: true
	});

	const fetchCoupons = async () => {
		setLoading(true);
		try {
			const res = await http.get('/coupons/mine');
			if (res?.success) {
				setCoupons(res.data || []);
			}
		} catch {
			// handled by interceptor
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCoupons();
	}, []);

	const handleCreate = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		try {
			const res = await http.post('/coupons', formData);

			if (res?.success) {
				notyf.success('Cupão criado com sucesso!');
				setIsModalOpen(false);
				setFormData({ code: '', discount: '', expiryDate: '', visible: true });
				fetchCoupons();
			} else {
				notyf.error(res?.msg || 'Erro ao criar cupão');
			}
		} catch {
			notyf.error('Erro ao conectar ao servidor');
		} finally {
			setIsCreating(false);
		}
	};


	const handleDelete = async (id) => {
		if (!window.confirm('Tem a certeza que deseja eliminar este cupão?')) return;
		try {
			const res = await http.delete(`/coupons/${id}`);
			if (res?.success) {
				notyf.success('Cupão eliminado!');
				fetchCoupons();
			}
		} catch {
			notyf.error('Erro ao eliminar cupão');
		}

	};


	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-xl font-bold text-gray-800">Meus Cupões</h2>
					<p className="text-sm text-gray-500">Crie e gira códigos de desconto para os seus clientes.</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
				>
					<IoAddOutline className="w-5 h-5" />
					Novo Cupão
				</button>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{[1, 2, 3].map(i => (
						<div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm animate-pulse">
							<div className="flex items-center gap-4 mb-4">
								<div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
								<div className="space-y-2 flex-1">
									<div className="h-4 bg-gray-200 rounded w-2/3"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</div>
							</div>
							<div className="space-y-2 pt-4 border-t border-gray-50">
								<div className="h-2 bg-gray-200 rounded w-3/4"></div>
								<div className="h-2 bg-gray-200 rounded w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			) : coupons.length > 0 ? (

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{coupons.map((coupon) => (
						<div key={coupon.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
							<div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									onClick={() => handleDelete(coupon.id)}
									className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
								>
									<IoTrashOutline className="w-5 h-5" />
								</button>
							</div>

							<div className="flex items-center gap-4 mb-4">
								<div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
									<IoTicketOutline className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-bold text-gray-800 tracking-wider text-lg">{coupon.code}</h3>
									<p className="text-primary-600 font-semibold">{coupon.discount}% de DESCONTO</p>
								</div>
							</div>

							<div className="space-y-2 pt-4 border-t border-gray-50">
								<div className="flex items-center gap-2 text-xs text-gray-500">
									<IoCalendarOutline className="w-4 h-4" />
									<span>Expira em: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-gray-500">
									<IoCheckmarkCircleOutline className={`w-4 h-4 ${coupon.visible ? 'text-green-500' : 'text-gray-300'}`} />
									<span>{coupon.visible ? 'Visível na Central de Cupões' : 'Invisível na Central'}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
					<IoTicketOutline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500 font-medium">Ainda não tem nenhum cupão ativo.</p>
					<button
						onClick={() => setIsModalOpen(true)}
						className="mt-4 text-primary-600 text-sm font-bold hover:underline"
					>
						Criar o primeiro agora
					</button>
				</div>
			)}

			{/* Modal de Criação */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
					<div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
						<div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
							<h3 className="text-lg font-bold text-gray-800">Novo Cupão</h3>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
								<IoAddOutline className="w-6 h-6 rotate-45" />
							</button>
						</div>
						<form onSubmit={handleCreate} className="p-6 space-y-4">
							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">CÓDIGO (EX: VERAO24)</label>
								<input
									type="text"
									required
									value={formData.code}
									onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
									placeholder="DIGITE O CÓDIGO"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all font-mono tracking-widest text-lg"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">DESCONTO (%)</label>
									<input
										type="number"
										required
										min="1"
										max="100"
										value={formData.discount}
										onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
										placeholder="%"
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all"
									/>
								</div>
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">VALIDADE</label>
									<input
										type="date"
										required
										min={new Date().toISOString().split('T')[0]}
										value={formData.expiryDate}
										onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all"
									/>
								</div>
							</div>
							<div className="flex items-center gap-3 py-2">
								<input
									type="checkbox"
									id="visible"
									checked={formData.visible}
									onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
									className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
								/>
								<label htmlFor="visible" className="text-sm text-gray-600 font-medium select-none">Mostrar na página pública de cupões</label>
							</div>
							<button
								type="submit"
								disabled={isCreating}
								className={`w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 mt-2 cursor-pointer flex items-center justify-center gap-2 ${isCreating ? 'opacity-70 cursor-not-allowed' : ''}`}
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
					</div>
				</div>
			)}
		</div>
	);
};

export default CouponsTab;
