import React, { useState, useEffect } from 'react';
import apiRequest, { notyf } from '../../services/api';

// ─── Provinces ───────────────────────────────────────────────────────────────
const ANGOLA_PROVINCES = [
	'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
	'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
	'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
	'Namibe', 'Uíge', 'Zaire',
];

// ─── Upload helper ────────────────────────────────────────────────────────────
const uploadToCloudinary = async (file, folder) => {
	const auth = await apiRequest(`/cloudinary/authorize-upload?folder=${folder}`);
	if (!auth.success) throw new Error(auth.message || 'Falha ao autorizar upload.');

	const formData = new FormData();
	formData.append('file', file);
	formData.append('api_key', auth.apikey);
	formData.append('timestamp', auth.timestamp);
	formData.append('signature', auth.signature);
	formData.append('folder', auth.folder);

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${auth.cloudname}/image/upload`,
		{ method: 'POST', body: formData }
	);
	const result = await response.json();
	if (!response.ok) throw new Error(result?.error?.message || `Cloudinary error ${response.status}`);
	return result.secure_url;
};

// ─── Image Picker ─────────────────────────────────────────────────────────────
const ImagePicker = ({ label, name, preview, onChange, aspectHint }) => (
	<div className="space-y-2">
		<label className="block text-sm font-medium text-gray-700">{label}</label>
		<label className="relative flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden"
			style={{ minHeight: '7rem' }}>
			{preview ? (
				<img src={preview} alt={label} className="w-full h-full object-cover absolute inset-0 rounded-2xl" style={{ maxHeight: '10rem' }} />
			) : (
				<div className="flex flex-col items-center justify-center py-6 pointer-events-none px-4 text-center">
					<span className="text-3xl mb-2">🖼️</span>
					<p className="text-sm text-gray-500">Clique para seleccionar</p>
					{aspectHint && <p className="text-xs text-gray-400 mt-1">{aspectHint}</p>}
				</div>
			)}
			<input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
		</label>
		{preview && (
			<p className="text-xs text-green-600 font-medium">✓ Imagem seleccionada</p>
		)}
	</div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
	<h3 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-5">{children}</h3>
);

// ─── Main component ───────────────────────────────────────────────────────────
const StoreCreation = ({ verificationStatus }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState('');
	// null = a carregar | 'none' = sem loja | 'pending' | 'approved' | 'rejected' | 'suspended'
	const [storeStatus, setStoreStatus] = useState(null);

	useEffect(() => {
		if (verificationStatus !== 'verified') return;
		const fetchStatus = async () => {
			try {
				const data = await apiRequest('/stores/status');
				if (data.success){
					setStoreStatus(data.data.status);
					console.log('Status da loja:', data);
				}
				else setStoreStatus('none');
			} catch {
				setStoreStatus('none');
			}
		};
		fetchStatus();
	}, [verificationStatus]);

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		province: '',
		location: '',
		workingHours: '',
		phone: '',
		email: '',
		iban: '',
		bankName: '',
		paypayAccount: '',
	});

	const [images, setImages] = useState({ logo: null, banner: null });
	const [previews, setPreviews] = useState({ logo: '', banner: '' });

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		const { name, files } = e.target;
		const file = files[0];
		if (!file) return;
		setImages((prev) => ({ ...prev, [name]: file }));
		setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name) return notyf.error('O nome da loja é obrigatório.');
		if (!formData.province) return notyf.error('Seleccione a província.');
		if (!formData.iban) return notyf.error('O IBAN é obrigatório.');
		if (!formData.bankName) return notyf.error('O nome da conta bancária é obrigatório.');

		setIsLoading(true);

		try {
			const payload = { ...formData };

			if (images.logo) {
				setProgress('A carregar logotipo...');
				payload.logo = await uploadToCloudinary(images.logo, 'storeLogos');
			}

			if (images.banner) {
				setProgress('A carregar banner...');
				payload.banner = await uploadToCloudinary(images.banner, 'storeBanners');
			}

			setProgress('A criar loja...');
			const data = await apiRequest('/stores/create', {
				method: 'POST',
				body: JSON.stringify(payload),
			});

			if (data.success) {
				notyf.success('Loja criada com sucesso! Aguarde a aprovação.');
				setStoreStatus('pending');
			} else {
				notyf.error(data.msg || 'Erro ao criar loja.');
			}
		} catch (error) {
			notyf.error(error.message || 'Erro ao conectar com o servidor.');
		} finally {
			setIsLoading(false);
			setProgress('');
		}
	};

	if (verificationStatus !== 'verified') {
		return (
			<div className="text-center py-16 bg-blue-50 rounded-2xl border border-blue-100 p-8">
				<span className="text-4xl mb-4 block">🔒</span>
				<h3 className="text-xl font-bold text-gray-900 mb-2">Verificação Necessária</h3>
				<p className="text-gray-600 max-w-md mx-auto">
                    Você precisa validar sua identidade antes de poder criar uma loja.
                    Vá para a aba de <strong>Verificação</strong> para começar.
				</p>
			</div>
		);
	}

	if (storeStatus === null) {
		return (
			<div className="flex items-center justify-center py-20">
				<span className="text-gray-400 text-sm">A carregar estado da loja...</span>
			</div>
		);
	}

	if (storeStatus === 'pending') {
		return (
			<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
				<span className="text-6xl">⏳</span>
				<h2 className="text-2xl font-bold text-gray-900">Loja em análise</h2>
				<p className="text-gray-500 max-w-sm">
                    A sua loja foi submetida e está a ser analisada pela nossa equipa.
                    Receberá uma notificação assim que for aprovada.
				</p>
			</div>
		);
	}

	if (storeStatus === 'approved') {
		return (
			<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
				<span className="text-6xl">✅</span>
				<h2 className="text-2xl font-bold text-gray-900">Loja aprovada!</h2>
				<p className="text-gray-500 max-w-sm">
                    A sua loja foi aprovada com sucesso. Já pode começar a adicionar produtos e vender.
				</p>
			</div>
		);
	}

	if (storeStatus === 'rejected') {
		return (
			<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
				<span className="text-6xl">❌</span>
				<h2 className="text-2xl font-bold text-gray-900">Loja rejeitada</h2>
				<p className="text-gray-500 max-w-sm">
                    A sua loja não foi aprovada. Entre em contacto com o suporte para mais informações.
				</p>
			</div>
		);
	}

	if (storeStatus === 'suspended') {
		return (
			<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
				<span className="text-6xl">🚫</span>
				<h2 className="text-2xl font-bold text-gray-900">Loja suspensa</h2>
				<p className="text-gray-500 max-w-sm">
                    A sua loja foi suspensa. Entre em contacto com o suporte para resolver a situação.
				</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-2">Configurar Minha Loja</h2>
			<p className="text-gray-500 mb-8">Preencha os dados da sua nova loja para começar a vender.</p>

			<form onSubmit={handleSubmit} className="max-w-2xl space-y-10">

				{/* ── Identidade visual ─────────────────────────────────── */}
				<div>
					<SectionTitle>Identidade Visual</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<ImagePicker
							label="Logotipo da Loja"
							name="logo"
							preview={previews.logo}
							onChange={handleImageChange}
							aspectHint="Recomendado: 400 × 400 px"
						/>
						<ImagePicker
							label="Banner da Loja"
							name="banner"
							preview={previews.banner}
							onChange={handleImageChange}
							aspectHint="Recomendado: 1200 × 400 px"
						/>
					</div>
				</div>

				{/* ── Informações gerais ────────────────────────────────── */}
				<div>
					<SectionTitle>Informações Gerais</SectionTitle>
					<div className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Nome da Loja <span className="text-red-500">*</span></label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="Nome da sua marca"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Descrição</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								rows="4"
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="Conte um pouco sobre o que você vende..."
							/>
						</div>
					</div>
				</div>

				{/* ── Localização ───────────────────────────────────────── */}
				<div>
					<SectionTitle>Localização</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Província <span className="text-red-500">*</span></label>
							<select
								name="province"
								value={formData.province}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all bg-white"
							>
								<option value="">Seleccione a província</option>
								{ANGOLA_PROVINCES.map((p) => (
									<option key={p} value={p}>{p}</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Localização / Endereço</label>
							<input
								type="text"
								name="location"
								value={formData.location}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="Bairro, Rua, nº..."
							/>
						</div>
					</div>
				</div>

				{/* ── Contacto e horário ────────────────────────────────── */}
				<div>
					<SectionTitle>Contacto e Horário</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Email Comercial</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="loja@exemplo.com"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Telefone Comercial</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="+244 9XX XXX XXX"
							/>
						</div>

						<div className="space-y-2 md:col-span-2">
							<label className="text-sm font-medium text-gray-700">Horas de Trabalho</label>
							<input
								type="text"
								name="workingHours"
								value={formData.workingHours}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="Ex: Seg–Sex 08:00–18:00 | Sáb 08:00–13:00"
							/>
						</div>
					</div>
				</div>

				{/* ── Dados de pagamento ────────────────────────────────── */}
				<div>
					<SectionTitle>Dados de Pagamento</SectionTitle>
					<div className="space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">IBAN <span className="text-red-500">*</span></label>
								<input
									type="text"
									name="iban"
									value={formData.iban}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
									placeholder="AO06 0006 0000 XXXX XXXX"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Nome da Conta <span className="text-red-500">*</span></label>
								<input
									type="text"
									name="bankName"
									value={formData.bankName}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
									placeholder="Nome tal como consta no banco"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
                                Número PayPay <span className="text-gray-400 font-normal">(opcional)</span>
							</label>
							<input
								type="text"
								name="paypayAccount"
								value={formData.paypayAccount}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
								placeholder="Número de telefone associado ao PayPay"
							/>
						</div>
					</div>
				</div>

				{/* ── Submit ────────────────────────────────────────────── */}
				<div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<button
						type="submit"
						disabled={isLoading}
						className="px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-60 cursor-pointer"
					>
						{isLoading ? 'A criar...' : 'Criar Minha Loja'}
					</button>
					{isLoading && progress && (
						<p className="text-sm text-gray-500 animate-pulse">{progress}</p>
					)}
				</div>

			</form>
		</div>
	);
};

export default StoreCreation;
