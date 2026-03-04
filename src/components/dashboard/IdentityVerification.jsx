import React, { useState, useEffect } from 'react';
import apiRequest, { notyf } from '../../services/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Pede autorização ao backend e faz upload directo para o Cloudinary. */
const uploadToCloudinary = async (file, folder) => {
	// 1. Pedir assinatura ao backend
	const auth = await apiRequest(`/cloudinary/authorize-upload?folder=${folder}`);
	if (!auth.success) throw new Error(auth.message || 'Falha ao autorizar upload.');

	// 2. Fazer upload directo para o Cloudinary
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

	if (!response.ok) {
		const msg = result?.error?.message || `Cloudinary error ${response.status}`;
		throw new Error(msg);
	}

	return result.secure_url;
};

// ─── Componente de input de ficheiro ─────────────────────────────────────────
const FileInput = ({ label, icon, name, multiple, accept, onChange, preview }) => (
	<div className="space-y-2">
		<label className="block text-sm font-medium text-gray-700">{label}</label>
		<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
			<div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
				<span className="text-2xl mb-2">{icon}</span>
				<p className="text-sm text-gray-500 text-center px-4">
					{preview || (multiple ? 'Clique para seleccionar' : 'Clique para carregar')}
				</p>
			</div>
			<input type="file" name={name} multiple={multiple} onChange={onChange} className="hidden" accept={accept} />
		</label>
	</div>
);

// ─── Barra de progresso ───────────────────────────────────────────────────────

const ProgressBar = ({ current, total, label }) => (
	<div className="space-y-1">
		<p className="text-sm text-gray-500">{label}</p>
		<div className="w-full bg-gray-200 rounded-full h-2">
			<div
				className="bg-primary-600 h-2 rounded-full transition-all duration-300"
				style={{ width: `${(current / total) * 100}%` }}
			/>
		</div>
	</div>
);

// ─── Principal ────────────────────────────────────────────────────────────────

