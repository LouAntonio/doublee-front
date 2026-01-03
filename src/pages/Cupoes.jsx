import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const Cupoes = () => {
	useDocumentTitle('Cupões - Double E');
	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">Cupões</h1>
				<p className="text-gray-600">Encontre e ative seus cupões de desconto.</p>
			</div>
		</>
	);
};

export default Cupoes;
