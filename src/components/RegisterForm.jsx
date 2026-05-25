import React, { useState, useRef, useEffect } from 'react';
import { IoMailOutline, IoPersonOutline, IoLockClosedOutline, IoCallOutline, IoEyeOutline, IoEyeOffOutline, IoCheckmarkCircle, IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { notyf } from '../utils/notyf';
import { checkEmail, verifyOtp, resendOtp, completeRegistration } from '../services/auth';
import { GoogleRegisterButton } from './GoogleButton';

const RegisterForm = ({ onSwitchToLogin }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		email: '', otp: ['', '', '', '', '', ''], firstName: '', lastName: '', password: '', confirmPassword: '', phone: '',
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);
	const otpInputRefs = useRef([]);

	useEffect(() => {
		if (otpSent && resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [otpSent, resendTimer]);

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const handleEmailSubmit = async () => {
		const newErrors = {};
		if (!formData.email) newErrors.email = 'E-mail é obrigatório';
		else if (!validateEmail(formData.email)) newErrors.email = 'E-mail inválido';
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			const data = await checkEmail(formData.email);
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

	const handleOtpSubmit = async () => {
		const otpValue = formData.otp.join('');
		const newErrors = {};
		if (otpValue.length !== 6) newErrors.otp = 'Digite o código de 6 dígitos';
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			const data = await verifyOtp(formData.email, otpValue);
			if (data.success) {
				notyf.success('Código verificado com sucesso!');
				setCurrentStep(3);
			} else {
				notyf.error(data.msg || 'Código OTP inválido.');
				setErrors({ otp: data.msg || 'Código OTP inválido' });
			}
			setIsLoading(false);
		}
	};

	const handleResendOtp = async () => {
		if (resendTimer !== 0) return;
		setIsLoading(true);
		const data = await resendOtp(formData.email);
		if (data.success) {
			notyf.success('Código OTP reenviado!');
			setResendTimer(60);
			setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
		} else {
			notyf.error(data.msg || 'Erro ao reenviar código.');
		}
		setIsLoading(false);
	};

	const handleFinalSubmit = async () => {
		const newErrors = {};
		if (!formData.firstName.trim()) newErrors.firstName = 'Nome é obrigatório';
		if (!formData.lastName.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
		if (!formData.password) newErrors.password = 'Senha é obrigatória';
		else if (formData.password.length < 8) newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
		if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			const data = await completeRegistration({
				email: formData.email, name: formData.firstName, surname: formData.lastName,
				phone: formData.phone, password: formData.password,
			});
			if (data.success) {
				notyf.success('Conta criada com sucesso!');
				onSwitchToLogin();
			} else {
				notyf.error(data.msg || 'Erro ao criar conta.');
			}
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
	};

	const steps = [
		{ number: 1, title: 'E-mail' }, { number: 2, title: 'Verificação' }, { number: 3, title: 'Dados Pessoais' },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between mb-8">
				{steps.map((step, index) => (
					<React.Fragment key={step.number}>
						<div className="flex flex-col items-center gap-2">
							<div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold transition-all ${currentStep > step.number ? 'bg-accent text-white' : currentStep === step.number ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-[#E7E5E4] text-[#A8A29E]'}`}>
								{currentStep > step.number ? <IoCheckmarkCircle className="w-6 h-6" /> : step.number}
							</div>
							<span className={`font-display text-xs ${currentStep >= step.number ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>{step.title}</span>
						</div>
						{index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded transition-all ${currentStep > step.number ? 'bg-accent' : 'bg-[#E7E5E4]'}`} />}
					</React.Fragment>
				))}
			</div>

			{currentStep === 1 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="font-display text-2xl text-[#1C1917] mb-2">Crie sua conta</h3>
						<p className="font-body text-sm text-[#78716C]">Informe seu e-mail para começar</p>
					</div>
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
						{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Enviando...</span></> : <><span>Continuar</span><IoArrowForward className="w-5 h-5" /></>}
					</button>
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
					<div className="flex gap-3">
						<button type="button" onClick={() => setCurrentStep(1)}
							className="flex-1 bg-white text-[#78716C] font-display text-base py-3.5 rounded-full transition-all duration-300 border-2 border-[#E7E5E4] hover:border-accent hover:text-accent flex items-center justify-center gap-2 cursor-pointer">
							<IoArrowBack className="w-5 h-5" /><span>Voltar</span>
						</button>
						<button type="button" onClick={handleOtpSubmit} disabled={isLoading}
							className="flex-1 bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
							{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Verificando...</span></> : <><span>Verificar</span><IoArrowForward className="w-5 h-5" /></>}
						</button>
					</div>
				</div>
			)}

			{currentStep === 3 && (
				<div className="space-y-5">
					<div className="text-center mb-6">
						<h3 className="font-display text-2xl text-[#1C1917] mb-2">Complete seu cadastro</h3>
						<p className="font-body text-sm text-[#78716C]">Preencha seus dados pessoais</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label htmlFor="firstName" className="block font-display text-sm text-[#1C1917] mb-2">Nome</label>
							<div className="relative">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoPersonOutline className="w-5 h-5" /></div>
								<input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}
									className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="Seu nome" />
							</div>
							{errors.firstName && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.firstName}</p>}
						</div>
						<div>
							<label htmlFor="lastName" className="block font-display text-sm text-[#1C1917] mb-2">Sobrenome</label>
							<div className="relative">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoPersonOutline className="w-5 h-5" /></div>
								<input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}
									className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="Seu sobrenome" />
							</div>
							{errors.lastName && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.lastName}</p>}
						</div>
					</div>
					<div>
						<label htmlFor="phone" className="block font-display text-sm text-[#1C1917] mb-2">Telefone</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoCallOutline className="w-5 h-5" /></div>
							<input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
								className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="9XX XXX XXX" />
						</div>
						{errors.phone && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.phone}</p>}
					</div>
					<div>
						<label htmlFor="password" className="block font-display text-sm text-[#1C1917] mb-2">Senha</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoLockClosedOutline className="w-5 h-5" /></div>
							<input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange}
								className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`} placeholder="Mínimo 8 caracteres" />
							<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-accent transition-colors">
								{showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
							</button>
						</div>
						{errors.password && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.password}</p>}
					</div>
					<div>
						<label htmlFor="confirmPassword" className="block font-display text-sm text-[#1C1917] mb-2">Confirmar Senha</label>
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
					<div className="flex gap-3">
						<button type="button" onClick={() => setCurrentStep(2)}
							className="flex-1 bg-white text-[#78716C] font-display text-base py-3.5 rounded-full transition-all duration-300 border-2 border-[#E7E5E4] hover:border-accent hover:text-accent flex items-center justify-center gap-2 cursor-pointer">
							<IoArrowBack className="w-5 h-5" /><span>Voltar</span>
						</button>
						<button type="button" onClick={handleFinalSubmit} disabled={isLoading}
							className="flex-1 bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
							{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Criando conta...</span></> : 'Criar Conta'}
						</button>
					</div>
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E7E5E4]"></div></div>
						<div className="relative flex justify-center text-sm"><span className="bg-white px-4 font-body text-[#A8A29E]">Ou continue com</span></div>
					</div>
					<GoogleRegisterButton />
				</div>
			)}

			<div className="text-center pt-4 border-t border-[#E7E5E4]">
				<p className="font-body text-sm text-[#78716C]">Já tem uma conta?{' '}
					<button type="button" onClick={onSwitchToLogin} className="font-display text-accent hover:text-accent-dark font-semibold cursor-pointer transition-colors">Fazer login</button>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
