import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle, IoCloudUploadOutline, IoTrashOutline, IoDocumentOutline } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary from '../components/OrderSummary';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import { notyf } from '../utils/notyf';
import { formatCurrency } from '../utils/currency';
import { useCreateOrder } from '../hooks/queries/useOrders';
import { uploadToCloudinary } from '../services/cloudinary';
import http from '../services/http';

const Checkout = () => {
	useDocumentTitle('Checkout - Kusumba');
	const navigate = useNavigate();
	const { cartItems, clearCart, appliedCoupon, setAppliedCoupon } = useCartStore();
	const { user } = useAuthStore();
	const [currentStep, setCurrentStep] = useState(1);

	const [orderPlaced, setOrderPlaced] = useState(false);
	const [orderId, setOrderId] = useState('');
	const [submittedProof, setSubmittedProof] = useState(false);
	const { mutateAsync: createOrder, isPending: creatingOrder } = useCreateOrder();

	// Delivery state
	const [deliveryOption, setDeliveryOption] = useState('delivery');
	const [deliveryZones, setDeliveryZones] = useState([]);
	const [selectedZoneId, setSelectedZoneId] = useState('');
	const [selectedZonePrice, setSelectedZonePrice] = useState(0);
	const [zonesLoading, setZonesLoading] = useState(false);

	// User saved address
	const [savedAddress, setSavedAddress] = useState('');
	const [profileLoaded, setProfileLoaded] = useState(false);

	// Form states
	const [shippingInfo, setShippingInfo] = useState({
		useSavedAddress: true,
		address: '',
	});

	const [paymentInfo, setPaymentInfo] = useState({
		method: 'multicaixa',
		paymentProofFile: null,
	});
	const [uploadingProof, setUploadingProof] = useState(false);

	const [errors, setErrors] = useState({});

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

	// Fetch user profile for saved address
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await http.get('/users/profile');
				if (res?.success && res.user?.details?.shippingAddress) {
					setSavedAddress(res.user.details.shippingAddress);
				}
			} catch { } finally {
				setProfileLoaded(true);
			}
		};
		if (user) fetchProfile(); else setProfileLoaded(true);
	}, [user]);

	// Update price when zone changes
	const handleZoneChange = (zoneId) => {
		setSelectedZoneId(zoneId);
		const zone = deliveryZones.find(z => z.id === zoneId);
		setSelectedZonePrice(zone ? Number(zone.price) : 0);
	};

	const getPaymentMethodEnum = (method) => {
		if (method === 'multicaixa') return 'multicaixa_express';
		if (method === 'transfer') return 'transferencia_bancaria';
		return null;
	};

	const handleProofFileSelect = (file) => {
		setPaymentInfo({ ...paymentInfo, paymentProofFile: file });
	};

	const removeProofFile = () => {
		setPaymentInfo({ ...paymentInfo, paymentProofFile: null });
	};

	const validateStep1 = () => {
		const newErrors = {};
		if (deliveryOption === 'delivery') {
			if (!shippingInfo.address.trim()) newErrors.address = 'Endereço é obrigatório';
			if (!selectedZoneId) newErrors.deliveryZone = 'Seleccione uma zona de entrega';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = () => {
		return true;
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
			let paymentProofUrl = '';
			if (paymentInfo.paymentProofFile) {
				setUploadingProof(true);
				const uploadRes = await uploadToCloudinary(paymentInfo.paymentProofFile, 'payment_proofs');
				if (!uploadRes.success) {
					notyf.error(uploadRes.msg || 'Erro ao fazer upload do comprovativo.');
					setUploadingProof(false);
					return;
				}
				paymentProofUrl = uploadRes.url;
				setSubmittedProof(true);
				setUploadingProof(false);
			}

			const payload = {
				items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
				shippingAddress: deliveryOption === 'delivery' ? shippingInfo.address : 'Levantar na Sede',
				couponCode: appliedCoupon?.code,
				deliveryOption,
				paymentMethod: getPaymentMethodEnum(paymentInfo.method),
				paymentProof: paymentProofUrl || undefined,
			};
			if (deliveryOption === 'delivery' && selectedZoneId) {
				payload.deliveryZoneId = selectedZoneId;
			}

			const res = await createOrder(payload);

			if (res?.success) {
				setOrderPlaced(true);
				setOrderId(res?.data?.orderId || '');
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
						{submittedProof ? (
							<p className="text-[#78716C] mb-6">
								O comprovativo de pagamento foi submetido e será analisado em breve. Receberá uma notificação assim que for confirmado.
							</p>
						) : (
							<p className="text-[#78716C] mb-6">
								Faça o pagamento através de <strong>Multicaixa Express</strong> ou <strong>Transferência Bancária</strong> e envie o comprovativo pelo seu painel de cliente.
							</p>
						)}
						<p className="text-xs text-[#78716C] mb-6">
							Acompanhe o estado do pagamento no seu <Link to="/dashboard" className="text-accent hover:underline">painel de cliente</Link>.
						</p>
						<div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6">
							<p className="text-sm text-accent">
								<strong>Número do Pedido:</strong> #{orderId.slice(0, 8).toUpperCase()}
							</p>
						</div>
						{!submittedProof && (
							<Link
								to="/dashboard"
								className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg mb-3"
							>
								Enviar Comprovativo
							</Link>
						)}
						<div>
							<Link
								to="/"
								className="inline-block px-6 py-3 border-2 border-accent/20 text-accent font-display font-semibold rounded-full transition-all duration-300 hover:bg-accent/5"
							>
								Voltar para Home
							</Link>
						</div>
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
										<>
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

											<div className="mb-6">
												<h3 className="text-sm font-semibold text-[#1C1917] mb-3">Morada de Entrega</h3>

												{savedAddress && (
													<div className="mb-3">
														<label className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${shippingInfo.useSavedAddress ? 'border-accent bg-accent/5' : 'border-accent/10'}">
															<input type="radio" checked={shippingInfo.useSavedAddress}
																onChange={() => setShippingInfo({ useSavedAddress: true, address: savedAddress })}
																className="w-4 h-4 accent-accent" />
															<div>
																<p className="text-sm font-display text-[#1C1917]">Usar morada guardada</p>
																<p className="text-xs text-[#78716C]">{savedAddress}</p>
															</div>
														</label>
														<label className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all mt-2 ${!shippingInfo.useSavedAddress ? 'border-accent bg-accent/5' : 'border-accent/10'}">
															<input type="radio" checked={!shippingInfo.useSavedAddress}
																onChange={() => setShippingInfo({ useSavedAddress: false, address: '' })}
																className="w-4 h-4 accent-accent" />
															<div>
																<p className="text-sm font-display text-[#1C1917]">Nova morada</p>
															</div>
														</label>
													</div>
												)}

												<div>
													<label className="block text-sm font-body text-[#78716C] mb-1">Endereço Completo *</label>
													<input type="text" value={shippingInfo.address}
														onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value, useSavedAddress: false })}
														readOnly={shippingInfo.useSavedAddress && !!savedAddress}
														className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-[#1C1917] placeholder:text-[#78716C]/60 font-body ${errors.address ? 'border-red-500' : 'border-accent/20'} ${shippingInfo.useSavedAddress && savedAddress ? 'bg-sand/50 text-[#78716C]' : ''}`}
														placeholder="Rua da Independência, Prédio 123, Apt 4B" />
													{errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
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
							)}

							{currentStep === 2 && (
								<div>
									<h2 className="text-xl font-display text-[#1C1917] mb-6">
										Método de Pagamento
									</h2>

									<div className="space-y-3 mb-6">
										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'multicaixa', paymentProofFile: null })}
											className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentInfo.method === 'multicaixa'
												? 'border-accent bg-accent/5'
												: 'border-accent/10 hover:border-accent/30'
											}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'multicaixa'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'multicaixa', paymentProofFile: null })}
													className="w-4 h-4 accent-accent"
												/>
												<div>
													<p className="font-display text-[#1C1917]">Multicaixa Express</p>
													<p className="text-xs text-[#78716C]">Pagamento via telemóvel</p>
												</div>
											</div>
										</div>

										<div
											onClick={() => setPaymentInfo({ ...paymentInfo, method: 'transfer', paymentProofFile: null })}
											className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentInfo.method === 'transfer'
												? 'border-accent bg-accent/5'
												: 'border-accent/10 hover:border-accent/30'
											}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													checked={paymentInfo.method === 'transfer'}
													onChange={() => setPaymentInfo({ ...paymentInfo, method: 'transfer', paymentProofFile: null })}
													className="w-4 h-4 accent-accent"
												/>
												<div>
													<p className="font-display text-[#1C1917]">Transferência Bancária</p>
													<p className="text-xs text-[#78716C]">Pagamento no Balcão, ATM e Apps de Online Banking</p>
												</div>
											</div>
										</div>
									</div>

									<div className="space-y-4 pt-4 border-t border-accent/10">
										{paymentInfo.method === 'multicaixa' && (
											<div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-4">
												<p className="text-sm text-accent mb-2"><strong>Multicaixa Express</strong></p>
												<p className="text-xs text-[#78716C]">
													Faça o pagamento via Multicaixa Express para o número <strong>+244 923 456 789</strong> (Kusumba).
												</p>
											</div>
										)}

										{paymentInfo.method === 'transfer' && (
											<div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-4">
												<p className="text-sm text-accent mb-2"><strong>Transferência Bancária</strong></p>
												<div className="space-y-1 text-xs text-[#78716C]">
													<p><strong>Banco:</strong> Banco Angolano de Investimentos (BAI)</p>
													<p><strong>Titular:</strong> Kusumba</p>
													<p><strong>IBAN:</strong> AO06 0000 0123 4567 8901 2345 6</p>
												</div>
											</div>
										)}

										<div>
											<label className="block text-sm font-body text-[#78716C] mb-2">
												Comprovativo de Pagamento (opcional)
											</label>
											<p className="text-xs text-[#78716C]/60 mb-2">
												Se já efectuou o pagamento, faça upload do comprovativo. Caso contrário, pode enviar depois pelo seu painel.
											</p>

											{!paymentInfo.paymentProofFile ? (
												<div
													onClick={() => document.getElementById('proof-upload').click()}
													className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-accent hover:bg-accent/5 border-accent/20"
												>
													<input
														id="proof-upload"
														type="file"
														accept="image/*,application/pdf,.pdf"
														className="hidden"
														onChange={(e) => {
															const file = e.target.files?.[0];
															if (file) handleProofFileSelect(file);
														}}
													/>
													<IoCloudUploadOutline className="w-10 h-10 mx-auto mb-2 text-[#78716C]" />
													<p className="text-sm text-[#78716C] font-medium">
														Clique para seleccionar o comprovativo
													</p>
													<p className="text-xs text-[#78716C]/60 mt-1">JPG, PNG, PDF</p>
												</div>
											) : (
												<div className="bg-accent/5 border border-accent/20 rounded-xl p-3 flex items-center gap-3">
													<div className="w-12 h-12 rounded-lg border border-accent/10 flex items-center justify-center bg-white">
														{paymentInfo.paymentProofFile.type === 'application/pdf' ? (
															<IoDocumentOutline className="w-6 h-6 text-red-500" />
														) : (
															<img
																src={URL.createObjectURL(paymentInfo.paymentProofFile)}
																alt="Comprovativo"
																className="w-full h-full object-cover rounded-lg"
															/>
														)}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm text-[#1C1917] font-medium truncate">{paymentInfo.paymentProofFile.name}</p>
														<p className="text-xs text-[#78716C]">Será enviado ao confirmar o pedido</p>
													</div>
													<button onClick={removeProofFile}
														className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0">
														<IoTrashOutline className="w-5 h-5" />
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{currentStep === 3 && (
								<div>
									<h2 className="text-xl font-display text-[#1C1917] mb-6">
										Revisar Pedido
									</h2>

									<div className="mb-6">
										<h3 className="font-display text-[#1C1917] mb-3">Cliente</h3>
										<div className="bg-accent/5 rounded-xl p-4 space-y-1">
											<p className="text-sm text-[#1C1917]">
												<strong>Nome:</strong> {user?.name} {user?.surname}
											</p>
											<p className="text-sm text-[#1C1917]">
												<strong>Email:</strong> {user?.email}
											</p>
											<p className="text-sm text-[#1C1917]">
												<strong>Telefone:</strong> {user?.phone || '—'}
											</p>
										</div>
									</div>

									<div className="mb-6">
										<h3 className="font-display text-[#1C1917] mb-3">Informações de Envio</h3>
										<div className="bg-accent/5 rounded-xl p-4 space-y-1">
											{deliveryOption === 'delivery' ? (
												<>
													<p className="text-sm text-[#1C1917]">
														<strong>Endereço:</strong> {shippingInfo.address}
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
										<div className="bg-accent/5 rounded-xl p-4 space-y-2">
											<p className="text-sm text-[#1C1917]">
												{paymentInfo.method === 'multicaixa' && 'Multicaixa Express'}
												{paymentInfo.method === 'transfer' && 'Transferência Bancária'}
											</p>
											{paymentInfo.paymentProofFile && (
												<p className="text-xs text-green-600">✓ Comprovativo seleccionado (será enviado ao confirmar)</p>
											)}
											{!paymentInfo.paymentProofFile && (
												<p className="text-xs text-[#78716C]">Nenhum comprovativo — pode enviar depois pelo painel.</p>
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
										disabled={creatingOrder || uploadingProof}
										className="flex-1 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-display font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
									>
										{creatingOrder || uploadingProof ? 'A processar...' : 'Finalizar Pedido'}
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