import React, { useState, useRef, useEffect } from 'react';
import { IoMailOutline, IoPersonOutline, IoLockClosedOutline, IoCallOutline, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircle, IoArrowBack, IoArrowForward } from 'react-icons/io5';
import apiRequest, { notyf } from '../services/api';

const RegisterForm = ({ onSwitchToLogin }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		email: '',
		otp: ['', '', '', '', '', ''],
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
		phone: ''
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);

	const otpInputRefs = useRef([]);

	// Timer for OTP resend
	useEffect(() => {
		if (otpSent && resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [otpSent, resendTimer]);

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
			try {
				const data = await apiRequest('/users/check-email', {
					method: 'POST',
					body: JSON.stringify({ email: formData.email })
				});

				if (data.success && data.exists) {
					notyf.error('Este e-mail já está registado.');
					setErrors({ email: 'Este e-mail já está registado' });
				} else if (data.success && !data.exists) {
					notyf.success('Código OTP enviado para o seu e-mail!');
					setOtpSent(true);
					setCurrentStep(2);
					setResendTimer(60);
				} else {
					notyf.error(data.msg || 'Erro ao verificar e-mail.');
				}
			} catch (error) {
				if (error.message !== 'Sessão expirada') {
					notyf.error('Erro ao comunicar com o servidor.');
				}
			} finally {
				setIsLoading(false);
			}
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
			try {
				const data = await apiRequest('/users/verify-otp', {
					method: 'POST',
					body: JSON.stringify({
						email: formData.email,
						code: otpValue
					})
				});

				if (data.success) {
					notyf.success('Código verificado com sucesso!');
					setCurrentStep(3);
				} else {
					notyf.error(data.msg || 'Código OTP inválido.');
					setErrors({ otp: data.msg || 'Código OTP inválido' });
				}
			} catch (error) {
				if (error.message !== 'Sessão expirada') {
					notyf.error('Erro ao verificar código.');
				}
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleResendOtp = async () => {
		if (resendTimer !== 0) return;

		setIsLoading(true);
		try {
			const data = await apiRequest('/users/resend-otp', {
				method: 'POST',
				body: JSON.stringify({ email: formData.email })
			});

			if (data.success) {
				notyf.success('Código OTP reenviado!');
				setResendTimer(60);
				setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
			} else {
				notyf.error(data.msg || 'Erro ao reenviar código.');
			}
		} catch (error) {
			if (error.message !== 'Sessão expirada') {
				notyf.error('Erro ao reenviar código.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleFinalSubmit = async () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'Nome é obrigatório';
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Sobrenome é obrigatório';
		}

		if (!formData.password) {
			newErrors.password = 'Senha é obrigatória';
		} else if (formData.password.length < 8) {
			newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'As senhas não coincidem';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			try {
				const data = await apiRequest('/users/complete-registration', {
					method: 'POST',
					body: JSON.stringify({
						email: formData.email,
						name: formData.firstName,
						surname: formData.lastName,
						phone: formData.phone,
						password: formData.password
					})
				});

				if (data.success) {
					notyf.success('Conta criada com sucesso!');
					onSwitchToLogin();
				} else {
					notyf.error(data.msg || 'Erro ao criar conta.');
				}
			} catch (error) {
				if (error.message !== 'Sessão expirada') {
					notyf.error('Erro ao criar conta.');
				}
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const steps = [
		{ number: 1, title: 'E-mail' },
		{ number: 2, title: 'Verificação' },
		{ number: 3, title: 'Dados Pessoais' }
	];

	return (
		<div className="space-y-6">
			{/* Progress Indicator */}
			<div className="flex items-center justify-between mb-8">
				{steps.map((step, index) => (
					<React.Fragment key={step.number}>
						<div className="flex flex-col items-center gap-2">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep > step.number
									? 'bg-green-500 text-white'
									: currentStep === step.number
										? 'bg-blue-600 text-white'
										: 'bg-gray-200 text-gray-500'
									}`}
							>
								{currentStep > step.number ? (
									<IoCheckmarkCircle className="w-6 h-6" />
								) : (
									step.number
								)}
							</div>
							<span className={`text-xs font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
								}`}>
								{step.title}
							</span>
						</div>
						{index < steps.length - 1 && (
							<div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
								}`} />
						)}
					</React.Fragment>
				))}
			</div>

			{/* Step 1: Email */}
			{currentStep === 1 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="text-xl font-bold text-gray-900 mb-2">Crie sua conta</h3>
						<p className="text-sm text-gray-600">Informe seu e-mail para começar</p>
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
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
					>
						{isLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Enviando...</span>
							</>
						) : (
							<>
								<span>Continuar</span>
								<IoArrowForward className="w-5 h-5" />
							</>
						)}
					</button>
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
							disabled={resendTimer !== 0 || isLoading}
							className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
						>
							{resendTimer === 0 ? 'Reenviar código' : `Reenviar em ${resendTimer}s`}
						</button>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setCurrentStep(1)}
							className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
						>
							<IoArrowBack className="w-5 h-5" />
							<span>Voltar</span>
						</button>
						<button
							type="button"
							onClick={handleOtpSubmit}
							disabled={isLoading}
							className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
						>
							{isLoading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Verificando...</span>
								</>
							) : (
								<>
									<span>Verificar</span>
									<IoArrowForward className="w-5 h-5" />
								</>
							)}
						</button>
					</div>
				</div>
			)}

			{/* Step 3: Personal Data */}
			{currentStep === 3 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="text-xl font-bold text-gray-900 mb-2">Complete seu cadastro</h3>
						<p className="text-sm text-gray-600">Preencha seus dados pessoais</p>
					</div>

					{/* First & Last Name */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
								Nome
							</label>
							<div className="relative">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<IoPersonOutline className="w-5 h-5" />
								</div>
								<input
									type="text"
									id="firstName"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
										} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
									placeholder="Seu nome"
								/>
							</div>
							{errors.firstName && (
								<p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
							)}
						</div>

						<div>
							<label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
								Sobrenome
							</label>
							<div className="relative">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<IoPersonOutline className="w-5 h-5" />
								</div>
								<input
									type="text"
									id="lastName"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
										} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
									placeholder="Seu sobrenome"
								/>
							</div>
							{errors.lastName && (
								<p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
							)}
						</div>
					</div>

					{/* Phone */}
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
							Telefone
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
								<IoCallOutline className="w-5 h-5" />
							</div>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
									} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
								placeholder="9XX XXX XXX"
							/>
						</div>
						{errors.phone && (
							<p className="mt-1 text-sm text-red-600">{errors.phone}</p>
						)}
					</div>

					{/* Password */}
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
							Senha
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
								<IoLockClosedOutline className="w-5 h-5" />
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={`w-full pl-11 pr-12 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
									} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
								placeholder="Mínimo 8 caracteres"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								{showPassword ? (
									<IoEyeOffOutline className="w-5 h-5" />
								) : (
									<IoEyeOutline className="w-5 h-5" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">{errors.password}</p>
						)}
					</div>

					{/* Confirm Password */}
					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
							Confirmar Senha
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

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setCurrentStep(2)}
							className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
						>
							<IoArrowBack className="w-5 h-5" />
							<span>Voltar</span>
						</button>
						<button
							type="button"
							onClick={handleFinalSubmit}
							disabled={isLoading}
							className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
						>
							{isLoading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Criando conta...</span>
								</>
							) : (
								'Criar Conta'
							)}
						</button>
					</div>
				</div>
			)}

			{/* Login Link */}
			<div className="text-center pt-4 border-t border-gray-200">
				<p className="text-sm text-gray-600">
					Já tem uma conta?{' '}
					<button
						type="button"
						onClick={onSwitchToLogin}
						className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
					>
						Fazer login
					</button>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
