import React, { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import PasswordRecovery from '../components/PasswordRecovery';
import { IoLockClosedOutline, IoPersonAddOutline, IoKeyOutline } from 'react-icons/io5';

const Auth = () => {
	useDocumentTitle('Login / Cadastro - Double E');
	const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'recovery'

	const getIcon = () => {
		switch (authMode) {
			case 'login':
				return <IoLockClosedOutline className="w-12 h-12 text-blue-600" />;
			case 'register':
				return <IoPersonAddOutline className="w-12 h-12 text-blue-600" />;
			case 'recovery':
				return <IoKeyOutline className="w-12 h-12 text-blue-600" />;
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
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-md">
					{/* Card with glassmorphism effect */}
					<div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
						{/* Icon and Title */}
						<div className="text-center mb-8">
							<div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
								{getIcon()}
							</div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								{getTitle()}
							</h1>
							<p className="text-gray-600 text-sm">
								{authMode === 'login' && 'Entre com sua conta para continuar'}
								{authMode === 'register' && 'Preencha os dados para começar'}
								{authMode === 'recovery' && 'Recupere o acesso à sua conta'}
							</p>
						</div>

						{/* Forms with smooth transitions */}
						<div className="auth-form-container">
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

					{/* Additional Info */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Ao continuar, você concorda com nossos{' '}
							<a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
								Termos de Uso
							</a>{' '}
							e{' '}
							<a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
								Política de Privacidade
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Auth;
