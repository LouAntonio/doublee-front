import React, { useState, useEffect } from 'react';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';
import Modal from '../../components/admin/Modal';

const METHOD_LABELS = {
	multicaixa_express: 'Multicaixa Express',
	transferencia_bancaria: 'Transferência Bancária',
};

const AdminPaymentSettings = () => {
	const [settings, setSettings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingMethod, setEditingMethod] = useState('');
	const [form, setForm] = useState({ name: '', phone: '', bank: '', iban: '', isActive: true });
	const [saving, setSaving] = useState(false);

	const [platformSettings, setPlatformSettings] = useState({ platformRetentionFee: '', payoutRetentionDays: '' });
	const [platformLoading, setPlatformLoading] = useState(true);
	const [platformSaving, setPlatformSaving] = useState(false);
	const [platformModalOpen, setPlatformModalOpen] = useState(false);
	const [platformForm, setPlatformForm] = useState({ platformRetentionFee: '', payoutRetentionDays: '' });

	const fetchSettings = async () => {
		setLoading(true);
		try {
			const res = await http.get('/admin/payment-settings', { admin: true });
			if (res?.success) setSettings(res.data?.settings || []);
		} catch { } finally {
			setLoading(false);
		}
	};

	const refreshSettings = () => fetchSettings();

	useEffect(() => {
		const loadSettings = async () => {
			try {
				const res = await http.get('/admin/payment-settings', { admin: true });
				if (res?.success) setSettings(res.data?.settings || []);
			} catch { } finally {
				setLoading(false);
			}
		};
		loadSettings();
	}, []);

	const fetchPlatformSettings = async () => {
		setPlatformLoading(true);
		try {
			const res = await http.get('/admin/platform-settings', { admin: true });
			if (res?.success) {
				const s = res.data?.settings || res.data;
				setPlatformSettings({
					platformRetentionFee: s?.platformRetentionFee ?? '',
					payoutRetentionDays: s?.payoutRetentionDays ?? '',
				});
			}
		} catch { } finally {
			setPlatformLoading(false);
		}
	};

	const refreshPlatformSettings = () => fetchPlatformSettings();

	useEffect(() => {
		const loadPlatformSettings = async () => {
			try {
				const res = await http.get('/admin/platform-settings', { admin: true });
				if (res?.success) {
					const s = res.data?.settings || res.data;
					setPlatformSettings({
						platformRetentionFee: s?.platformRetentionFee ?? '',
						payoutRetentionDays: s?.payoutRetentionDays ?? '',
					});
				}
			} catch { } finally {
				setPlatformLoading(false);
			}
		};
		loadPlatformSettings();
	}, []);

	const openEdit = (setting) => {
		setEditingMethod(setting.method);
		setForm({
			name: setting.name || '',
			phone: setting.phone || '',
			bank: setting.bank || '',
			iban: setting.iban || '',
			isActive: setting.isActive !== false,
		});
		setModalOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await http.put(`/admin/payment-settings/${editingMethod}`, form, { admin: true });
			if (res?.success) {
				notyf.success('Configuração guardada com sucesso!');
				setModalOpen(false);
				refreshSettings();
			} else {
				notyf.error(res?.msg || 'Erro ao guardar.');
			}
		} catch {
			notyf.error('Erro ao conectar ao servidor.');
		} finally {
			setSaving(false);
		}
	};

	const handleToggleActive = async (setting) => {
		try {
			const res = await http.put(`/admin/payment-settings/${setting.method}`, { isActive: !setting.isActive }, { admin: true });
			if (res?.success) {
				notyf.success(setting.isActive ? 'Desactivado.' : 'Activado.');
				refreshSettings();
			}
		} catch {
			notyf.error('Erro ao actualizar.');
		}
	};

	const openPlatformEdit = () => {
		setPlatformForm({
			platformRetentionFee: platformSettings.platformRetentionFee ?? '',
			payoutRetentionDays: platformSettings.payoutRetentionDays ?? '',
		});
		setPlatformModalOpen(true);
	};

	const handlePlatformSubmit = async (e) => {
		e.preventDefault();
		setPlatformSaving(true);
		try {
			const payload = {
				platformRetentionFee: platformForm.platformRetentionFee === '' ? 0 : parseFloat(platformForm.platformRetentionFee),
				payoutRetentionDays: platformForm.payoutRetentionDays === '' ? 0 : parseInt(platformForm.payoutRetentionDays, 10),
			};
			const res = await http.put('/admin/platform-settings', payload, { admin: true });
			if (res?.success) {
				notyf.success('Configurações da plataforma guardadas com sucesso!');
				setPlatformModalOpen(false);
				refreshPlatformSettings();
			} else {
				notyf.error(res?.msg || 'Erro ao guardar.');
			}
		} catch {
			notyf.error('Erro ao conectar ao servidor.');
		} finally {
			setPlatformSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-accent/10">
				<div>
					<h2 className="text-2xl font-display font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
						</svg>
						Configurações de Pagamento
					</h2>
					<p className="text-sm text-[#78716C] mt-1 font-body">Coordenadas de pagamento exibidas aos clientes durante o checkout.</p>
				</div>
			</div>

			<div className="bg-white rounded-2xl shadow-sm border border-accent/10 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="bg-sand/50 border-b border-accent/10">
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Método</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Telefone</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Banco</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">IBAN</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider">Estado</th>
								<th className="px-6 py-4 text-xs font-display font-bold text-[#78716C] uppercase tracking-wider text-right">Acções</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-accent/10">
							{loading ? (
								Array.from({ length: 2 }).map((_, i) => (
									<tr key={i} className="animate-pulse">
										{Array.from({ length: 6 }).map((_, j) => (
											<td key={j} className="px-6 py-4"><div className="h-4 bg-accent/20 rounded" /></td>
										))}
									</tr>
								))
							) : settings.length > 0 ? (
								settings.map((s) => (
									<tr key={s.method} className="hover:bg-sand/50 transition-colors">
										<td className="px-6 py-4 font-display font-bold text-sm text-[#1C1917]">
											{METHOD_LABELS[s.method] || s.method}
										</td>
										<td className="px-6 py-4 text-sm text-[#78716C]">{s.phone || '—'}</td>
										<td className="px-6 py-4 text-sm text-[#78716C]">{s.bank || '—'}</td>
										<td className="px-6 py-4 text-sm text-[#78716C]">{s.iban || '—'}</td>
										<td className="px-6 py-4">
											<button onClick={() => handleToggleActive(s)}
												className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer transition-all ${s.isActive
													? 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
													: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
												}`}>
												{s.isActive ? 'Activo' : 'Inactivo'}
											</button>
										</td>
										<td className="px-6 py-4 text-right">
											<button onClick={() => openEdit(s)}
												className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sand/50 text-[#1C1917] hover:bg-accent/20 border border-accent/20 transition-all cursor-pointer">
												Editar
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="px-6 py-16 text-center text-[#78716C]">
										Nenhuma configuração encontrada.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="sm">
				<div className="p-6 border-b border-accent/10 flex justify-between items-center bg-sand/30">
					<h3 className="text-lg font-display font-bold text-[#1C1917]">
						Editar — {METHOD_LABELS[editingMethod] || editingMethod}
					</h3>
					<button onClick={() => setModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Nome / Titular</label>
						<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
							className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
							placeholder="Nome que aparece nas coordenadas" />
					</div>
					{editingMethod === 'multicaixa_express' && (
						<div>
							<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Número Multicaixa Express</label>
							<input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
								className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
								placeholder="+244 9XX XXX XXX" />
						</div>
					)}
					{editingMethod === 'transferencia_bancaria' && (
						<>
							<div>
								<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Banco</label>
								<input type="text" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })}
									className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
									placeholder="Ex: BAI" />
							</div>
							<div>
								<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">IBAN</label>
								<input type="text" value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })}
									className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
									placeholder="AO06 0000 0123 4567 8901 2345 6" />
							</div>
						</>
					)}
					<div className="flex items-center gap-3 pt-2">
						<input type="checkbox" id="isActive" checked={form.isActive}
							onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
							className="w-4 h-4 accent-accent rounded" />
						<label htmlFor="isActive" className="text-sm font-display font-semibold text-[#1C1917]">Visível aos clientes</label>
					</div>
					<div className="pt-4 flex justify-end gap-3">
						<button type="button" onClick={() => setModalOpen(false)}
							className="px-5 py-2.5 text-sm font-display font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-sand rounded-xl transition-colors cursor-pointer">
							Cancelar
						</button>
						<button type="submit" disabled={saving}
							className="px-6 py-2.5 text-sm font-display font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-all disabled:bg-[#78716C]/50 cursor-pointer">
							{saving ? 'A guardar...' : 'Guardar Alterações'}
						</button>
					</div>
				</form>
			</Modal>

			{/* Platform Settings Section */}
			<div className="bg-white rounded-2xl shadow-sm border border-accent/10 overflow-hidden">
				<div className="p-6 border-b border-accent/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
					<div>
						<h2 className="text-2xl font-display font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
							<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
							</svg>
							Configurações da Plataforma
						</h2>
						<p className="text-sm text-[#78716C] mt-1 font-body">Taxas de retenção e prazos de pagamento.</p>
					</div>
					<button onClick={openPlatformEdit}
						className="px-4 py-2 text-sm font-display font-semibold rounded-lg bg-sand/50 text-[#1C1917] hover:bg-accent/20 border border-accent/20 transition-all cursor-pointer">
						Editar
					</button>
				</div>
				<div className="p-6">
					{platformLoading ? (
						<div className="animate-pulse space-y-3">
							<div className="h-4 bg-accent/20 rounded w-1/2" />
							<div className="h-4 bg-accent/20 rounded w-1/3" />
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="p-4 bg-sand/30 rounded-xl border border-accent/10">
								<p className="text-xs text-[#78716C] uppercase tracking-wider font-display font-bold mb-1">Taxa de Retenção da Plataforma</p>
								<p className="text-lg font-bold text-[#1C1917]">{platformSettings.platformRetentionFee ?? '0'}%</p>
							</div>
							<div className="p-4 bg-sand/30 rounded-xl border border-accent/10">
								<p className="text-xs text-[#78716C] uppercase tracking-wider font-display font-bold mb-1">Dias de Retenção (Payout)</p>
								<p className="text-lg font-bold text-[#1C1917]">{platformSettings.payoutRetentionDays ?? '0'} dias</p>
							</div>
						</div>
					)}
				</div>
			</div>

			<Modal isOpen={platformModalOpen} onClose={() => setPlatformModalOpen(false)} size="sm">
				<div className="p-6 border-b border-accent/10 flex justify-between items-center bg-sand/30">
					<h3 className="text-lg font-display font-bold text-[#1C1917]">
						Editar Configurações da Plataforma
					</h3>
					<button onClick={() => setPlatformModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				</div>
				<form onSubmit={handlePlatformSubmit} className="p-6 space-y-4">
					<div>
						<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Taxa de Retenção da Plataforma (%)</label>
						<input type="number" value={platformForm.platformRetentionFee} onChange={(e) => setPlatformForm({ ...platformForm, platformRetentionFee: e.target.value })} min="0" max="100" step="0.01"
							className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
							placeholder="Ex: 5" />
						<p className="text-xs text-[#78716C] mt-1">Percentagem retida pela plataforma em cada venda.</p>
					</div>
					<div>
						<label className="block text-sm font-display font-semibold text-[#1C1917] mb-2">Dias de Retenção (Payout)</label>
						<input type="number" value={platformForm.payoutRetentionDays} onChange={(e) => setPlatformForm({ ...platformForm, payoutRetentionDays: e.target.value })} min="0" step="1"
							className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-sand/50 text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none"
							placeholder="Ex: 7" />
						<p className="text-xs text-[#78716C] mt-1">Número de dias que o valor fica retido antes do pagamento ao vendedor.</p>
					</div>
					<div className="pt-4 flex justify-end gap-3">
						<button type="button" onClick={() => setPlatformModalOpen(false)}
							className="px-5 py-2.5 text-sm font-display font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-sand rounded-xl transition-colors cursor-pointer">
							Cancelar
						</button>
						<button type="submit" disabled={platformSaving}
							className="px-6 py-2.5 text-sm font-display font-semibold text-white bg-accent hover:bg-accent-dark rounded-xl transition-all disabled:bg-[#78716C]/50 cursor-pointer">
							{platformSaving ? 'A guardar...' : 'Guardar Alterações'}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default AdminPaymentSettings;