import React, { useState } from 'react';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';
import { formatCurrency } from '../../utils/currency';
import Modal from '../../components/admin/Modal';

const AdminDeliveryZones = () => {
	const [zones, setZones] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingZone, setEditingZone] = useState(null);
	const [form, setForm] = useState({ name: '', price: '' });
	const [saving, setSaving] = useState(false);

	const fetchZones = async () => {
		setLoading(true);
		try {
			const res = await http.get('/admin/delivery-zones', { admin: true });
			if (res?.success) setZones(res.data?.zones || []);
		} catch { } finally {
			setLoading(false);
		}
	};

	React.useEffect(() => { fetchZones(); }, []);

	const openNew = () => {
		setEditingZone(null);
		setForm({ name: '', price: '' });
		setModalOpen(true);
	};

	const openEdit = (zone) => {
		setEditingZone(zone);
		setForm({ name: zone.name, price: String(zone.price) });
		setModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim()) return notyf.error('O nome da zona é obrigatório.');
		if (!form.price || Number(form.price) < 0) return notyf.error('O preço deve ser um valor positivo.');

		setSaving(true);
		try {
			const payload = { name: form.name.trim(), price: Number(form.price) };
			let res;
			if (editingZone) {
				res = await http.put(`/admin/delivery-zones/${editingZone.id}`, payload, { admin: true });
			} else {
				res = await http.post('/admin/delivery-zones', payload, { admin: true });
			}
			if (res?.success) {
				notyf.success(editingZone ? 'Zona actualizada!' : 'Zona criada!');
				setModalOpen(false);
				fetchZones();
			} else {
				notyf.error(res?.msg || 'Erro ao guardar.');
			}
		} catch {
			notyf.error('Erro ao conectar ao servidor.');
		} finally {
			setSaving(false);
		}
	};

	const handleToggleActive = async (zone) => {
		try {
			const res = await http.put(`/admin/delivery-zones/${zone.id}`, { isActive: !zone.isActive }, { admin: true });
			if (res?.success) {
				notyf.success(zone.isActive ? 'Zona desactivada.' : 'Zona activada.');
				fetchZones();
			}
		} catch {
			notyf.error('Erro ao actualizar zona.');
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Tem a certeza que quer eliminar esta zona?')) return;
		try {
			const res = await http.delete(`/admin/delivery-zones/${id}`, { admin: true });
			if (res?.success) {
				notyf.success('Zona eliminada.');
				fetchZones();
			}
		} catch {
			notyf.error('Erro ao eliminar zona.');
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-accent/10">
				<div>
					<h2 className="text-2xl font-display font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						Zonas de Entrega
					</h2>
					<p className="text-sm text-[#78716C] mt-1 font-body">Defina as zonas de entrega e os respectivos preços para a plataforma.</p>
				</div>
				<button onClick={openNew}
					className="px-6 py-2.5 text-sm font-display font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-all shadow-sm cursor-pointer">
					+ Nova Zona
				</button>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-accent/10 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-sand/50 border-b border-accent/10">
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Zona</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Preço</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Estado</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider text-right">Acções</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-accent/10">
							{loading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<tr key={i} className="animate-pulse">
										<td className="px-6 py-4"><div className="h-4 bg-accent/20 rounded w-32" /></td>
										<td className="px-6 py-4"><div className="h-4 bg-accent/20 rounded w-20" /></td>
										<td className="px-6 py-4"><div className="h-5 bg-accent/20 rounded w-16" /></td>
										<td className="px-6 py-4"><div className="h-4 bg-accent/20 rounded w-24 ml-auto" /></td>
									</tr>
								))
							) : zones.length > 0 ? (
								zones.map((zone) => (
									<tr key={zone.id} className="hover:bg-sand/50 transition-colors group">
										<td className="px-6 py-4">
											<span className="text-sm font-bold text-[#1C1917]">{zone.name}</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm font-semibold text-accent">{formatCurrency(Number(zone.price))}</span>
										</td>
										<td className="px-6 py-4">
											<button onClick={() => handleToggleActive(zone)}
												className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer transition-all ${zone.isActive
													? 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
													: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
												}`}>
												{zone.isActive ? 'Activo' : 'Inactivo'}
											</button>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button onClick={() => openEdit(zone)}
													className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sand/50 text-[#1C1917] hover:bg-accent/20 border border-accent/20 transition-all cursor-pointer">
													Editar
												</button>
												<button onClick={() => handleDelete(zone.id)}
													className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all cursor-pointer">
													Eliminar
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className="px-6 py-16 text-center text-[#78716C]">
										<div className="flex flex-col items-center">
											<svg className="w-12 h-12 text-accent/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											<p className="text-base font-semibold">Nenhuma zona de entrega definida.</p>
											<p className="text-sm mt-1">Crie a primeira zona para começar.</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="sm">
				<div className="p-6 border-b border-accent/10 flex justify-between items-center bg-sand/30">
					<h3 className="text-lg font-display font-bold text-[#1C1917]">{editingZone ? 'Editar Zona' : 'Nova Zona de Entrega'}</h3>
					<button onClick={() => setModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Nome da Zona</label>
						<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
							className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
							placeholder="Ex: Luanda" />
					</div>
					<div>
						<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Preço de Entrega (Kz)</label>
						<input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
							min="0" step="0.01"
							className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
							placeholder="0.00" />
					</div>
					<div className="pt-4 flex justify-end gap-3">
						<button type="button" onClick={() => setModalOpen(false)}
							className="px-5 py-2.5 text-sm font-display font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-sand rounded-xl transition-colors cursor-pointer">
							Cancelar
						</button>
						<button type="submit" disabled={saving}
							className="px-6 py-2.5 text-sm font-display font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-all disabled:bg-[#78716C]/50 cursor-pointer">
							{saving ? 'A guardar...' : editingZone ? 'Guardar Alterações' : 'Criar Zona'}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AdminDeliveryZones;
