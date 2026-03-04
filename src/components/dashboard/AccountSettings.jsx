import React, { useState } from 'react';
import apiRequest, { notyf } from '../../services/api';
import { IoMailOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const AccountSettings = () => {
	const [isLoadingEmail, setIsLoadingEmail] = useState(false);
	const [isLoadingPass, setIsLoadingPass] = useState(false);

	// Fluxo email: 'form'  envia OTP | 'otp'  confirma com código
	const [emailStep, setEmailStep] = useState('form');
	const [emailData, setEmailData] = useState({ newEmail: '', password: '' });
	const [otpCode, setOtpCode] = useState('');

	const [passData, setPassData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	// Passo 1: solicitar OTP
	const handleEmailRequest = async (e) => {
		e.preventDefault();
		setIsLoadingEmail(true);
		try {
			const data = await apiRequest('/users/request-email-change', {
				method: 'POST',
				body: JSON.stringify(emailData),
			});
			if (data.success) {
				notyf.success('Código enviado para o novo email!');
				setEmailStep('otp');
			} else {
				notyf.error(data.msg || 'Erro ao solicitar alteração.');
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setIsLoadingEmail(false);
		}
	};

	// Passo 2: confirmar OTP
	const handleEmailConfirm = async (e) => {
		e.preventDefault();
		setIsLoadingEmail(true);
		try {
			const data = await apiRequest('/users/update-email', {
				method: 'PUT',
				body: JSON.stringify({ newEmail: emailData.newEmail, code: otpCode }),
			});
			if (data.success) {
				notyf.success('Email actualizado com sucesso!');
				setEmailStep('form');
				setEmailData({ newEmail: '', password: '' });
				setOtpCode('');
			} else {
				notyf.error(data.msg || 'Código inválido ou expirado.');
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setIsLoadingEmail(false);
		}
	};

	// Palavra-passe
	const handlePassSubmit = async (e) => {
		e.preventDefault();
		if (passData.newPassword !== passData.confirmPassword)
			return notyf.error('As palavras-passe não coincidem!');
		if (passData.newPassword.length < 8)
			return notyf.error('A nova palavra-passe deve ter pelo menos 8 caracteres.');
		setIsLoadingPass(true);
		try {
			const data = await apiRequest('/users/update-password', {
				method: 'PUT',
				body: JSON.stringify({
					oldPassword: passData.currentPassword,
					newPassword: passData.newPassword,
				}),
			});
			if (data.success) {
				notyf.success('Palavra-passe actualizada com sucesso!');
				setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
			} else {
				notyf.error(data.msg || 'Erro ao actualizar palavra-passe.');
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setIsLoadingPass(false);
		}
	};

	const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all';

	return (
		<div className="space-y-10">

			{/* Email */}
			<section>
				<h2 className="text-xl font-semibold text-gray-900 mb-1">Alterar Email</h2>
				<p className="text-sm text-gray-400 mb-6">
					{emailStep === 'form'
						? 'Confirme a sua palavra-passe e introduza o novo email. Enviaremos um código de verificação.'
						: `Introduza o código de 6 dígitos enviado para ${emailData.newEmail}.`}
				</p>

				<div className="max-w-2xl">
					{emailStep === 'form' ? (
						<form onSubmit={handleEmailRequest} className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Novo Email</label>
								<input
									type="email"
									value={emailData.newEmail}
									onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
									required
									className={inputClass}
									placeholder="novo@email.com"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Palavra-passe Actual</label>
								<input
									type="password"
									value={emailData.password}
									onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
									required
									className={inputClass}
									placeholder="Confirme a sua palavra-passe"
								/>
							</div>
							<button
								type="submit"
								disabled={isLoadingEmail}
								className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60 cursor-pointer transition-all"
							>
								<IoMailOutline className="w-4 h-4" />
								{isLoadingEmail ? 'A enviar...' : 'Enviar Código'}
							</button>
						</form>
					) : (
						<form onSubmit={handleEmailConfirm} className="space-y-5">
							<div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                                Código enviado para <strong>{emailData.newEmail}</strong>. Verifique a caixa de entrada (e spam).
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Código de Verificação</label>
								<input
									type="text"
									inputMode="numeric"
									maxLength={6}
									value={otpCode}
									onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
									required
									className={`${inputClass} tracking-[0.4em] text-center text-lg font-semibold`}
									placeholder="000000"
								/>
							</div>
							<div className="flex gap-3">
								<button
									type="submit"
									disabled={isLoadingEmail || otpCode.length < 6}
									className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60 cursor-pointer transition-all"
								>
									<IoCheckmarkCircleOutline className="w-4 h-4" />
									{isLoadingEmail ? 'A confirmar...' : 'Confirmar Email'}
								</button>
								<button
									type="button"
									onClick={() => { setEmailStep('form'); setOtpCode(''); }}
									className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 cursor-pointer transition-all"
								>
                                    Voltar
								</button>
							</div>
						</form>
					)}
				</div>
			</section>

			<hr className="border-gray-100" />

			{/* Palavra-passe */}
			<section>
				<h3 className="text-xl font-semibold text-gray-900 mb-1">Alterar Palavra-passe</h3>
				<p className="text-sm text-gray-400 mb-6">Use uma palavra-passe forte com pelo menos 8 caracteres.</p>
				<form onSubmit={handlePassSubmit} className="max-w-2xl space-y-5">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Palavra-passe Actual</label>
						<input
							type="password"
							value={passData.currentPassword}
							onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
							required
							className={inputClass}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Nova Palavra-passe</label>
							<input
								type="password"
								value={passData.newPassword}
								onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
								required
								className={inputClass}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Confirmar Nova Palavra-passe</label>
							<input
								type="password"
								value={passData.confirmPassword}
								onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
								required
								className={inputClass}
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={isLoadingPass}
						className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60 cursor-pointer transition-all"
					>
						{isLoadingPass ? 'A actualizar...' : 'Alterar Palavra-passe'}
					</button>
				</form>
			</section>
		</div>
	);
};

export default AccountSettings;