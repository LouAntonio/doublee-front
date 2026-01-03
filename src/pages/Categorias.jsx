import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const Categorias = () => {
	useDocumentTitle('Categorias - Double E');
	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">Categorias</h1>
				<p className="text-gray-600">Explore todas as nossas categorias de produtos.</p>
			</div>
		</>
	);
};

export default Categorias;
