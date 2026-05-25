import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { googleAuth } from '../services/auth';
import { notyf } from '../utils/notyf';

const GoogleButton = ({ onSuccessMessage = 'Login realizado com sucesso!', onLoginSuccess }) => {
	const navigate = useNavigate();
	const login = useAuthStore((s) => s.login);

	const handleSuccess = async (credentialResponse) => {
		try {
			const data = await googleAuth(credentialResponse.credential);
			if (data.success) {
				login(data.user, data.token);
				notyf.success(onSuccessMessage);
				if (onLoginSuccess) onLoginSuccess(data.user);
				else navigate('/');
			} else {
				notyf.error(data.msg || 'Erro ao fazer login com Google.');
			}
		} catch (error) {
			notyf.error('Erro ao comunicar com o servidor.');
		}
	};

	const handleError = () => notyf.error('Erro ao fazer login com Google.');

	return (
		<div className="w-full">
			<GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap text="signin_with" shape="rectangular" width="100%" size="large" locale="pt_BR" className="w-full" />
		</div>
	);
};

export const GoogleRegisterButton = () => {
	const navigate = useNavigate();
	const login = useAuthStore((s) => s.login);

	const handleSuccess = async (credentialResponse) => {
		try {
			const data = await googleAuth(credentialResponse.credential);
			if (data.success) {
				login(data.user, data.token);
				notyf.success('Conta criada com sucesso!');
				navigate('/');
			} else {
				notyf.error(data.msg || 'Erro ao criar conta com Google.');
			}
		} catch (error) {
			notyf.error('Erro ao comunicar com o servidor.');
		}
	};

	const handleError = () => notyf.error('Erro ao criar conta com Google.');

	return (
		<div className="w-full">
			<GoogleLogin onSuccess={handleSuccess} onError={handleError} useOneTap text="signup_with" shape="rectangular" width="100%" size="large" locale="pt_BR" className="w-full" />
		</div>
	);
};

export default GoogleButton;
