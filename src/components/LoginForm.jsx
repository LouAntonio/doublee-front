import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import apiRequest, { notyf } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onSwitchToRegister, onSwitchToRecovery }) => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		rememberMe: false
	});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};

		// Validation
		if (!formData.email) {
			newErrors.email = 'E-mail é obrigatório';
		} else if (!validateEmail(formData.email)) {
			newErrors.email = 'E-mail inválido';
		}

		if (!formData.password) {
			newErrors.password = 'Senha é obrigatória';
		} else if (formData.password.length < 8) {
			newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			try {
				const data = await apiRequest('/users/login', {
					method: 'POST',
					body: JSON.stringify({
						email: formData.email,
						password: formData.password
					})
				});

				if (data.success) {
					login(data.token, data.user);
					notyf.success('Login realizado com sucesso!');
					navigate('/');
				} else {
					notyf.error(data.msg || 'Erro ao fazer login.');
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

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{/* Email Field */}
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

			{/* Password Field */}
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
						placeholder="••••••••"
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

			{/* Remember Me & Forgot Password */}
			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						name="rememberMe"
						checked={formData.rememberMe}
						onChange={handleChange}
						className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
					/>
					<span className="text-sm text-gray-700">Lembrar-me</span>
				</label>
				<button
					type="button"
					onClick={onSwitchToRecovery}
					className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
				>
					Esqueceu a senha?
				</button>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
			>
				{isLoading ? (
					<>
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						<span>Entrando...</span>
					</>
				) : (
					'Entrar'
				)}
			</button>

			{/* Register Link */}
			<div className="text-center pt-4 border-t border-gray-200">
				<p className="text-sm text-gray-600">
					Não tem uma conta?{' '}
					<button
						type="button"
						onClick={onSwitchToRegister}
						className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
					>
						Criar conta
					</button>
				</p>
			</div>
		</form>
	);
};

export default LoginForm;
