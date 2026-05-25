import React, { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import PasswordRecovery from '../components/PasswordRecovery';
import { IoLockClosedOutline, IoPersonAddOutline, IoKeyOutline } from 'react-icons/io5';

const Auth = () => {
	useDocumentTitle('Login / Cadastro - Kusumba');
	const [authMode, setAuthMode] = useState('login');

	const getIcon = () => {
		switch (authMode) {
			case 'login':
				return <IoLockClosedOutline className="w-12 h-12 text-accent" />;
			case 'register':
				return <IoPersonAddOutline className="w-12 h-12 text-accent" />;
			case 'recovery':
				return <IoKeyOutline className="w-12 h-12 text-accent" />;
			default:
				return null;
		}
	};

	const getTitle = () => {
		switch (authMode) {
			case 'login':
				return 'Bem-vindo de volta!';
			case 'register':
				return 'Crie sua conta';
			case 'recovery':
				return 'Recuperar senha';
			default:
				return '';
		}
	};

	return (
		<>
			<Header />
			<div className="relative min-h-screen bg-sand overflow-hidden">
				<div className="geo-pattern absolute inset-0 opacity-40" />
				<div className="relative flex items-center justify-center px-4 py-12 min-h-screen">
					<div className="w-full max-w-md">
						<div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
							<div className="text-center mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
								<div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
									{getIcon()}
								</div>
								<h1 className="font-display text-3xl md:text-4xl text-[#1C1917] mb-2">
									{getTitle()}
								</h1>
								<p className="font-body text-[#78716C] text-sm">
									{authMode === 'login' && 'Entre com sua conta para continuar'}
									{authMode === 'register' && 'Preencha os dados para começar'}
									{authMode === 'recovery' && 'Recupere o acesso à sua conta'}
								</p>
							</div>

							<div className="auth-form-container opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
								{authMode === 'login' && (
									<div className="auth-form-slide">
										<LoginForm
											onSwitchToRegister={() => setAuthMode('register')}
											onSwitchToRecovery={() => setAuthMode('recovery')}
										/>
									</div>
								)}
								{authMode === 'register' && (
									<div className="auth-form-slide">
										<RegisterForm
											onSwitchToLogin={() => setAuthMode('login')}
										/>
									</div>
								)}
								{authMode === 'recovery' && (
									<div className="auth-form-slide">
										<PasswordRecovery
											onSwitchToLogin={() => setAuthMode('login')}
										/>
									</div>
								)}
							</div>
						</div>

						<div className="mt-6 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
							<p className="font-body text-sm text-[#78716C]">
								Ao continuar, você concorda com nossos{' '}
								<a href="#" className="text-accent hover:text-accent-dark font-display font-semibold">
									Termos de Uso
								</a>{' '}
								e{' '}
								<a href="#" className="text-accent hover:text-accent-dark font-display font-semibold">
									Política de Privacidade
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Auth;