const IdentityVerification = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState({ current: 0, total: 5, label: '' });
	const [verificationStatus, setVerificationStatus] = useState(null); // null = a carregar

	const [files, setFiles] = useState({
		biFront: null,
		biBack: null,
		selfies: [],
	});

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const data = await apiRequest('/users/verification-status');
				if (data.success) setVerificationStatus(data.status);
				else setVerificationStatus('none');
			} catch {
				setVerificationStatus('none');
			}
		};
		fetchStatus();
	}, []);

	const handleFileChange = (e) => {
		const { name, files: picked } = e.target;
		if (name === 'biFront') setFiles((f) => ({ ...f, biFront: picked[0] || null }));
		else if (name === 'biBack') setFiles((f) => ({ ...f, biBack: picked[0] || null }));
		else if (name === 'selfies') setFiles((f) => ({ ...f, selfies: Array.from(picked).slice(0, 3) }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!files.biFront) return notyf.error('Carregue a frente do BI.');
		if (!files.biBack) return notyf.error('Carregue o verso do BI.');
		if (files.selfies.length < 3) return notyf.error('Seleccione exactamente 3 selfies.');

		setIsLoading(true);
		setProgress({ current: 0, total: 5, label: 'A preparar uploads...' });

		try {
			// ── Passo 1: upload frente do BI ────────────────────────────────
			setProgress({ current: 1, total: 5, label: 'A carregar frente do BI...' });
			const biFrontUrl = await uploadToCloudinary(files.biFront, 'bis');

			// ── Passo 2: upload verso do BI ──────────────────────────────────
			setProgress({ current: 2, total: 5, label: 'A carregar verso do BI...' });
			const biBackUrl = await uploadToCloudinary(files.biBack, 'bis');

			// ── Passos 3-5: upload das 3 selfies ────────────────────────────
			const picUrls = [];
			for (let i = 0; i < files.selfies.length; i++) {
				setProgress({ current: 3 + i, total: 5, label: `A carregar selfie ${i + 1} de 3...` });
				const url = await uploadToCloudinary(files.selfies[i], 'photos');
				picUrls.push(url);
			}

			// ── Passo final: actualizar BD ───────────────────────────────────
			setProgress({ current: 5, total: 5, label: 'A guardar documentos...' });
			const result = await apiRequest('/users/verify-identity', {
				method: 'POST',
				body: JSON.stringify({ biUrls: [biFrontUrl, biBackUrl], picUrls }),
			});

			if (result.success) {
				notyf.success('Documentos enviados com sucesso! Aguarde aprovação.');
				setVerificationStatus('pending');
			} else {
				notyf.error(result.msg || 'Erro ao guardar documentos.');
			}
		} catch (err) {
			console.error(err);
			notyf.error(err.message || 'Erro inesperado durante o envio.');
		} finally {
			setIsLoading(false);
		}
	};

	if (verificationStatus === null) {
		return (
			<div className="flex items-center justify-center py-20">
				<span className="text-gray-400 text-sm">A carregar estado de verificação...</span>
			</div>
		);
	}

	if (verificationStatus === 'pending') {
		return (
			<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
				<span className="text-6xl">⏳</span>
				<h2 className="text-2xl font-bold text-gray-900">Verificação em análise</h2>
				<p className="text-gray-500 max-w-sm">
                    Os seus documentos estão a ser analisados. Receberá uma notificação assim que a verificação for concluída.
				</p>
			</div>
		);
	}

	if (verificationStatus === 'verified') {
		return (
			<div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
				<span className="text-6xl">✅</span>
				<h2 className="text-2xl font-bold text-gray-900">Identidade verificada!</h2>
				<p className="text-gray-500 max-w-sm">
                    A sua identidade foi verificada com sucesso. Já pode criar a sua loja e vender produtos.
				</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Verificação de Identidade</h2>
			<p className="text-gray-500 mb-8">
                Para criar uma loja e vender produtos, precisamos confirmar a sua identidade.
                Envie uma foto nítida da <strong>frente</strong> e do <strong>verso</strong> do seu BI e <strong>3 selfies</strong>.
			</p>

			<form onSubmit={handleSubmit} className="max-w-2xl space-y-8">

				{/* BI — frente e verso */}
				<div className="space-y-4">
					<h3 className="text-base font-semibold text-gray-800">Bilhete de Identidade (BI)</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FileInput
							label="Frente do BI"
							icon="🪪"
							name="biFront"
							accept="image/*"
							onChange={handleFileChange}
							preview={files.biFront ? files.biFront.name : null}
						/>
						<FileInput
							label="Verso do BI"
							icon="🪪"
							name="biBack"
							accept="image/*"
							onChange={handleFileChange}
							preview={files.biBack ? files.biBack.name : null}
						/>
					</div>
				</div>

				{/* 3 Selfies */}
				<div className="space-y-4">
					<h3 className="text-base font-semibold text-gray-800">3 Selfies de Identificação</h3>
					<FileInput
						label="Seleccione 3 fotos"
						icon="📸"
						name="selfies"
						accept="image/*"
						multiple
						onChange={handleFileChange}
						preview={
							files.selfies.length > 0
								? `${files.selfies.length} foto${files.selfies.length > 1 ? 's' : ''} seleccionada${files.selfies.length > 1 ? 's' : ''}`
								: null
						}
					/>
					{files.selfies.length > 0 && (
						<div className="flex gap-3 flex-wrap">
							{files.selfies.map((photo, i) => (
								<span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg truncate max-w-[120px]">
									{photo.name}
								</span>
							))}
						</div>
					)}
				</div>

				{/* Progresso */}
				{isLoading && (
					<ProgressBar
						current={progress.current}
						total={progress.total}
						label={progress.label}
					/>
				)}

				<div className="pt-2">
					<button
						type="submit"
						disabled={isLoading}
						className="w-full md:w-auto px-10 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 disabled:opacity-60 cursor-pointer"
					>
						{isLoading ? 'A enviar...' : 'Enviar para Verificação'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default IdentityVerification;
