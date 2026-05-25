import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { notyf } from '../../utils/notyf';

const AdminLogin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { adminLogin, isAdmin, isLoading } = useAuthStore();
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className="min-h-screen w-screen bg-sand geo-pattern flex items-center justify-center px-6">
				<div className="relative">
					<div className="absolute -inset-6 rounded-3xl bg-accent opacity-10 blur-2xl"></div>
					<div className="relative bg-white/70 backdrop-blur-xl border border-accent rounded-2xl px-8 py-7 text-center shadow-2xl">
						<div className="mx-auto h-12 w-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin"></div>
						<p className="mt-4 text-sm font-display font-semibold text-[#1C1917]">Processando acesso</p>
						<p className="mt-1 text-xs text-[#78716C]">Preparando o painel administrativo</p>
					</div>
				</div>
			</div>
		);
	}

	if (isAdmin) {
		return <Navigate to="/dbe" replace />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			notyf.error('Preencha os campos de email e senha');
			return;
		}

		const result = await adminLogin(email, password);
		if (result.success) {
			notyf.success('Sessão iniciada como Administrador');
			navigate('/dbe');
		} else {
			notyf.error(result.msg || 'Erro na autenticação.');
		}
	};

	return (
		<div className="min-h-screen bg-sand flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full relative">
				{/* Decorative elements */}
				<div className="absolute -inset-1 rounded-3xl bg-accent opacity-10 blur-xl"></div>

				<div className="bg-white rounded-2xl shadow-2xl p-8 relative border border-accent/10">
					<div className="flex justify-end mb-4">
						<Link
							to="/"
							className="text-xs font-semibold text-[#78716C] hover:text-accent transition"
						>
							Voltar para a Home
						</Link>
					</div>
					<div className="text-center mb-10">
						<h2 className="text-3xl font-display font-bold text-accent mb-2">
							Kusumba
						</h2>
						<p className="text-[#78716C] text-sm">
							Oainel de Administração
						</p>
					</div>

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								</div>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 border border-accent/20 focus:border-accent rounded-lg bg-sand/50 text-[#1C1917] placeholder-[#78716C] focus:outline-none transition"
									placeholder="admin@Kusumba.com"
								/>
							</div>
						</div>

						<div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="block w-full pl-10 pr-3 py-2 border border-accent/20 focus:border-accent rounded-lg bg-sand/50 text-[#1C1917] placeholder-[#78716C] focus:outline-none transition"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<div className="pt-2">
							<button
								type="submit"
								className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none transition cursor-pointer"
							>
								Entrar no Painel
							</button>
						</div>
					</form>

					<div className="mt-8 text-center text-xs text-[#78716C]">
						&copy; {new Date().getFullYear()} Kusumba. Todos os direitos reservados.
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;






