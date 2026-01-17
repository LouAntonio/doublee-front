import React, { useState, useRef, useEffect } from 'react';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';

const PasswordRecovery = ({ onSwitchToLogin }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		email: '',
		otp: ['', '', '', '', '', ''],
		newPassword: '',
		confirmPassword: ''
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [canResendOtp, setCanResendOtp] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);

	const otpInputRefs = useRef([]);

	// Timer for OTP resend
	useEffect(() => {
		if (currentStep === 2 && resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		} else if (resendTimer === 0) {
			setCanResendOtp(true);
		}
	}, [currentStep, resendTimer]);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleEmailSubmit = async () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = 'E-mail é obrigatório';
		} else if (!validateEmail(formData.email)) {
			newErrors.email = 'E-mail inválido';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			// TODO: Implement actual API call to send recovery OTP
			setTimeout(() => {
				console.log('Sending recovery OTP to:', formData.email);
				setIsLoading(false);
				setCurrentStep(2);
				setResendTimer(60);
				setCanResendOtp(false);
			}, 1500);
		}
	};

	const handleOtpChange = (index, value) => {
		if (value.length > 1) return;
		if (value && !/^\d$/.test(value)) return;

		const newOtp = [...formData.otp];
		newOtp[index] = value;
		setFormData(prev => ({ ...prev, otp: newOtp }));

		// Auto-focus next input
		if (value && index < 5) {
			otpInputRefs.current[index + 1]?.focus();
		}
	};

	const handleOtpKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
			otpInputRefs.current[index - 1]?.focus();
		}
	};

	const handleOtpSubmit = async () => {
		const otpValue = formData.otp.join('');
		const newErrors = {};

		if (otpValue.length !== 6) {
			newErrors.otp = 'Digite o código de 6 dígitos';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			// TODO: Implement actual API call to verify OTP
			setTimeout(() => {
				console.log('Verifying recovery OTP:', otpValue);
				setIsLoading(false);
				setCurrentStep(3);
			}, 1500);
		}
	};

	const handleResendOtp = () => {
		if (!canResendOtp) return;

		setIsLoading(true);
		// TODO: Implement actual API call to resend OTP
		setTimeout(() => {
			console.log('Resending recovery OTP to:', formData.email);
			setIsLoading(false);
			setResendTimer(60);
			setCanResendOtp(false);
			setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
		}, 1000);
	};

	const handlePasswordSubmit = async () => {
		const newErrors = {};

		if (!formData.newPassword) {
			newErrors.newPassword = 'Nova senha é obrigatória';
		} else if (formData.newPassword.length < 6) {
			newErrors.newPassword = 'Senha deve ter no mínimo 6 caracteres';
		}

		if (formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = 'As senhas não coincidem';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			// TODO: Implement actual API call to reset password
			setTimeout(() => {
				console.log('Resetting password for:', formData.email);
				setIsLoading(false);
				setCurrentStep(4);
			}, 1500);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	return (
		<div className="space-y-6">
			{/* Step 1: Email */}
			{currentStep === 1 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="text-xl font-bold text-gray-900 mb-2">Recuperar Senha</h3>
						<p className="text-sm text-gray-600">
							Informe seu e-mail para receber o código de verificação
						</p>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
							E-mail
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
								<IoMailOutline className="w-5 h-5" />
							</div>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
									} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
								placeholder="seu@email.com"
							/>
						</div>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">{errors.email}</p>
						)}
					</div>

					<button
						type="button"
						onClick={handleEmailSubmit}
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Enviando...</span>
							</>
						) : (
							'Enviar Código'
						)}
					</button>

					<div className="text-center pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={onSwitchToLogin}
							className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto"
						>
							<IoArrowBack className="w-4 h-4" />
							Voltar para login
						</button>
					</div>
				</div>
			)}

			{/* Step 2: OTP Verification */}
			{currentStep === 2 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="text-xl font-bold text-gray-900 mb-2">Verifique seu e-mail</h3>
						<p className="text-sm text-gray-600">
							Enviamos um código de 6 dígitos para<br />
							<span className="font-semibold text-gray-900">{formData.email}</span>
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3 text-center">
							Digite o código
						</label>
						<div className="flex gap-2 justify-center">
							{formData.otp.map((digit, index) => (
								<input
									key={index}
									ref={(el) => (otpInputRefs.current[index] = el)}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleOtpChange(index, e.target.value)}
									onKeyDown={(e) => handleOtpKeyDown(index, e)}
									className={`w-12 h-12 text-center text-xl font-bold rounded-lg border ${errors.otp ? 'border-red-500' : 'border-gray-300'
										} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
								/>
							))}
						</div>
						{errors.otp && (
							<p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
						)}
					</div>

					<div className="text-center">
						<button
							type="button"
							onClick={handleResendOtp}
							disabled={!canResendOtp || isLoading}
							className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
						>
							{canResendOtp ? 'Reenviar código' : `Reenviar em ${resendTimer}s`}
						</button>
					</div>

					<button
						type="button"
						onClick={handleOtpSubmit}
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Verificando...</span>
							</>
						) : (
							'Verificar Código'
						)}
					</button>

					<div className="text-center pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={() => setCurrentStep(1)}
							className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center gap-2 mx-auto"
						>
							<IoArrowBack className="w-4 h-4" />
							Alterar e-mail
						</button>
					</div>
				</div>
			)}

			{/* Step 3: New Password */}
			{currentStep === 3 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="text-xl font-bold text-gray-900 mb-2">Nova Senha</h3>
						<p className="text-sm text-gray-600">Crie uma nova senha para sua conta</p>
					</div>

					<div>
						<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
							Nova Senha
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
								<IoLockClosedOutline className="w-5 h-5" />
							</div>
							<input
								type={showNewPassword ? 'text' : 'password'}
								id="newPassword"
								name="newPassword"
								value={formData.newPassword}
								onChange={handleChange}
								className={`w-full pl-11 pr-12 py-3 rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
									} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
								placeholder="Mínimo 6 caracteres"
							/>
							<button
								type="button"
								onClick={() => setShowNewPassword(!showNewPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showNewPassword ? (
									<IoEyeOffOutline className="w-5 h-5" />
								) : (
									<IoEyeOutline className="w-5 h-5" />
								)}
							</button>
						</div>
						{errors.newPassword && (
							<p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
						)}
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
							Confirmar Nova Senha
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
								<IoLockClosedOutline className="w-5 h-5" />
							</div>
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`w-full pl-11 pr-12 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
									} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
								placeholder="Digite a senha novamente"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showConfirmPassword ? (
									<IoEyeOffOutline className="w-5 h-5" />
								) : (
									<IoEyeOutline className="w-5 h-5" />
								)}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
						)}
					</div>

					<button
						type="button"
						onClick={handlePasswordSubmit}
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Redefinindo...</span>
							</>
						) : (
							'Redefinir Senha'
						)}
					</button>
				</div>
			)}

			{/* Step 4: Success */}
			{currentStep === 4 && (
				<div className="space-y-5 text-center py-8">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<IoCheckmarkCircle className="w-12 h-12 text-green-600" />
					</div>
					<h3 className="text-2xl font-bold text-gray-900">Senha Redefinida!</h3>
					<p className="text-gray-600">
						Sua senha foi alterada com sucesso.<br />
						Agora você pode fazer login com sua nova senha.
					</p>
					<button
						type="button"
						onClick={onSwitchToLogin}
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
					>
						Fazer Login
					</button>
				</div>
			)}
		</div>
	);
};

export default PasswordRecovery;
