import React, { useState, useMemo, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import apiRequest from '../services/api';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import AccountSettings from '../components/dashboard/AccountSettings';
import IdentityVerification from '../components/dashboard/IdentityVerification';
import OrderHistory from '../components/dashboard/OrderHistory';
import StoreCreation from '../components/dashboard/StoreCreation';
import {
	IoPersonOutline,
	IoLockClosedOutline,
	IoShieldCheckmarkOutline,
	IoBagHandleOutline,
	IoExitOutline,
	IoChevronForwardOutline,
	IoTimeOutline,
	IoAlertCircleOutline,
	IoStorefrontOutline,
} from 'react-icons/io5';

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Bom dia';
	if (hour < 18) return 'Boa tarde';
	return 'Boa noite';
};

const formatDate = () => {
	return new Date().toLocaleDateString('pt-AO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
};

const Dashboard = () => {
	const { user, logout } = useAuth();
	const [activeTab, setActiveTab] = useState('profile');
	// status: 'none' | 'pending' | 'verified'
	const [verificationStatus, setVerificationStatus] = useState(null);

	useEffect(() => {
		const fetchVerificationStatus = async () => {
			try {
				const data = await apiRequest('/users/verification-status', { method: 'GET' });
				if (data.success) setVerificationStatus(data.status);
				// armazenar no localstorage doublee_user
				const storedUser = JSON.parse(localStorage.getItem('doublee_user')) || {};
				localStorage.setItem('doublee_user', JSON.stringify({ ...storedUser, verificationStatus: data.status }));
			} catch (error) {
				console.error('Fetch verification status error:', error);
				// silencioso — o badge simplesmente não aparece
			}
		};
		fetchVerificationStatus();
	}, []);

	const tabs = useMemo(() => [
		{
			id: 'profile',
			label: 'Meu Perfil',
			description: 'Dados pessoais e contacto',
			icon: <IoPersonOutline className="w-5 h-5" />,
		},
		{
			id: 'account',
			label: 'Segurança',
			description: 'Email e palavra-passe',
			icon: <IoLockClosedOutline className="w-5 h-5" />,
		},
		{
			id: 'verification',
			label: 'Verificação de Identidade',
			description: 'Documentos e validação',
			icon: <IoShieldCheckmarkOutline className="w-5 h-5" />,
		},
		{
			id: 'orders',
			label: 'Histórico de Compras',
			description: 'Pedidos e encomendas',
			icon: <IoBagHandleOutline className="w-5 h-5" />,
		},
		{
			id: 'store',
			label: 'Criar Loja',
			description: 'Configure e publique a sua loja',
			icon: <IoStorefrontOutline className="w-5 h-5" />,
			requiresVerification: true,
		},
	], []);

	const renderContent = () => {
		switch (activeTab) {
			case 'profile':      return <ProfileSettings />;
			case 'account':      return <AccountSettings />;
			case 'verification': return <IdentityVerification />;
			case 'orders':       return <OrderHistory />;
			case 'store':        return <StoreCreation verificationStatus={verificationStatus} />;
			default:             return <ProfileSettings />;
		}
	};

	const initials = `${user?.name?.charAt(0) || ''}${user?.surname?.charAt(0) || ''}`.toUpperCase() || '?';
	const isVerified = verificationStatus === 'verified';
	const isPending  = verificationStatus === 'pending';

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			<main className="flex-grow">
				{/* Welcome Banner */}
				<div className="bg-white border-b border-gray-100">
					<div className="max-w-[1200px] mx-auto px-4 py-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<div>
								<p className="text-sm text-gray-400 capitalize">{formatDate()}</p>
								<h1 className="text-2xl font-bold text-gray-900 mt-0.5">
									{getGreeting()}, {user?.name || 'Cliente'}
								</h1>
								<p className="text-sm text-gray-500 mt-1">
                                    Bem-vindo(a) à sua área pessoal - <span className="text-primary-600 font-medium">Double E Angola</span>
								</p>
							</div>
							{!isVerified && (
								<button
									onClick={() => setActiveTab('verification')}
									className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
										isPending
											? 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
											: 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
									}`}
								>
									<IoAlertCircleOutline className="w-4 h-4 shrink-0" />
									{isPending ? 'Verificação em análise' : 'Verifique a sua identidade'}
								</button>
							)}
						</div>
					</div>
				</div>

				<div className="max-w-[1200px] mx-auto px-4 py-8">
					<div className="flex flex-col lg:flex-row gap-6">

						{/* Sidebar */}
						<aside className="w-full lg:w-72 shrink-0 space-y-4">

							{/* Profile Card */}
							<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
								<div className="h-16 bg-gradient-to-r from-primary-600 to-primary-500" />
								<div className="px-5 pb-5 -mt-8">
									<div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow overflow-hidden">
										<img
											src="/images/user.png"
											alt={initials}
											className="w-full h-full object-cover"
											onError={(e) => {
												e.currentTarget.style.display = 'none';
												e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center', 'text-primary-700', 'text-xl', 'font-bold');
												e.currentTarget.parentElement.insertAdjacentText('beforeend', initials);
											}}
										/>
									</div>
									<h2 className="mt-2 text-base font-semibold text-gray-900 leading-tight">
										{user?.name} {user?.surname}
									</h2>
									<p className="text-xs text-gray-400 truncate">{user?.email}</p>

									<div className="mt-3 flex items-center gap-1.5">
										{isVerified ? (
											<span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-medium">
												<IoShieldCheckmarkOutline className="w-3.5 h-3.5" /> Verificado
											</span>
										) : isPending ? (
											<span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full font-medium">
												<IoTimeOutline className="w-3.5 h-3.5" /> Em análise
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-full font-medium">
												<IoTimeOutline className="w-3.5 h-3.5" /> Não verificado
											</span>
										)}
										<span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">Cliente</span>
									</div>
								</div>
							</div>

							{/* Navigation */}
							<nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
								{tabs.map((tab) => {
									const locked = tab.requiresVerification && !isVerified;
									return (
										<button
											key={tab.id}
											onClick={() => !locked && setActiveTab(tab.id)}
											disabled={locked}
											title={locked ? 'Verifique a sua identidade para aceder' : undefined}
											className={`w-full group flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left transition-all ${
												locked
													? 'opacity-50 cursor-not-allowed text-gray-400'
													: activeTab === tab.id
														? 'bg-primary-50 text-primary-700 cursor-pointer'
														: 'text-gray-600 hover:bg-gray-50 cursor-pointer'
											}`}
										>
											<div className="flex items-center gap-3">
												<span className={`p-2 rounded-lg ${
													locked
														? 'bg-gray-100 text-gray-400'
														: activeTab === tab.id
															? 'bg-primary-100 text-primary-700'
															: 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
												}`}>
													{tab.icon}
												</span>
												<div>
													<p className="text-sm font-medium leading-tight">{tab.label}</p>
													<p className="text-xs text-gray-400 leading-tight mt-0.5">
														{locked ? 'Requer verificação de identidade' : tab.description}
													</p>
												</div>
											</div>
											{locked
												? <IoLockClosedOutline className="w-4 h-4 shrink-0 text-gray-300" />
												: <IoChevronForwardOutline className={`w-4 h-4 shrink-0 transition-transform ${activeTab === tab.id ? 'translate-x-0.5 text-primary-500' : 'text-gray-300'}`} />
											}
										</button>
									);
								})}

								<div className="border-t border-gray-100 mt-2 pt-2">
									<button
										onClick={logout}
										className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
									>
										<span className="p-2 rounded-lg bg-red-50 text-red-400">
											<IoExitOutline className="w-5 h-5" />
										</span>
                                        Terminar sessão
									</button>
								</div>
							</nav>

							{/* Help Card */}
							<div className="bg-primary-600 rounded-2xl p-4 text-white text-sm">
								<p className="font-semibold">Precisa de ajuda?</p>
								<p className="text-primary-200 text-xs mt-1 leading-snug">
                                    A nossa equipa está disponível para o atender!
								</p>
								<NavLink
									to="/contato"
									className="mt-3 inline-block px-3 py-1.5 bg-white text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-50 transition-colors"
								>
                                    Contactar suporte
								</NavLink>
							</div>
						</aside>

						{/* Main Content */}
						<section className="flex-grow min-w-0">
							<div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
								{/* Tab Header */}
								<div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
									<span className="p-2 rounded-xl bg-primary-50 text-primary-600">
										{tabs.find(t => t.id === activeTab)?.icon}
									</span>
									<div>
										<h2 className="text-base font-semibold text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
										<p className="text-xs text-gray-400">{tabs.find(t => t.id === activeTab)?.description}</p>
									</div>
								</div>

								{/* Tab Body */}
								<div className="p-6">
									{renderContent()}
								</div>
							</div>
						</section>

					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
