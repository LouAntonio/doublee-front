import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Home = () => {
	useDocumentTitle('Home - Double E');
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Bem-vindo à Home</h1>
			<p className="text-gray-600">Página inicial com destaques e ofertas.</p>
		</div>
	);
};

export default Home;
