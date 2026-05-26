import React, { useState } from 'react';
import { useAdminPromotionPackages, useCreatePromotionPackage, useUpdatePromotionPackage, useDeletePromotionPackage } from '../../hooks/queries/useAdminPromotions';

const AdminPromotions = () => {
	const { data: packages = [], isLoading: loading } = useAdminPromotionPackages();
	const createPackage = useCreatePromotionPackage();
	const updatePackage = useUpdatePromotionPackage();
	const deletePackage = useDeletePromotionPackage();
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [editingPackage, setEditingPackage] = useState(null);

	// Form states
	const [formData, setFormData] = useState({
		name: '',
		type: 'STORE',
		durationDays: 7,
		price: 0
	});

	const handleCreate = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		try {
			await createPackage.mutateAsync(formData);
			setFormData({ name: '', type: 'STORE', durationDays: 7, price: 0 });
		} catch {
			// handled by mutation
		} finally {
			setIsCreating(false);
		}
	};

	const handleEditClick = (pkg) => {
		setEditingPackage(pkg);
		setFormData({
			name: pkg.name,
			type: pkg.type,
			durationDays: pkg.durationDays,
			price: pkg.price
		});
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		setIsUpdating(true);
		try {
			await updatePackage.mutateAsync({ id: editingPackage.id, formData });
			setEditingPackage(null);
			setFormData({ name: '', type: 'STORE', durationDays: 7, price: 0 });
		} catch {
			// handled by mutation
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem certeza que deseja remover este pacote?')) return;
		try {
			await deletePackage.mutateAsync(id);
		} catch {
			// handled by mutation
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-accent/10">
				<div>
					<h2 className="text-2xl font-display font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
						</svg>
						Gestão de Promoções
					</h2>
					<p className="text-sm text-[#78716C] mt-1">Crie pacotes de destaque para lojas e produtos.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Form Card */}
				<div className="lg:col-span-1">
					<div className="bg-white p-6 rounded-2xl shadow-sm border border-accent/10 sticky top-24">
						<h3 className="text-lg font-display font-bold text-[#1C1917] mb-4">
							{editingPackage ? 'Editar Pacote' : 'Novo Pacote'}
						</h3>
						<form onSubmit={editingPackage ? handleUpdate : handleCreate} className="space-y-4">
							<div>
								<label className="block text-sm font-display font-semibold text-[#1C1917] mb-1">Nome do Pacote</label>
								<input
									type="text"
									required
									className="w-full px-4 py-2 rounded-xl border border-accent/20 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									placeholder="Ex: Destaque Loja Prata"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								/>
							</div>
							<div>
								<label className="block text-sm font-display font-semibold text-[#1C1917] mb-1">Tipo</label>
								<select
									className="w-full px-4 py-2 rounded-xl border border-accent/20 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									value={formData.type}
									onChange={(e) => setFormData({ ...formData, type: e.target.value })}
								>
									<option value="STORE">Loja</option>
									<option value="PRODUCT">Produto</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-display font-semibold text-[#1C1917] mb-1">Duração (Dias)</label>
								<input
									type="number"
									required
									min="1"
									className="w-full px-4 py-2 rounded-xl border border-accent/20 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									value={formData.durationDays}
									onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
								/>
							</div>
							<div>
								<label className="block text-sm font-display font-semibold text-[#1C1917] mb-1">Preço (Kz)</label>
								<input
									type="number"
									required
									min="0"
									step="0.01"
									className="w-full px-4 py-2 rounded-xl border border-accent/20 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									value={formData.price}
									onChange={(e) => setFormData({ ...formData, price: e.target.value })}
								/>
							</div>
							<div className="pt-2 flex gap-2">
								<button
									type="submit"
									disabled={isCreating || isUpdating}
									className="flex-1 bg-accent text-white py-2.5 rounded-xl font-bold hover:bg-accent-dark transition-colors disabled:bg-[#78716C]/50"
								>
									{isCreating || isUpdating ? 'Processando...' : editingPackage ? 'Actualizar' : 'Criar Pacote'}
								</button>
								{editingPackage && (
									<button
										type="button"
										onClick={() => {
											setEditingPackage(null);
											setFormData({ name: '', type: 'STORE', durationDays: 7, price: 0 });
										}}
										className="px-4 py-2.5 bg-sand text-[#78716C] rounded-xl font-bold hover:bg-accent/20 transition-colors"
									>
										Cancelar
									</button>
								)}
							</div>
						</form>
					</div>
				</div>

				{/* Table Card */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-2xl shadow-sm border border-accent/10 overflow-hidden">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-sand/50 border-b border-accent/10">
									<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Pacote</th>
									<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Tipo</th>
									<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Duração</th>
									<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Preço</th>
									<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider text-right">Acções</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-accent/10 text-sm">
								{loading ? (
									<tr><td colSpan="5" className="px-6 py-10 text-center text-[#78716C]">Carregando...</td></tr>
								) : packages.length > 0 ? (
									packages.map((pkg) => (
										<tr key={pkg.id} className="hover:bg-sand/50 transition-colors">
											<td className="px-6 py-4 font-bold text-[#1C1917]">{pkg.name}</td>
											<td className="px-6 py-4">
												<span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${pkg.type === 'STORE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
													{pkg.type === 'STORE' ? 'Loja' : 'Produto'}
												</span>
											</td>
											<td className="px-6 py-4">{pkg.durationDays} dias</td>
											<td className="px-6 py-4 font-mono font-bold text-accent-dark">
												{parseFloat(pkg.price).toLocaleString('pt-AO')} Kz
											</td>
											<td className="px-6 py-4 text-right space-x-2">
												<button
													onClick={() => handleEditClick(pkg)}
													className="text-[#78716C] hover:text-[#78716C] transition-colors"
													title="Editar"
												>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
												</button>
												<button
													onClick={() => handleDelete(pkg.id)}
													className="text-[#78716C] hover:text-rose-600 transition-colors"
													title="Remover"
												>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
												</button>
											</td>
										</tr>
									))
								) : (
									<tr><td colSpan="5" className="px-6 py-10 text-center text-[#78716C]">Nenhum pacote criado.</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPromotions;




