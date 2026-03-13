import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { notyf } from '../../services/api';

const AdminLogin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login, isAuthenticated, isLoading } = useAdminAuth();
	const navigate = useNavigate();

	if (isLoading) {
		return <div className="flex bg-gray-50 h-screen w-screen justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
	}

	if (isAuthenticated) {
		return <Navigate to="/dbe" replace />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			notyf.error('Preencha os campos de email e senha');
			return;
		}

		const result = await login(email, password);
		if (result.success) {
			notyf.success('Sessão iniciada como Administrador');
			navigate('/dbe');
		} else {
			notyf.error(result.msg || 'Erro na autenticação.');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full relative">
				{/* Decorative elements */}
				<div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 opacity-20 blur-xl"></div>

				<div className="bg-gray-800 rounded-2xl shadow-2xl p-8 relative border border-gray-700">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-2">
							Double E
						</h2>
						<p className="text-gray-400 text-sm">
							Oainel de Administração
						</p>
					</div>

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								</div>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none transition"
									placeholder="admin@doublee.com"
								/>
							</div>
						</div>

						<div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none transition"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<div className="pt-2">
							<button
								type="submit"
								className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 focus:outline-none transition cursor-pointer"
							>
								Entrar no Painel
							</button>
						</div>
					</form>

					<div className="mt-8 text-center text-xs text-gray-500">
						&copy; {new Date().getFullYear()} Double E. Todos os direitos reservados.
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
