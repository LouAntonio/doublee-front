import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { notyf } from '../utils/notyf';
import useAuthStore from '../stores/authStore';
import { loginUser } from '../services/auth';
import GoogleButton from './GoogleButton';

const LoginForm = ({ onSwitchToRegister, onSwitchToRecovery }) => {
	const navigate = useNavigate();
	const login = useAuthStore((s) => s.login);

	const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};
		if (!formData.email) newErrors.email = 'E-mail é obrigatório';
		else if (!validateEmail(formData.email)) newErrors.email = 'E-mail inválido';
		if (!formData.password) newErrors.password = 'Senha é obrigatória';
		else if (formData.password.length < 8) newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			try {
				const res = await loginUser(formData.email, formData.password);
				if (res.success) {
					login(res.user, res.token);
					notyf.success('Login realizado com sucesso!');
					navigate('/');
				} else {
					notyf.error(res.msg || 'Erro ao fazer login.');
				}
			} catch (err) {
				notyf.error(err.message || 'Erro ao fazer login.');
			}
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<div>
				<label htmlFor="email" className="block font-display text-sm text-[#1C1917] mb-2">E-mail</label>
				<div className="relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoMailOutline className="w-5 h-5" /></div>
					<input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
						className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`}
						placeholder="seu@email.com" />
				</div>
				{errors.email && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.email}</p>}
			</div>

			<div>
				<label htmlFor="password" className="block font-display text-sm text-[#1C1917] mb-2">Senha</label>
				<div className="relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]"><IoLockClosedOutline className="w-5 h-5" /></div>
					<input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange}
						className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#D6D3D1]'} outline-none transition-all duration-200 font-body text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-2 focus:ring-accent/20 focus:border-accent`}
						placeholder="••••••••" />
					<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-accent transition-colors">
						{showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
					</button>
				</div>
				{errors.password && <p className="mt-1.5 text-sm text-red-500 font-body">{errors.password}</p>}
			</div>

			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 text-accent border-[#D6D3D1] rounded focus:ring-2 focus:ring-accent/30" />
					<span className="font-body text-sm text-[#78716C]">Lembrar-me</span>
				</label>
				<button type="button" onClick={onSwitchToRecovery} className="font-display text-sm text-accent hover:text-accent-dark font-semibold cursor-pointer transition-colors">Esqueceu a senha?</button>
			</div>

			<button type="submit" disabled={isLoading}
				className="w-full bg-accent hover:bg-accent-dark text-white font-display text-base py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
				{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="font-display">Entrando...</span></> : 'Entrar'}
			</button>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E7E5E4]"></div></div>
				<div className="relative flex justify-center text-sm"><span className="bg-white px-4 font-body text-[#A8A29E]">Ou continue com</span></div>
			</div>

			<GoogleButton />

			<div className="text-center pt-4 border-t border-[#E7E5E4]">
				<p className="font-body text-sm text-[#78716C]">Não tem uma conta?{' '}
					<button type="button" onClick={onSwitchToRegister} className="font-display text-accent hover:text-accent-dark font-semibold cursor-pointer transition-colors">Criar conta</button>
				</p>
			</div>
		</form>
	);
};

export default LoginForm;
