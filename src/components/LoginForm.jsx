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
			const res = await loginUser(formData.email, formData.password);
			if (res.success) {
				login(res.user, res.token);
				notyf.success('Login realizado com sucesso!');
				navigate('/');
			} else {
				notyf.error(res.msg || 'Erro ao fazer login.');
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
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
				<div className="relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IoMailOutline className="w-5 h-5" /></div>
					<input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
						className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} outline-none transition-colors`}
						placeholder="seu@email.com" />
				</div>
				{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
				<div className="relative">
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IoLockClosedOutline className="w-5 h-5" /></div>
					<input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange}
						className={`w-full pl-11 pr-12 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} outline-none transition-colors`}
						placeholder="••••••••" />
					<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
						{showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
					</button>
				</div>
				{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
			</div>

			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
					<span className="text-sm text-gray-700">Lembrar-me</span>
				</label>
				<button type="button" onClick={onSwitchToRecovery} className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">Esqueceu a senha?</button>
			</div>

			<button type="submit" disabled={isLoading}
				className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
				{isLoading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Entrando...</span></> : 'Entrar'}
			</button>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
				<div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-gray-500">Ou continue com</span></div>
			</div>

			<GoogleButton />

			<div className="text-center pt-4 border-t border-gray-200">
				<p className="text-sm text-gray-600">Não tem uma conta?{' '}
					<button type="button" onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">Criar conta</button>
				</p>
			</div>
		</form>
	);
};

export default LoginForm;
