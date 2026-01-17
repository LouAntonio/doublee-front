import React from 'react';
import { Link } from 'react-router-dom';
import { IoCartOutline, IoArrowBack } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';

const Cart = () => {
	useDocumentTitle('Carrinho - Double E');
	const { cartItems } = useCart();

	return (
		<div style={{ backgroundColor: '#ededed', minHeight: '100vh' }}>
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-8">
				{/* Back Button */}
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
				>
					<IoArrowBack className="w-4 h-4" />
					Continuar Comprando
				</Link>

				{/* Page Title */}
				<h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
					Carrinho de Compras
				</h1>

				{cartItems.length === 0 ? (
					/* Empty Cart State */
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
								<IoCartOutline className="w-12 h-12 text-gray-400" />
							</div>
							<h2 className="text-xl font-bold text-gray-800 mb-3">
								Seu carrinho está vazio
							</h2>
							<p className="text-gray-600 mb-6">
								Adicione produtos ao seu carrinho para continuar comprando
							</p>
							<Link
								to="/"
								className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
							>
								Explorar Produtos
							</Link>
						</div>
					</div>
				) : (
					/* Cart with Items */
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Cart Items */}
						<div className="lg:col-span-2 space-y-4">
							<div className="bg-gray-50 rounded-lg p-4 mb-4">
								<p className="text-sm text-gray-600">
									<strong>{cartItems.length}</strong> {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
								</p>
							</div>

							{cartItems.map((item) => (
								<CartItem key={item.id} item={item} />
							))}
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<OrderSummary />

							{/* Checkout Button */}
							<Link
								to="/checkout"
								className="block w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-center rounded-lg transition-colors shadow-sm"
							>
								Finalizar Compra
							</Link>

							{/* Security Notice */}
							<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-xs text-blue-800 text-center">
									🔒 Compra 100% segura e protegida
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Cart;
