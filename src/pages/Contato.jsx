import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const Contato = () => {
	useDocumentTitle('Contato - Double E');
	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">Contato</h1>
				<p className="text-gray-600">Entre em contato conosco.</p>
			</div>
		</>
	);
};

export default Contato;
