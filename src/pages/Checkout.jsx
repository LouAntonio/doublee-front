import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';

const Checkout = () => {
	useDocumentTitle('Checkout - Double E');
	const navigate = useNavigate();
	const { cartItems, clearCart } = useCart();
	const [currentStep, setCurrentStep] = useState(1);
	const [orderPlaced, setOrderPlaced] = useState(false);

	// Form states
	const [shippingInfo, setShippingInfo] = useState({
		fullName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		country: 'Brasil',
	});

	const [paymentInfo, setPaymentInfo] = useState({
		method: 'credit', // credit, pix, boleto
		cardNumber: '',
		cardName: '',
		cardExpiry: '',
		cardCVV: '',
	});

	const [errors, setErrors] = useState({});

	// Redirect if cart is empty
	React.useEffect(() => {
		if (cartItems.length === 0 && !orderPlaced) {
			navigate('/cart');
		}
	}, [cartItems, navigate, orderPlaced]);

	const validateStep1 = () => {
		const newErrors = {};
		if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
		if (!shippingInfo.email.trim()) newErrors.email = 'Email é obrigatório';
		if (!shippingInfo.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
		if (!shippingInfo.address.trim()) newErrors.address = 'Endereço é obrigatório';
		if (!shippingInfo.city.trim()) newErrors.city = 'Cidade é obrigatória';
		if (!shippingInfo.state.trim()) newErrors.state = 'Estado é obrigatório';
		if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = () => {
		if (paymentInfo.method === 'pix' || paymentInfo.method === 'boleto') {
			return true; // No validation needed for PIX/Boleto
		}

		const newErrors = {};
		if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório';
		if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Nome no cartão é obrigatório';
		if (!paymentInfo.cardExpiry.trim()) newErrors.cardExpiry = 'Validade é obrigatória';
		if (!paymentInfo.cardCVV.trim()) newErrors.cardCVV = 'CVV é obrigatório';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (currentStep === 1) {
			if (validateStep1()) {
				setCurrentStep(2);
				setErrors({});
			}
		} else if (currentStep === 2) {
			if (validateStep2()) {
				setCurrentStep(3);
				setErrors({});
			}
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
			setErrors({});
		}
	};

	const handlePlaceOrder = () => {
		// Simulate order placement
		setOrderPlaced(true);
		clearCart();
	};

	if (orderPlaced) {
		return (
			<div style={{ backgroundColor: '#ededed', minHeight: '100vh' }}>
				<Header />
				<div className="max-w-2xl mx-auto px-4 py-12 text-center">
					<div className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
						<div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
							<IoCheckmarkCircle className="w-12 h-12 text-green-600" />
						</div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
							Pedido Realizado com Sucesso!
						</h1>
						<p className="text-gray-600 mb-6">
							Obrigado pela sua compra. Você receberá um email de confirmação em breve.
						</p>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
							<p className="text-sm text-blue-800">
								<strong>Número do Pedido:</strong> #DBE{Math.floor(Math.random() * 1000000)}
							</p>
						</div>
						<Link
							to="/"
							className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
						>
							Voltar para Home
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div style={{ backgroundColor: '#ededed', minHeight: '100vh' }}>
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-8">
				{/* Back Button */}
				<Link
					to="/cart"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
				>
					<IoArrowBack className="w-4 h-4" />
					Voltar ao Carrinho
				</Link>

				{/* Page Title */}
				<h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
					Finalizar Compra
				</h1>

				{/* Checkout Steps */}
				<CheckoutSteps currentStep={currentStep} onStepClick={setCurrentStep} />

				{/* Checkout Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Form Section */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
							{/* Step 1: Shipping Information */}
							{currentStep === 1 && (
								<div>
									<h2 className="text-xl font-bold text-gray-800 mb-6">
										Informações de Envio
									</h2>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Nome Completo *
											</label>
											<input
												type="text"
												value={shippingInfo.fullName}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, fullName: e.target.value })
												}
												className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
													}`}
												placeholder="João Silva"
											/>
											{errors.fullName && (
												<p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Email *
												</label>
												<input
													type="email"
													value={shippingInfo.email}
													onChange={(e) =>
														setShippingInfo({ ...shippingInfo, email: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="joao@email.com"
												/>
												{errors.email && (
													<p className="text-xs text-red-500 mt-1">{errors.email}</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Telefone *
												</label>
												<input
													type="tel"
													value={shippingInfo.phone}
													onChange={(e) =>
														setShippingInfo({ ...shippingInfo, phone: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="(11) 98765-4321"
												/>
												{errors.phone && (
													<p className="text-xs text-red-500 mt-1">{errors.phone}</p>
												)}
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Endereço *
											</label>
											<input
												type="text"
												value={shippingInfo.address}
												onChange={(e) =>
													setShippingInfo({ ...shippingInfo, address: e.target.value })
												}
												className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
													}`}
												placeholder="Rua Example, 123"
											/>
											{errors.address && (
												<p className="text-xs text-red-500 mt-1">{errors.address}</p>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Cidade *
												</label>
												<input
													type="text"
													value={shippingInfo.city}
													onChange={(e) =>
														setShippingInfo({ ...shippingInfo, city: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="São Paulo"
												/>
												{errors.city && (
													<p className="text-xs text-red-500 mt-1">{errors.city}</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Estado *
												</label>
												<input
													type="text"
													value={shippingInfo.state}
													onChange={(e) =>
														setShippingInfo({ ...shippingInfo, state: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="SP"
												/>
												{errors.state && (
													<p className="text-xs text-red-500 mt-1">{errors.state}</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													CEP *
												</label>
												<input
													type="text"
													value={shippingInfo.zipCode}
													onChange={(e) =>
														setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="01234-567"
												/>
												{errors.zipCode && (
													<p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>
												)}
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Step 2: Payment Method */}
							{currentStep === 2 && (
								<div>
									<h2 className="text-xl font-bold text-gray-800 mb-6">
										Método de Pagamento
									</h2>

									{/* Payment Method Selection */}
									<div className="space-y-3 mb-6">
										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'credit' })}
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentInfo.method === 'credit'
													? 'border-blue-600 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
												}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'credit'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'credit' })}
													className="w-4 h-4"
												/>
												<div>
													<p className="font-semibold text-gray-800">Cartão de Crédito</p>
													<p className="text-xs text-gray-500">Visa, Mastercard, Elo</p>
												</div>
											</div>
										</div>

										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'pix' })}
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentInfo.method === 'pix'
													? 'border-blue-600 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
												}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'pix'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'pix' })}
													className="w-4 h-4"
												/>
												<div>
													<p className="font-semibold text-gray-800">PIX</p>
													<p className="text-xs text-gray-500">Aprovação instantânea</p>
												</div>
											</div>
										</div>

										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'boleto' })}
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentInfo.method === 'boleto'
													? 'border-blue-600 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
												}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'boleto'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'boleto' })}
													className="w-4 h-4"
												/>
												<div>
													<p className="font-semibold text-gray-800">Boleto Bancário</p>
													<p className="text-xs text-gray-500">Vencimento em 3 dias</p>
												</div>
											</div>
										</div>
									</div>

									{/* Credit Card Form */}
									{paymentInfo.method === 'credit' && (
										<div className="space-y-4 pt-4 border-t border-gray-200">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Número do Cartão *
												</label>
												<input
													type="text"
													value={paymentInfo.cardNumber}
													onChange={(e) =>
														setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="1234 5678 9012 3456"
													maxLength="19"
												/>
												{errors.cardNumber && (
													<p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
												)}
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Nome no Cartão *
												</label>
												<input
													type="text"
													value={paymentInfo.cardName}
													onChange={(e) =>
														setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
													}
													className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardName ? 'border-red-500' : 'border-gray-300'
														}`}
													placeholder="JOÃO SILVA"
												/>
												{errors.cardName && (
													<p className="text-xs text-red-500 mt-1">{errors.cardName}</p>
												)}
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Validade *
													</label>
													<input
														type="text"
														value={paymentInfo.cardExpiry}
														onChange={(e) =>
															setPaymentInfo({ ...paymentInfo, cardExpiry: e.target.value })
														}
														className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
															}`}
														placeholder="MM/AA"
														maxLength="5"
													/>
													{errors.cardExpiry && (
														<p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>
													)}
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														CVV *
													</label>
													<input
														type="text"
														value={paymentInfo.cardCVV}
														onChange={(e) =>
															setPaymentInfo({ ...paymentInfo, cardCVV: e.target.value })
														}
														className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardCVV ? 'border-red-500' : 'border-gray-300'
															}`}
														placeholder="123"
														maxLength="4"
													/>
													{errors.cardCVV && (
														<p className="text-xs text-red-500 mt-1">{errors.cardCVV}</p>
													)}
												</div>
											</div>
										</div>
									)}

									{/* PIX Instructions */}
									{paymentInfo.method === 'pix' && (
										<div className="pt-4 border-t border-gray-200">
											<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
												<p className="text-sm text-blue-800">
													Após confirmar o pedido, você receberá um código PIX para realizar o pagamento.
												</p>
											</div>
										</div>
									)}

									{/* Boleto Instructions */}
									{paymentInfo.method === 'boleto' && (
										<div className="pt-4 border-t border-gray-200">
											<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
												<p className="text-sm text-blue-800">
													O boleto será gerado após a confirmação do pedido e enviado por email.
												</p>
											</div>
										</div>
									)}
								</div>
							)}

							{/* Step 3: Review & Confirm */}
							{currentStep === 3 && (
								<div>
									<h2 className="text-xl font-bold text-gray-800 mb-6">
										Revisar Pedido
									</h2>

									{/* Shipping Info Review */}
									<div className="mb-6">
										<h3 className="font-semibold text-gray-800 mb-3">Informações de Envio</h3>
										<div className="bg-gray-50 rounded-lg p-4 space-y-1">
											<p className="text-sm text-gray-700">
												<strong>Nome:</strong> {shippingInfo.fullName}
											</p>
											<p className="text-sm text-gray-700">
												<strong>Email:</strong> {shippingInfo.email}
											</p>
											<p className="text-sm text-gray-700">
												<strong>Telefone:</strong> {shippingInfo.phone}
											</p>
											<p className="text-sm text-gray-700">
												<strong>Endereço:</strong> {shippingInfo.address}, {shippingInfo.city} - {shippingInfo.state}, {shippingInfo.zipCode}
											</p>
										</div>
										<button
											onClick={() => setCurrentStep(1)}
											className="text-sm text-blue-600 hover:text-blue-700 mt-2"
										>
											Editar
										</button>
									</div>

									{/* Payment Info Review */}
									<div className="mb-6">
										<h3 className="font-semibold text-gray-800 mb-3">Método de Pagamento</h3>
										<div className="bg-gray-50 rounded-lg p-4">
											<p className="text-sm text-gray-700">
												{paymentInfo.method === 'credit' && '💳 Cartão de Crédito'}
												{paymentInfo.method === 'pix' && '📱 PIX'}
												{paymentInfo.method === 'boleto' && '📄 Boleto Bancário'}
											</p>
											{paymentInfo.method === 'credit' && paymentInfo.cardNumber && (
												<p className="text-sm text-gray-500 mt-1">
													**** **** **** {paymentInfo.cardNumber.slice(-4)}
												</p>
											)}
										</div>
										<button
											onClick={() => setCurrentStep(2)}
											className="text-sm text-blue-600 hover:text-blue-700 mt-2"
										>
											Editar
										</button>
									</div>

									{/* Terms */}
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
										<p className="text-xs text-gray-700">
											Ao finalizar a compra, você concorda com nossos{' '}
											<a href="#" className="text-blue-600 hover:underline">
												Termos de Uso
											</a>{' '}
											e{' '}
											<a href="#" className="text-blue-600 hover:underline">
												Política de Privacidade
											</a>
											.
										</p>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
								{currentStep > 1 && (
									<button
										onClick={handleBack}
										className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
									>
										Voltar
									</button>
								)}
								{currentStep < 3 ? (
									<button
										onClick={handleNext}
										className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
									>
										Continuar
									</button>
								) : (
									<button
										onClick={handlePlaceOrder}
										className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
									>
										Finalizar Pedido
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Order Summary Sidebar */}
					<div className="lg:col-span-1">
						<OrderSummary showPromoCode={false} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
