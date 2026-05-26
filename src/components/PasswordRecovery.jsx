import React, { useState, useRef, useEffect } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';
import { notyf } from '../utils/notyf';
import { requestPasswordReset, resetPassword } from '../services/auth';

const PasswordRecovery = ({ onSwitchToLogin }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({ email: '', otp: ['', '', '', '', '', ''], newPassword: '', confirmPassword: '' });
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);
	const otpInputRefs = useRef([]);

	useEffect(() => {
		if (currentStep === 2 && resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [currentStep, resendTimer]);

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const handleEmailSubmit = async () => {
		const newErrors = {};
		if (!formData.email) newErrors.email = 'E-mail é obrigatório';
		else if (!validateEmail(formData.email)) newErrors.email = 'E-mail inválido';
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			const data = await requestPasswordReset(formData.email);
			if (data.success) {
				notyf.success('Código OTP enviado para o seu e-mail!');
				setCurrentStep(2);
				setResendTimer(60);
			} else {
				notyf.error(data.msg || 'Erro ao solicitar recuperação de senha.');
				if (data.msg) setErrors({ email: data.msg });
			}
			setIsLoading(false);
		}
	};

	const handleOtpChange = (index, value) => {
		if (value.length > 1) return;
		if (value && !/^\d$/.test(value)) return;
		const newOtp = [...formData.otp];
		newOtp[index] = value;
		setFormData(prev => ({ ...prev, otp: newOtp }));
		if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
	};

	const handleOtpKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !formData.otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
	};

	const handleOtpSubmit = () => {
		const otpValue = formData.otp.join('');
		const newErrors = {};
		if (otpValue.length !== 6) newErrors.otp = 'Digite o código de 6 dígitos';
		setErrors(newErrors);
		if (Object.keys(newErrors).length === 0) setCurrentStep(3);
	};

	const handleResendOtp = async () => {
		if (resendTimer !== 0) return;
		setIsLoading(true);
		const data = await requestPasswordReset(formData.email);
		if (data.success) {
			notyf.success('Código OTP reenviado!');
			setResendTimer(60);
			setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
		} else notyf.error(data.msg || 'Erro ao reenviar código.');
		setIsLoading(false);
	};

	const handlePasswordSubmit = async () => {
		const newErrors = {};
		if (!formData.newPassword) newErrors.newPassword = 'Nova senha é obrigatória';
		else if (formData.newPassword.length < 8) newErrors.newPassword = 'Senha deve ter no mínimo 8 caracteres';
		if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			const otpValue = formData.otp.join('');
			const data = await resetPassword(formData.email, otpValue, formData.newPassword);
			if (data.success) {
				notyf.success('Senha redefinida com sucesso!');
				setCurrentStep(4);
			} else {
				notyf.error(data.msg || 'Erro ao redefinir senha.');
				if (data.msg && (data.msg.includes('OTP') || data.msg.includes('código'))) {
					setCurrentStep(2);
					setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
				}
			}
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
	};

	return (
		<div className="space-y-6">
			{currentStep === 1 && (
				<div className="space-y-5">
					<div>
						<label htmlFor="email" className="block font-display text-sm text-[#1C1917] mb-2">E-mail</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoMailOutline className="w-5 h-5" /></div>
							<input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
								className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="seu@email.com" />
						</div>
						{errors.email && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.email}</p>}
					</div>
					<button type="button" onClick={handleEmailSubmit} disabled={isLoading}
						className="w-full bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
						{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Enviando...</span></> : 'Enviar Código'}
					</button>
					<div className="text-center pt-4 border-t border-[#E7E5E4]">
						<button type="button" onClick={onSwitchToLogin} className="font-display text-sm text-accent hover:text-accent-dark font-semibold flex items-center gap-2 mx-auto cursor-pointer transition-colors">
							<IoArrowBack className="w-4 h-4" /> Voltar para login
						</button>
					</div>
				</div>
			)}

			{currentStep === 2 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="font-display text-2xl text-[#1C1917] mb-2">Verifique seu e-mail</h3>
						<p className="font-body text-sm text-[#78716C]">Enviamos um código de 6 dígitos para<br /><span className="font-display font-semibold text-[#1C1917]">{formData.email}</span></p>
					</div>
					<div>
						<label className="block font-display text-sm text-[#1C1917] mb-3 text-center">Digite o código</label>
						<div className="flex gap-2 justify-center">
							{formData.otp.map((digit, index) => (
								<input key={index} ref={(el) => (otpInputRefs.current[index] = el)} type="text" inputMode="numeric" maxLength={1} value={digit}
									onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)}
									className={`w-12 h-12 text-center text-xl font-display font-bold rounded-xl border ${errors.otp ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 text-[#1C1917] focus:ring-2 focus:ring-accent/20 focus:border-accent`} />
							))}
						</div>
						{errors.otp && <p className="mt-2 text-sm text-red-500 font-body text-center">{errors.otp}</p>}
					</div>
					<div className="text-center">
						<button type="button" onClick={handleResendOtp} disabled={resendTimer !== 0 || isLoading}
							className="font-display text-sm text-accent hover:text-accent-dark font-semibold disabled:text-[#A8A29E] disabled:cursor-not-allowed cursor-pointer transition-colors">
							{resendTimer === 0 ? 'Reenviar código' : `Reenviar em ${resendTimer}s`}
						</button>
					</div>
					<button type="button" onClick={handleOtpSubmit} disabled={isLoading}
						className="w-full bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
						{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Verificando...</span></> : 'Verificar Código'}
					</button>
					<div className="text-center pt-4 border-t border-[#E7E5E4]">
						<button type="button" onClick={() => setCurrentStep(1)} className="font-body text-sm text-[#78716C] hover:text-accent font-medium flex items-center gap-2 mx-auto cursor-pointer transition-colors">
							<IoArrowBack className="w-4 h-4" /> Alterar e-mail
						</button>
					</div>
				</div>
			)}

			{currentStep === 3 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="font-display text-2xl text-[#1C1917] mb-2">Nova Senha</h3>
						<p className="font-body text-sm text-[#78716C]">Crie uma nova senha para sua conta</p>
					</div>
					<div>
						<label htmlFor="newPassword" className="block font-display text-sm text-[#1C1917] mb-2">Nova Senha</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoLockClosedOutline className="w-5 h-5" /></div>
							<input type={showNewPassword ? 'text' : 'password'} id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange}
								className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.newPassword ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="Mínimo 8 caracteres" />
							<button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-accent transition-colors">
								{showNewPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
							</button>
						</div>
						{errors.newPassword && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.newPassword}</p>}
					</div>
					<div>
						<label htmlFor="confirmPassword" className="block font-display text-sm text-[#1C1917] mb-2">Confirmar Nova Senha</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoLockClosedOutline className="w-5 h-5" /></div>
							<input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
								className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="Digite a senha novamente" />
							<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-accent transition-colors">
								{showConfirmPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
							</button>
						</div>
						{errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.confirmPassword}</p>}
					</div>
					<button type="button" onClick={handlePasswordSubmit} disabled={isLoading}
						className="w-full bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
						{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Redefinindo...</span></> : 'Redefinir Senha'}
					</button>
				</div>
			)}

			{currentStep === 4 && (
				<div className="space-y-5 text-center py-8">
					<div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<IoCheckmarkCircle className="w-12 h-12 text-accent" />
					</div>
					<h3 className="font-display text-2xl text-[#1C1917]">Senha Redefinida!</h3>
					<p className="font-body text-[#78716C]">Sua senha foi alterada com sucesso.<br />Agora você pode fazer login com sua nova senha.</p>
					<button type="button" onClick={onSwitchToLogin} className="w-full bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
            Fazer Login
					</button>
				</div>
			)}
		</div>
	);
};

export default PasswordRecovery;
