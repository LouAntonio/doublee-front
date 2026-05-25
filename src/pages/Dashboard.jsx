import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import useAuthStore from '../stores/authStore';
import { useVerificationStatus, useStoreStatus } from '../hooks/queries/useDashboard';
import ProfileSettings from '../components/dashboard/ProfileSettings';
import AccountSettings from '../components/dashboard/AccountSettings';
import IdentityVerification from '../components/dashboard/IdentityVerification';
import OrderHistory from '../components/dashboard/OrderHistory';
import StoreCreation from '../components/dashboard/StoreCreation';
import StoreDashboard from '../components/dashboard/StoreDashboard';
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
	IoGridOutline,
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
	const { user, logout } = useAuthStore();
	const [activeTab, setActiveTab] = useState('profile');
	const { data: verificationStatus } = useVerificationStatus();
	const { data: storeStatus } = useStoreStatus();

	React.useEffect(() => {
		if (verificationStatus) {
			const storedUser = JSON.parse(localStorage.getItem('Kusumba_user')) || {};
			if (storedUser.verificationStatus !== verificationStatus) {
				localStorage.setItem('Kusumba_user', JSON.stringify({ ...storedUser, verificationStatus }));
			}
		}
	}, [verificationStatus]);

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
			label: storeStatus === 'approved' ? 'Gerir Loja' : 'Criar Loja',
			description: storeStatus === 'approved' ? 'Produtos, encomendas e info da loja' : 'Configure e publique a sua loja',
			icon: storeStatus === 'approved'
				? <IoGridOutline className="w-5 h-5" />
				: <IoStorefrontOutline className="w-5 h-5" />,
			requiresVerification: true,
		},
	], [storeStatus]);

	const renderContent = () => {
		switch (activeTab) {
			case 'profile':      return <ProfileSettings />;
			case 'account':      return <AccountSettings />;
			case 'verification': return <IdentityVerification />;
			case 'orders':       return <OrderHistory />;
			case 'store':        return storeStatus === 'approved'
				? <StoreDashboard />
				: <StoreCreation verificationStatus={verificationStatus} />;
			default:             return <ProfileSettings />;
		}
	};

	const initials = `${user?.name?.charAt(0) || ''}${user?.surname?.charAt(0) || ''}`.toUpperCase() || '?';
	const isVerified = verificationStatus === 'verified';
	const isPending  = verificationStatus === 'pending';

	return (
		<div className="min-h-screen bg-sand flex flex-col">
			<Header />

			<main className="flex-grow">
				{/* Welcome Banner */}
				<div className="relative overflow-hidden bg-white border-b border-accent/10">
					<div className="geo-pattern absolute inset-0 opacity-30" />
					<div className="relative max-w-[1200px] mx-auto px-4 py-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<div>
								<p className="text-sm text-[#78716C] capitalize font-body">{formatDate()}</p>
								<h1 className="text-2xl font-bold text-[#1C1917] mt-0.5 font-display">
									{getGreeting()}, {user?.name || 'Cliente'}
								</h1>
								<p className="text-sm text-[#78716C] mt-1 font-body">
                                    Bem-vindo(a) à sua área pessoal — <span className="text-accent font-semibold">Kusumba Angola</span>
								</p>
							</div>
							{!isVerified && (
								<button
									onClick={() => setActiveTab('verification')}
									className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
										isPending
											? 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
											: 'bg-orange-50 border border-accent/20 text-accent hover:bg-orange-100'
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
							<div className="bg-white rounded-2xl border border-accent/10 shadow-md overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
								<div className="h-16 bg-gradient-to-r from-accent to-accent-dark" />
								<div className="px-5 pb-5 -mt-8">
									<div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow overflow-hidden">
										<img
											src="/images/user.png"
											alt={initials}
											className="w-full h-full object-cover"
											onError={(e) => {
												e.currentTarget.style.display = 'none';
												e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center', 'text-accent', 'text-xl', 'font-bold');
												e.currentTarget.parentElement.insertAdjacentText('beforeend', initials);
											}}
										/>
									</div>
									<h2 className="mt-2 text-base font-semibold text-[#1C1917] leading-tight font-display">
										{user?.name} {user?.surname}
									</h2>
									<p className="text-xs text-[#78716C] truncate font-body">{user?.email}</p>

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
										<span className="text-xs text-[#78716C] bg-sand border border-accent/10 px-2 py-1 rounded-full font-body">Cliente</span>
									</div>
								</div>
							</div>

							{/* Navigation */}
							<nav className="bg-white rounded-2xl border border-accent/10 shadow-md p-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
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
													? 'opacity-50 cursor-not-allowed text-[#78716C]'
													: activeTab === tab.id
														? 'bg-orange-50 text-accent cursor-pointer'
														: 'text-[#78716C] hover:bg-sand cursor-pointer'
											}`}
										>
											<div className="flex items-center gap-3">
												<span className={`p-2 rounded-lg ${
													locked
														? 'bg-sand text-[#78716C]'
														: activeTab === tab.id
															? 'bg-orange-100 text-accent'
															: 'bg-sand text-[#78716C] group-hover:bg-orange-50'
												}`}>
													{tab.icon}
												</span>
												<div>
													<p className="text-sm font-semibold leading-tight font-display">{tab.label}</p>
													<p className="text-xs text-[#78716C] leading-tight mt-0.5 font-body">
														{locked ? 'Requer verificação de identidade' : tab.description}
													</p>
												</div>
											</div>
											{locked
												? <IoLockClosedOutline className="w-4 h-4 shrink-0 text-[#78716C]/50" />
												: <IoChevronForwardOutline className={`w-4 h-4 shrink-0 transition-transform ${activeTab === tab.id ? 'translate-x-0.5 text-accent' : 'text-[#78716C]/50'}`} />
											}
										</button>
									);
								})}

								<div className="border-t border-accent/10 mt-2 pt-2">
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
							<div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-5 text-white text-sm shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
								<p className="font-semibold font-display">Precisa de ajuda?</p>
								<p className="text-orange-200 text-xs mt-1 leading-snug font-body">
                                    A nossa equipa está disponível para o atender!
								</p>
								<NavLink
									to="/contato"
									className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-accent rounded-full text-xs font-semibold hover:bg-orange-50 transition-all duration-300 hover:-translate-y-0.5 shadow-md"
								>
                                    Contactar suporte
									<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</NavLink>
							</div>
						</aside>

						{/* Main Content */}
						<section className="flex-grow min-w-0 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
							<div className="bg-white rounded-2xl border border-accent/10 shadow-md">
								{/* Tab Header */}
								<div className="px-6 py-5 border-b border-accent/10 flex items-center gap-3">
									<span className="p-2 rounded-xl bg-orange-50 text-accent">
										{tabs.find(t => t.id === activeTab)?.icon}
									</span>
									<div>
										<h2 className="text-base font-semibold text-[#1C1917] font-display">{tabs.find(t => t.id === activeTab)?.label}</h2>
										<p className="text-xs text-[#78716C] font-body">{tabs.find(t => t.id === activeTab)?.description}</p>
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
