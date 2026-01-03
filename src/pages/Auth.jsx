import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Auth = () => {
	useDocumentTitle('Login / Cadastro - Double E');
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Login / Cadastro</h1>
			<p className="text-gray-600">Faça login ou crie sua conta.</p>
		</div>
	);
};

export default Auth;
