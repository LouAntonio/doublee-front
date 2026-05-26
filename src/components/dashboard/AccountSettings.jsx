import React, { useState } from 'react';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';
import { IoMailOutline, IoCheckmarkCircleOutline, IoLogoGoogle } from 'react-icons/io5';
import useAuthStore from '../../stores/authStore';
import { unlinkGoogle } from '../../services/auth';
import { GoogleLinkButton } from '../GoogleButton';

const AccountSettings = () => {
	const { user, updateUser } = useAuthStore();
	const [isLoadingEmail, setIsLoadingEmail] = useState(false);
	const [isLoadingPass, setIsLoadingPass] = useState(false);
	const [isUnlinking, setIsUnlinking] = useState(false);

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
			const data = await http.post('/users/request-email-change', emailData);
			if (data?.success) {
				notyf.success('Código enviado para o novo email!');
				setEmailStep('otp');
			} else {
				notyf.error(data?.msg || 'Erro ao solicitar alteração.');
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
			const data = await http.put('/users/update-email', { newEmail: emailData.newEmail, code: otpCode });
			if (data?.success) {
				notyf.success('Email actualizado com sucesso!');
				setEmailStep('form');
				setEmailData({ newEmail: '', password: '' });
				setOtpCode('');
			} else {
				notyf.error(data?.msg || 'Código inválido ou expirado.');
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
			const data = await http.put('/users/update-password', {
				oldPassword: passData.currentPassword,
				newPassword: passData.newPassword,
			});
			if (data?.success) {
				notyf.success('Palavra-passe actualizada com sucesso!');
				setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
			} else {
				notyf.error(data?.msg || 'Erro ao actualizar palavra-passe.');
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		} finally {
			setIsLoadingPass(false);
		}
	};

	const handleLinkSuccess = (googleId, avatar) => {
		updateUser({ googleId, avatar });
	};

	const handleUnlink = async () => {
		if (!window.confirm('Tem a certeza que deseja desvincular a sua conta Google? Depois de desvincular, terá de usar e-mail e palavra-passe para iniciar sessão.')) return;
		setIsUnlinking(true);
		try {
			const data = await unlinkGoogle();
			if (data.success) {
				updateUser({ googleId: null, avatar: null });
				notyf.success('Conta Google desvinculada com sucesso.');
			} else {
				notyf.error(data.msg || 'Erro ao desvincular.');
			}
		} catch (err) {
			notyf.error(err.message || 'Erro ao comunicar com o servidor.');
		} finally {
			setIsUnlinking(false);
		}
	};

	const inputClass = 'w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white';

	return (
		<div className="space-y-10">

			{/* Email */}
			<section className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<h2 className="text-xl font-semibold text-[#1C1917] mb-1 font-display">Alterar Email</h2>
				<p className="text-sm text-[#78716C] mb-6 font-body">
					{emailStep === 'form'
						? 'Confirme a sua palavra-passe e introduza o novo email. Enviaremos um código de verificação.'
						: `Introduza o código de 6 dígitos enviado para ${emailData.newEmail}.`}
				</p>

				<div className="max-w-2xl">
					{emailStep === 'form' ? (
						<form onSubmit={handleEmailRequest} className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#1C1917]">Novo Email</label>
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
								<label className="text-sm font-medium text-[#1C1917]">Palavra-passe Actual</label>
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
								className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark disabled:opacity-60 cursor-pointer transition-all duration-300 shadow-lg shadow-accent/20 hover:-translate-y-0.5"
							>
								<IoMailOutline className="w-4 h-4" />
								{isLoadingEmail ? 'A enviar...' : 'Enviar Código'}
							</button>
						</form>
					) : (
						<form onSubmit={handleEmailConfirm} className="space-y-5">
							<div className="p-4 bg-orange-50 border border-accent/20 rounded-xl text-sm text-accent">
                                Código enviado para <strong>{emailData.newEmail}</strong>. Verifique a caixa de entrada (e spam).
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-[#1C1917]">Código de Verificação</label>
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
									className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark disabled:opacity-60 cursor-pointer transition-all duration-300 shadow-lg shadow-accent/20 hover:-translate-y-0.5"
								>
									<IoCheckmarkCircleOutline className="w-4 h-4" />
									{isLoadingEmail ? 'A confirmar...' : 'Confirmar Email'}
								</button>
								<button
									type="button"
									onClick={() => { setEmailStep('form'); setOtpCode(''); }}
									className="px-5 py-3 rounded-full border border-accent/20 text-[#78716C] text-sm hover:bg-sand cursor-pointer transition-all"
								>
                                    Voltar
								</button>
							</div>
						</form>
					)}
				</div>
			</section>

			<hr className="border-accent/10" />

			{/* Palavra-passe */}
			<section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
				<h3 className="text-xl font-semibold text-[#1C1917] mb-1 font-display">Alterar Palavra-passe</h3>
				<p className="text-sm text-[#78716C] mb-6 font-body">Use uma palavra-passe forte com pelo menos 8 caracteres.</p>
				<form onSubmit={handlePassSubmit} className="max-w-2xl space-y-5">
					<div className="space-y-2">
						<label className="text-sm font-medium text-[#1C1917]">Palavra-passe Actual</label>
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
							<label className="text-sm font-medium text-[#1C1917]">Nova Palavra-passe</label>
							<input
								type="password"
								value={passData.newPassword}
								onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
								required
								className={inputClass}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[#1C1917]">Confirmar Nova Palavra-passe</label>
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
						className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark disabled:opacity-60 cursor-pointer transition-all duration-300 shadow-lg shadow-accent/20 hover:-translate-y-0.5"
					>
						{isLoadingPass ? 'A actualizar...' : 'Alterar Palavra-passe'}
					</button>
				</form>
			</section>

			<hr className="border-accent/10" />

			{/* Contas Vinculadas */}
			<section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
				<h3 className="text-xl font-semibold text-[#1C1917] mb-1 font-display">Contas Vinculadas</h3>
				<p className="text-sm text-[#78716C] mb-6 font-body">Vincule a sua conta Google para iniciar sessão rapidamente.</p>

				<div className="max-w-2xl">
					{user?.googleId ? (
						<div className="p-5 bg-green-50 border border-green-200 rounded-xl">
							<div className="flex items-center gap-3 mb-4">
								<IoLogoGoogle className="w-6 h-6 text-green-600 shrink-0" />
								<div>
									<p className="text-sm font-semibold text-green-800">Conta Google vinculada</p>
									<p className="text-xs text-green-600">Pode iniciar sessão com o Google</p>
								</div>
							</div>
							<button
								onClick={handleUnlink}
								disabled={isUnlinking}
								className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-sm font-semibold hover:bg-red-100 disabled:opacity-60 cursor-pointer transition-all"
							>
								{isUnlinking ? 'A desvincular...' : 'Desvincular conta Google'}
							</button>
						</div>
					) : (
						<div>
							<p className="text-sm text-[#78716C] mb-4">Ao vincular, poderá entrar na sua conta usando o Google sem necessidade de palavra-passe.</p>
							<GoogleLinkButton onLinkSuccess={handleLinkSuccess} />
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default AccountSettings;