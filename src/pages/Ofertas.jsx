import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const Ofertas = () => {
	useDocumentTitle('Ofertas - Double E');
	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">Ofertas</h1>
				<p className="text-gray-600">Confira nossas melhores ofertas e promoções.</p>
			</div>
		</>
	);
};

export default Ofertas;
