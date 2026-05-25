import React from 'react';
import { Link } from 'react-router-dom';
import { IoCartOutline, IoArrowBack } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import useCartStore from '../stores/cartStore';

const Cart = () => {
	useDocumentTitle('Carrinho - Kusumba');
	const { cartItems } = useCartStore();

	return (
		<div className="min-h-screen bg-sand">
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-8">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-accent hover:text-accent-dark mb-4 text-sm font-body font-medium"
				>
					<IoArrowBack className="w-4 h-4" />
					Continuar Comprando
				</Link>

				<h1 className="font-display text-3xl lg:text-4xl text-[#1C1917] mb-6">
					Carrinho de Compras
				</h1>

				{cartItems.length === 0 ? (
					<div className="bg-white rounded-2xl shadow-md p-8 lg:p-12 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
								<IoCartOutline className="w-12 h-12 text-[#78716C]" />
							</div>
							<h2 className="font-display text-2xl text-[#1C1917] mb-3">
								Seu carrinho está vazio
							</h2>
							<p className="font-body text-[#78716C] mb-6">
								Adicione produtos ao seu carrinho para continuar comprando
							</p>
							<Link
								to="/"
								className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
							>
								Explorar Produtos
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2 space-y-4">
							<div className="bg-white/60 rounded-2xl p-4 mb-4">
								<p className="text-sm text-[#78716C] font-body">
									<strong className="text-[#1C1917]">{cartItems.length}</strong> {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
								</p>
							</div>

							{cartItems.map((item) => (
								<CartItem key={item.id} item={item} />
							))}
						</div>

						<div className="lg:col-span-1">
							<OrderSummary />

							<div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-2xl">
								<p className="text-xs text-accent text-center font-body">
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
