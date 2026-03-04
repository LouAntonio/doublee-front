import React, { useState } from 'react';
import apiRequest, { notyf } from '../../../services/api';
import { ANGOLA_PROVINCES, uploadToCloudinary } from './constants';
import SectionTitle from './ui/SectionTitle';
import ImagePicker from './ui/ImagePicker';

const StoreInfoTab = ({ store, onUpdated }) => {
	const [saving, setSaving] = useState(false);
	const [progress, setProgress] = useState('');
	const [form, setForm] = useState({
		name: store?.name || '',
		description: store?.description || '',
		province: store?.province || '',
		location: store?.location || '',
		workingHours: store?.workingHours || '',
		phone: store?.phone || '',
		email: store?.email || '',
		iban: store?.iban || '',
		bankName: store?.bankName || '',
		paypayAccount: store?.paypayAccount || '',
	});
	const [images, setImages] = useState({ logo: null, banner: null });
	const [previews, setPreviews] = useState({ logo: store?.logo || '', banner: store?.banner || '' });

	const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
	const handleImage = e => {
		const { name, files } = e.target;
		const file = files[0];
		if (!file) return;
		setImages(prev => ({ ...prev, [name]: file }));
		setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!form.name.trim()) return notyf.error('O nome da loja é obrigatório.');
		if (!form.province) return notyf.error('Seleccione a província.');
		if (!form.iban.trim()) return notyf.error('O IBAN é obrigatório.');
		if (!form.bankName.trim()) return notyf.error('O nome da conta bancária é obrigatório.');

		setSaving(true);
		try {
			const payload = { ...form };

			if (images.logo) {
				setProgress('A carregar logotipo...');
				payload.logo = await uploadToCloudinary(images.logo, 'storeLogos');
			}
			if (images.banner) {
				setProgress('A carregar banner...');
				payload.banner = await uploadToCloudinary(images.banner, 'storeBanners');
			}

			setProgress('A guardar alterações...');
			const data = await apiRequest('/stores/update', {
				method: 'PUT',
				body: JSON.stringify(payload),
			});

			if (data.success) {
				notyf.success('Informações da loja actualizadas!');
				onUpdated?.();
			} else {
				notyf.error(data.msg || 'Erro ao actualizar loja.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao conectar com o servidor.');
		} finally {
			setSaving(false);
			setProgress('');
		}
	};

	return (
		<div>
			<h2 className="text-lg font-bold text-gray-900 mb-1">Informações da Loja</h2>
			<p className="text-sm text-gray-400 mb-6">Edite os dados públicos e financeiros da sua loja.</p>

			<form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
				<div>
					<SectionTitle>Identidade Visual</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<ImagePicker label="Logotipo" name="logo" preview={previews.logo} onChange={handleImage} aspectHint="Recomendado: 400×400 px" />
						<ImagePicker label="Banner" name="banner" preview={previews.banner} onChange={handleImage} aspectHint="Recomendado: 1200×400 px" />
					</div>
				</div>

				<div>
					<SectionTitle>Informações Gerais</SectionTitle>
					<div className="space-y-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Nome da Loja <span className="text-red-500">*</span></label>
							<input type="text" name="name" value={form.name} onChange={handleChange} required
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Nome da sua marca" />
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Descrição</label>
							<textarea name="description" value={form.description} onChange={handleChange} rows="3"
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Descreva a sua loja brevemente..." />
						</div>
					</div>
				</div>

				<div>
					<SectionTitle>Localização</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Província <span className="text-red-500">*</span></label>
							<select name="province" value={form.province} onChange={handleChange} required
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all bg-white">
								<option value="">Seleccione a província</option>
								{ANGOLA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
							</select>
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Endereço</label>
							<input type="text" name="location" value={form.location} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Bairro, Rua, nº..." />
						</div>
					</div>
				</div>

				<div>
					<SectionTitle>Contacto e Horário</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Email Comercial</label>
							<input type="email" name="email" value={form.email} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="loja@exemplo.com" />
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Telefone Comercial</label>
							<input type="tel" name="phone" value={form.phone} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="+244 9XX XXX XXX" />
						</div>
						<div className="space-y-1.5 md:col-span-2">
							<label className="text-sm font-medium text-gray-700">Horário de Funcionamento</label>
							<input type="text" name="workingHours" value={form.workingHours} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Ex: Seg–Sex 08:00–18:00 | Sáb 08:00–13:00" />
						</div>
					</div>
				</div>

				<div>
					<SectionTitle>Dados de Pagamento</SectionTitle>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">IBAN <span className="text-red-500">*</span></label>
								<input type="text" name="iban" value={form.iban} onChange={handleChange} required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="AO06 0006 0000 XXXX XXXX" />
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-gray-700">Nome da Conta <span className="text-red-500">*</span></label>
								<input type="text" name="bankName" value={form.bankName} onChange={handleChange} required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Nome tal como consta no banco" />
							</div>
						</div>
						<div className="space-y-1.5">
							<label className="text-sm font-medium text-gray-700">Número PayPay <span className="text-gray-400 font-normal">(opcional)</span></label>
							<input type="text" name="paypayAccount" value={form.paypayAccount} onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-all" placeholder="Número de telefone associado ao PayPay" />
						</div>
					</div>
				</div>

				<div className="pt-2 flex items-center gap-4">
					<button type="submit" disabled={saving}
						className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-primary-100">
						{saving ? 'A guardar...' : 'Guardar Alterações'}
					</button>
					{saving && progress && <p className="text-sm text-gray-400 animate-pulse">{progress}</p>}
				</div>
			</form>
		</div>
	);
};

export default StoreInfoTab;
