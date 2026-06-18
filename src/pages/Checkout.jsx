import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary from '../components/OrderSummary';
import useCartStore from '../stores/cartStore';
import { notyf } from '../utils/notyf';
import { formatCurrency } from '../utils/currency';
import { useCreateOrder } from '../hooks/queries/useOrders';
import http from '../services/http';

const Checkout = () => {
	useDocumentTitle('Checkout - Kusumba');
	const navigate = useNavigate();
	const { cartItems, clearCart, appliedCoupon, setAppliedCoupon } = useCartStore();
	const [currentStep, setCurrentStep] = useState(1);

	const [orderPlaced, setOrderPlaced] = useState(false);
	const [orderNumber] = useState(() => Math.floor(Math.random() * 1000000));
	const { mutateAsync: createOrder } = useCreateOrder();

	// Delivery state
	const [deliveryOption, setDeliveryOption] = useState('delivery');
	const [deliveryZones, setDeliveryZones] = useState([]);
	const [selectedZoneId, setSelectedZoneId] = useState('');
	const [selectedZonePrice, setSelectedZonePrice] = useState(0);
	const [zonesLoading, setZonesLoading] = useState(false);

	// Fetch delivery zones
	useEffect(() => {
		const fetchZones = async () => {
			setZonesLoading(true);
			try {
				const res = await http.get('/delivery-zones');
				if (res?.success && res.data?.zones) {
					setDeliveryZones(res.data.zones);
				}
			} catch { } finally {
				setZonesLoading(false);
			}
		};
		fetchZones();
	}, []);

	// Update price when zone changes
	const handleZoneChange = (zoneId) => {
		setSelectedZoneId(zoneId);
		const zone = deliveryZones.find(z => z.id === zoneId);
		setSelectedZonePrice(zone ? Number(zone.price) : 0);
	};

	// Form states
	const [shippingInfo, setShippingInfo] = useState({
		fullName: '',
		email: '',
		phone: '',
		address: '',
		municipality: '',
		province: '',
		country: 'Angola',
	});

	const [paymentInfo, setPaymentInfo] = useState({
		method: 'multicaixa',
		phoneNumber: '',
		bankName: '',
		accountNumber: '',
	});

	const [errors, setErrors] = useState({});

	// Redirect if cart is empty
	useEffect(() => {
		if (cartItems.length === 0 && !orderPlaced) {
			navigate('/cart');
		}
	}, [cartItems, navigate, orderPlaced]);

	const validateStep1 = () => {
		const newErrors = {};
		if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
		if (!shippingInfo.email.trim()) newErrors.email = 'Email é obrigatório';
		if (!shippingInfo.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
		if (deliveryOption === 'delivery') {
			if (!shippingInfo.address.trim()) newErrors.address = 'Endereço é obrigatório';
			if (!shippingInfo.municipality.trim()) newErrors.municipality = 'Município é obrigatório';
			if (!shippingInfo.province.trim()) newErrors.province = 'Província é obrigatória';
			if (!selectedZoneId) newErrors.deliveryZone = 'Seleccione uma zona de entrega';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = () => {
		const newErrors = {};

		if (paymentInfo.method === 'multicaixa') {
			if (!paymentInfo.phoneNumber.trim()) newErrors.phoneNumber = 'Número de telefone é obrigatório';
		} else if (paymentInfo.method === 'transfer') {
			return true;
		}

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

	const handlePlaceOrder = async () => {
		try {
			const payload = {
				items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
				shippingAddress: deliveryOption === 'delivery'
					? `${shippingInfo.address}, ${shippingInfo.municipality}, ${shippingInfo.province}`
					: 'Levantar na Sede',
				couponCode: appliedCoupon?.code,
				deliveryOption,
			};
			if (deliveryOption === 'delivery' && selectedZoneId) {
				payload.deliveryZoneId = selectedZoneId;
			}

			const res = await createOrder(payload);

			if (res?.success) {
				setOrderPlaced(true);
				clearCart();
				setAppliedCoupon(null);
			} else {
				notyf.error(res?.msg || 'Erro ao realizar pedido.');
			}
		} catch {
			notyf.error('Erro ao conectar ao servidor.');
		}
	};

	if (orderPlaced) {
		return (
			<div className="bg-sand min-h-screen">
				<Header />
				<div className="max-w-2xl mx-auto px-4 py-12">
					<div className="bg-white rounded-2xl shadow-md p-8 lg:p-12 text-center">
						<div className="w-20 h-20 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
							<IoCheckmarkCircle className="w-12 h-12 text-accent" />
						</div>
						<h1 className="text-2xl lg:text-3xl font-display text-[#1C1917] mb-4">
							Pedido Realizado com Sucesso!
						</h1>
						<p className="text-[#78716C] mb-6">
							Obrigado pela sua compra. Você receberá um email de confirmação em breve.
						</p>
						<div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6">
							<p className="text-sm text-accent">
								<strong>Número do Pedido:</strong> #DBE{orderNumber}
							</p>
						</div>
						<Link
							to="/"
							className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
						>
							Voltar para Home
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-sand min-h-screen">
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 lg:py-8">
				<Link
					to="/cart"
					className="inline-flex items-center gap-2 text-accent hover:text-accent-dark mb-4 text-sm font-body"
				>
					<IoArrowBack className="w-4 h-4" />
					Voltar ao Carrinho
				</Link>

				<h1 className="text-2xl lg:text-3xl font-display text-[#1C1917] mb-6">
					Finalizar Compra
				</h1>

				<CheckoutSteps currentStep={currentStep} onStepClick={setCurrentStep} />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
							{currentStep === 1 && (
								<div>
									<h2 className="text-xl font-display text-[#1C1917] mb-6">
										Informações de Envio
									</h2>

									{/* Delivery Option */}
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-[#1C1917] mb-3">Opção de Entrega</h3>
										<div className="space-y-3">
											<div
												onClick={() => { setDeliveryOption('delivery'); setSelectedZoneId(''); setSelectedZonePrice(0); }}
												className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryOption === 'delivery'
													? 'border-accent bg-accent/5'
													: 'border-accent/10 hover:border-accent/30'
												}`}
											>
												<div className="flex items-center gap-3">
													<input type="radio" checked={deliveryOption === 'delivery'}
														onChange={() => { setDeliveryOption('delivery'); setSelectedZoneId(''); setSelectedZonePrice(0); }}
														className="w-4 h-4 accent-accent" />
													<div>
														<p className="font-display text-[#1C1917]">Entrega ao Domicílio</p>
														<p className="text-xs text-[#78716C]">Receba na sua morada</p>
													</div>
												</div>
											</div>

											<div
												onClick={() => { setDeliveryOption('pickup'); setSelectedZoneId(''); setSelectedZonePrice(0); }}
												className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryOption === 'pickup'
													? 'border-accent bg-accent/5'
													: 'border-accent/10 hover:border-accent/30'
												}`}
											>
												<div className="flex items-center gap-3">
													<input type="radio" checked={deliveryOption === 'pickup'}
														onChange={() => { setDeliveryOption('pickup'); setSelectedZoneId(''); setSelectedZonePrice(0); }}
														className="w-4 h-4 accent-accent" />
													<div>
														<p className="font-display text-[#1C1917]">Levantar na Sede</p>
														<p className="text-xs text-[#78716C]">Vai buscar pessoalmente à nossa sede</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									{deliveryOption === 'delivery' && (
										<div className="mb-6">
											<h3 className="text-sm font-semibold text-[#1C1917] mb-3">Zona de Entrega</h3>
											<select
												value={selectedZoneId}
												onChange={(e) => handleZoneChange(e.target.value)}
												className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] font-body ${errors.deliveryZone ? 'border-red-500' : 'border-accent/20'
												}`}
											>
												<option value="">Seleccione a zona de entrega</option>
												{zonesLoading ? (
													<option disabled>A carregar...</option>
												) : deliveryZones.length === 0 ? (
													<option disabled>Nenhuma zona disponível</option>
												) : (
													deliveryZones.map(zone => (
														<option key={zone.id} value={zone.id}>
															{zone.name} — {formatCurrency(Number(zone.price))}
														</option>
													))
												)}
											</select>
											{errors.deliveryZone && (
												<p className="text-xs text-red-500 mt-1">{errors.deliveryZone}</p>
											)}
											{selectedZonePrice > 0 && (
												<p className="text-xs text-accent mt-2">
													Custo de entrega: {formatCurrency(selectedZonePrice)}
												</p>
											)}
										</div>
									)}

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-body text-[#78716C] mb-1">
												Nome Completo *
											</label>
											<input type="text" value={shippingInfo.fullName}
												onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
												className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.fullName ? 'border-red-500' : 'border-accent/20'}`}
												placeholder="João Silva" />
											{errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-body text-[#78716C] mb-1">Email *</label>
												<input type="email" value={shippingInfo.email}
													onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
													className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.email ? 'border-red-500' : 'border-accent/20'}`}
													placeholder="joao@email.com" />
												{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
											</div>
											<div>
												<label className="block text-sm font-body text-[#78716C] mb-1">Telefone *</label>
												<input type="tel" value={shippingInfo.phone}
													onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
													className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.phone ? 'border-red-500' : 'border-accent/20'}`}
													placeholder="+244 923 456 789" />
												{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
											</div>
										</div>

										{deliveryOption === 'delivery' && (
											<>
												<div>
													<label className="block text-sm font-body text-[#78716C] mb-1">Endereço Completo *</label>
													<input type="text" value={shippingInfo.address}
														onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
														className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.address ? 'border-red-500' : 'border-accent/20'}`}
														placeholder="Rua da Independência, Prédio 123, Apt 4B" />
													{errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<label className="block text-sm font-body text-[#78716C] mb-1">Município *</label>
														<input type="text" value={shippingInfo.municipality}
															onChange={(e) => setShippingInfo({ ...shippingInfo, municipality: e.target.value })}
															className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.municipality ? 'border-red-500' : 'border-accent/20'}`}
															placeholder="Luanda" />
														{errors.municipality && <p className="text-xs text-red-500 mt-1">{errors.municipality}</p>}
													</div>
													<div>
														<label className="block text-sm font-body text-[#78716C] mb-1">Província *</label>
														<select value={shippingInfo.province}
															onChange={(e) => setShippingInfo({ ...shippingInfo, province: e.target.value })}
															className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] font-body ${errors.province ? 'border-red-500' : 'border-accent/20'}`}>
															<option value="">Selecione uma província</option>
															<option value="Luanda">Luanda</option>
															<option value="Bengo">Bengo</option>
															<option value="Benguela">Benguela</option>
															<option value="Bié">Bié</option>
															<option value="Cabinda">Cabinda</option>
															<option value="Cuando Cubango">Cuando Cubango</option>
															<option value="Cuanza Norte">Cuanza Norte</option>
															<option value="Cuanza Sul">Cuanza Sul</option>
															<option value="Cunene">Cunene</option>
															<option value="Huambo">Huambo</option>
															<option value="Huíla">Huíla</option>
															<option value="Lunda Norte">Lunda Norte</option>
															<option value="Lunda Sul">Lunda Sul</option>
															<option value="Malanje">Malanje</option>
															<option value="Moxico">Moxico</option>
															<option value="Namibe">Namibe</option>
															<option value="Uíge">Uíge</option>
															<option value="Zaire">Zaire</option>
														</select>
														{errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
													</div>
												</div>
											</>
										)}

										{deliveryOption === 'pickup' && (
											<div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
												<p className="text-sm text-accent">
													<strong>Levantamento na Sede</strong>
												</p>
												<p className="text-xs text-[#78716C] mt-1">
													Receberá um email quando a encomenda estiver pronta para levantamento.
													Os vendedores são responsáveis por fazer chegar os produtos à nossa sede.
												</p>
											</div>
										)}
									</div>
								</div>
							)}

							{currentStep === 2 && (
								<div>
									<h2 className="text-xl font-display text-[#1C1917] mb-6">
										Método de Pagamento
									</h2>

									<div className="space-y-3 mb-6">
										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'multicaixa' })}
											className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentInfo.method === 'multicaixa'
												? 'border-accent bg-accent/5'
												: 'border-accent/10 hover:border-accent/30'
											}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'multicaixa'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'multicaixa' })}
													className="w-4 h-4 accent-accent"
												/>
												<div>
													<p className="font-display text-[#1C1917]">Multicaixa Express</p>
													<p className="text-xs text-[#78716C]">Pagamento via telemóvel</p>
												</div>
											</div>
										</div>

										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'transfer' })}
											className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentInfo.method === 'transfer'
												? 'border-accent bg-accent/5'
												: 'border-accent/10 hover:border-accent/30'
											}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'transfer'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'transfer' })}
													className="w-4 h-4 accent-accent"
												/>
												<div>
													<p className="font-display text-[#1C1917]">Transferência Bancária</p>
													<p className="text-xs text-[#78716C]">Pagamento no Balcão, ATM e Apps de Online Banking</p>
												</div>
											</div>
										</div>
									</div>

									{paymentInfo.method === 'multicaixa' && (
										<div className="space-y-4 pt-4 border-t border-accent/10">
											<div>
												<label className="block text-sm font-body text-[#78716C] mb-1">
													Número de Telefone *
												</label>
												<input
													type="tel"
													value={paymentInfo.phoneNumber}
													onChange={(e) =>
														setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })
													}
													className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.phoneNumber ? 'border-red-500' : 'border-accent/20'
													}`}
													placeholder="+244 923 456 789"
												/>
												{errors.phoneNumber && (
													<p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
												)}
											</div>
											<div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
												<p className="text-sm text-accent">
													Após confirmar o pedido, receberá uma notificação no seu telemóvel para autorizar o pagamento.
												</p>
											</div>
										</div>
									)}

									{paymentInfo.method === 'transfer' && (
										<div className="pt-4 border-t border-accent/10">
											<div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
												<p className="text-sm text-accent mb-3">
													<strong>Dados para Transferência Bancária:</strong>
												</p>
												<div className="space-y-2 text-sm text-accent">
													<p><strong>Banco:</strong> Banco Angolano de Investimentos (BAI)</p>
													<p><strong>Titular:</strong> Kusumba</p>
													<p><strong>IBAN:</strong> AO06 0000 0123 4567 8901 2345 6</p>
													<p className="mt-3 text-xs">
														Após efetuar a transferência, envie o comprovativo para o nosso WhatsApp ou email.
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							)}

							{currentStep === 3 && (
								<div>
									<h2 className="text-xl font-display text-[#1C1917] mb-6">
										Revisar Pedido
									</h2>

									<div className="mb-6">
										<h3 className="font-display text-[#1C1917] mb-3">Informações de Envio</h3>
										<div className="bg-accent/5 rounded-xl p-4 space-y-1">
											<p className="text-sm text-[#1C1917]">
												<strong>Nome:</strong> {shippingInfo.fullName}
											</p>
											<p className="text-sm text-[#1C1917]">
												<strong>Email:</strong> {shippingInfo.email}
											</p>
											<p className="text-sm text-[#1C1917]">
												<strong>Telefone:</strong> {shippingInfo.phone}
											</p>
											{deliveryOption === 'delivery' ? (
												<>
													<p className="text-sm text-[#1C1917]">
														<strong>Endereço:</strong> {shippingInfo.address}, {shippingInfo.municipality} - {shippingInfo.province}
													</p>
													{selectedZonePrice > 0 && (
														<p className="text-sm text-[#1C1917]">
															<strong>Zona de Entrega:</strong> {deliveryZones.find(z => z.id === selectedZoneId)?.name} — {formatCurrency(selectedZonePrice)}
														</p>
													)}
												</>
											) : (
												<p className="text-sm text-[#1C1917]">
													<strong>Opção:</strong> Levantar na Sede
												</p>
											)}
										</div>
										<button
											onClick={() => setCurrentStep(1)}
											className="text-sm text-accent hover:text-accent-dark mt-2 font-body cursor-pointer"
										>
											Editar
										</button>
									</div>

									<div className="mb-6">
										<h3 className="font-display text-[#1C1917] mb-3">Método de Pagamento</h3>
										<div className="bg-accent/5 rounded-xl p-4">
											<p className="text-sm text-[#1C1917]">
												{paymentInfo.method === 'multicaixa' && '📱 Multicaixa Express'}
												{paymentInfo.method === 'transfer' && '🏦 Transferência Bancária'}
											</p>
											{paymentInfo.method === 'multicaixa' && paymentInfo.phoneNumber && (
												<p className="text-sm text-[#78716C] mt-1">
													Telefone: {paymentInfo.phoneNumber}
												</p>
											)}
										</div>
										<button
											onClick={() => setCurrentStep(2)}
											className="text-sm text-accent hover:text-accent-dark mt-2 font-body cursor-pointer"
										>
											Editar
										</button>
									</div>

									<div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
										<p className="text-xs text-[#78716C]">
											Ao finalizar a compra, você concorda com nossos{' '}
											<a href="#" className="text-accent hover:underline">
												Termos de Uso
											</a>{' '}
											e{' '}
											<a href="#" className="text-accent hover:underline">
												Política de Privacidade
											</a>
											.
										</p>
									</div>
								</div>
							)}

							<div className="flex gap-3 mt-6 pt-6 border-t border-accent/10">
								{currentStep > 1 && (
									<button
										onClick={handleBack}
										className="flex-1 px-6 py-3 border-2 border-[#1C1917]/20 text-[#1C1917] font-display font-semibold rounded-xl hover:border-accent hover:text-accent transition-all duration-300 cursor-pointer"
									>
										Voltar
									</button>
								)}
								{currentStep < 3 ? (
									<button
										onClick={handleNext}
										className="flex-1 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg cursor-pointer"
									>
										Continuar
									</button>
								) : (
									<button
										onClick={handlePlaceOrder}
										className="flex-1 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg cursor-pointer"
									>
										Finalizar Pedido
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="lg:col-span-1">
						<OrderSummary showPromoCode={false}
							deliveryOption={deliveryOption}
							deliveryPrice={selectedZonePrice}
							deliveryZoneName={deliveryZones.find(z => z.id === selectedZoneId)?.name} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
