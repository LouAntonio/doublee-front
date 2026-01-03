import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Sobre = () => {
	useDocumentTitle('Sobre - Double E');
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Sobre Nós</h1>
			<p className="text-gray-600">Conheça mais sobre nossa empresa.</p>
		</div>
	);
};

export default Sobre;
