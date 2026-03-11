import React, { useState } from 'react';

// ─── Mocked Data ───────────────────────────────────────────────────────────────
const MOCK_REQUESTS = [
	{
		id: '1a2b3c4d-0000-0000-0000-000000000001',
		name: 'Mariana',
		surname: 'Ferreira',
		email: 'mariana.ferreira@example.com',
		phone: '+244 923 456 789',
		seller: true,
		validatedSeller: false,
		createdAt: '2026-02-14T10:30:00Z',
		docs: {
			id: 'doc-001',
			bi: [
				'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
				'https://images.unsplash.com/photo-1569167196395-c7ccd8b5fb92?w=600&q=80',
			],
			pics: [
				'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
			],
		},
	},
	{
		id: '1a2b3c4d-0000-0000-0000-000000000002',
		name: 'Carlos',
		surname: 'António',
		email: 'carlos.antonio@example.com',
		phone: '+244 912 111 222',
		seller: true,
		validatedSeller: false,
		createdAt: '2026-02-20T08:15:00Z',
		docs: {
			id: 'doc-002',
			bi: [
				'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
			],
			pics: [
				'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80',
			],
		},
	},
	{
		id: '1a2b3c4d-0000-0000-0000-000000000003',
		name: 'Beatriz',
		surname: 'Neto',
		email: 'beatriz.neto@example.com',
		phone: '+244 931 333 444',
		seller: true,
		validatedSeller: true,
		createdAt: '2026-01-05T14:00:00Z',
		docs: {
			id: 'doc-003',
			bi: [
				'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
				'https://images.unsplash.com/photo-1569167196395-c7ccd8b5fb92?w=600&q=80',
			],
			pics: [
				'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
			],
		},
	},
	{
		id: '1a2b3c4d-0000-0000-0000-000000000004',
		name: 'Paulo',
		surname: 'Domingos',
		email: 'paulo.domingos@example.com',
		phone: '+244 945 555 666',
		seller: true,
		validatedSeller: false,
		createdAt: '2026-03-01T09:45:00Z',
		docs: null, // No docs submitted yet
	},
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ validated }) => {
	if (validated) {
		return (
			<span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
				<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
				</svg>
                Verificado
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
			<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
            Pendente
		</span>
	);
};

const DocsBadge = ({ hasDocs }) => {
	if (!hasDocs) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-50 text-rose-600 border border-rose-200">
				<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
                Sem Documentos
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
			<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
            Documentos Enviados
		</span>
	);
};

// ─── Image Lightbox ─────────────────────────────────────────────────────────────
const Lightbox = ({ src, onClose }) => {
	if (!src) return null;
	return (
		<div
			className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
			onClick={onClose}
		>
			<div className="relative max-w-3xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors z-10"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<img
					src={src}
					alt="Document preview"
					className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]"
				/>
			</div>
		</div>
	);
};

// ─── Detail Modal ────────────────────────────────────────────────────────────────
const DetailModal = ({ user, onClose, onApprove, onReject }) => {
	const [lightboxSrc, setLightboxSrc] = useState(null);

	if (!user) return null;

	const allImages = [
		...(user.docs?.bi || []).map((src) => ({ src, label: 'BI / Passaporte' })),
		...(user.docs?.pics || []).map((src) => ({ src, label: 'Selfie/Identificação' })),
	];

	return (
		<>
			<Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
				onClick={onClose}
			>
				<div
					className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Modal Header */}
					<div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 flex-shrink-0">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-700 font-bold text-lg flex items-center justify-center shadow-sm border border-indigo-100/50 uppercase">
								{user.name.charAt(0)}
							</div>
							<div>
								<h3 className="text-lg font-bold text-slate-800">{user.name} {user.surname}</h3>
								<p className="text-sm text-slate-500">{user.email}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<StatusBadge validated={user.validatedSeller} />
							<button
								onClick={onClose}
								className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					{/* Modal Body */}
					<div className="overflow-y-auto p-6 space-y-6 custom-scrollbar flex-1">
						{/* User Info */}
						<div className="grid grid-cols-2 gap-4">
							{[
								{ label: 'Telemóvel', value: user.phone },
								{ label: 'Registado em', value: new Date(user.createdAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) },
								{ label: 'Tipo de conta', value: user.seller ? 'Vendedor' : 'Comprador' },
								{ label: 'Verificação', value: user.validatedSeller ? 'Concluída' : 'Aguardando revisão' },
							].map(({ label, value }) => (
								<div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
									<p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
									<p className="text-sm font-bold text-slate-700">{value}</p>
								</div>
							))}
						</div>

						{/* Docs Section */}
						{user.docs ? (
							<>
								{/* BI / Passaporte */}
								{user.docs.bi?.length > 0 && (
									<div>
										<div className="flex items-center gap-2 mb-3">
											<svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
											</svg>
											<h4 className="text-sm font-bold text-slate-700">BI / Passaporte</h4>
											<span className="text-xs text-slate-400 font-medium">{user.docs.bi.length} ficheiro(s)</span>
										</div>
										<div className="grid grid-cols-2 gap-3">
											{user.docs.bi.map((src, i) => (
												<div
													key={i}
													className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in shadow-sm hover:shadow-md transition-shadow"
													onClick={() => setLightboxSrc(src)}
												>
													<img src={src} alt={`BI ${i + 1}`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
														<svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
														</svg>
													</div>
													<div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/50 to-transparent">
														<span className="text-white text-xs font-semibold">Frente/Verso {i + 1}</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Selfie / Foto */}
								{user.docs.pics?.length > 0 && (
									<div>
										<div className="flex items-center gap-2 mb-3">
											<svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											<h4 className="text-sm font-bold text-slate-700">Selfie / Foto de identificação</h4>
											<span className="text-xs text-slate-400 font-medium">{user.docs.pics.length} foto(s)</span>
										</div>
										<div className="grid grid-cols-2 gap-3">
											{user.docs.pics.map((src, i) => (
												<div
													key={i}
													className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in shadow-sm hover:shadow-md transition-shadow"
													onClick={() => setLightboxSrc(src)}
												>
													<img src={src} alt={`Selfie ${i + 1}`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
														<svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
														</svg>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</>
						) : (
							<div className="py-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
								<svg className="w-14 h-14 text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<p className="font-semibold text-slate-500">Nenhum documento submetido</p>
								<p className="text-sm mt-1">O utilizador ainda não enviou os documentos de identificação.</p>
							</div>
						)}
					</div>

					{/* Modal Footer — Actions */}
					{!user.validatedSeller && user.docs && (
						<div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
							<button
								onClick={() => { onReject(user.id); onClose(); }}
								className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
								</svg>
                                Rejeitar
							</button>
							<button
								onClick={() => { onApprove(user.id); onClose(); }}
								className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-500/20"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
								</svg>
                                Aprovar Verificação
							</button>
						</div>
					)}

					{user.validatedSeller && (
						<div className="p-5 border-t border-slate-100 bg-emerald-50/50 flex items-center justify-between flex-shrink-0">
							<div className="flex items-center gap-2 text-emerald-700">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								<span className="text-sm font-bold">Identidade verificada com sucesso</span>
							</div>
							<button
								onClick={() => { onReject(user.id); onClose(); }}
								className="text-xs font-semibold text-slate-500 hover:text-rose-600 underline transition-colors"
							>
                                Revogar verificação
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

// ─── Skeleton ───────────────────────────────────────────────────────────────────
const RowSkeleton = () => (
	<tr className="animate-pulse border-b border-slate-100 last:border-0">
		{[...Array(5)].map((_, i) => (
			<td key={i} className="px-6 py-4">
				<div className="h-4 bg-slate-200 rounded w-full max-w-[120px]" />
			</td>
		))}
	</tr>
);

// ─── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, text }) => (
	<div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 p-5 flex items-center gap-4 transition-all duration-300 relative overflow-hidden`}>
		<div className={`absolute left-0 top-0 bottom-0 w-1.5 ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full`} />
		<div className={`p-3.5 rounded-xl ${bg} ${text} shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
			{icon}
		</div>
		<div>
			<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
			<p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
		</div>
	</div>
);

// ─── Filter Pills ────────────────────────────────────────────────────────────────
const FILTERS = [
	{ key: 'all', label: 'Todos' },
	{ key: 'pending', label: 'Pendentes' },
	{ key: 'verified', label: 'Verificados' },
	{ key: 'no-docs', label: 'Sem Documentos' },
];

// ─── Main Component ──────────────────────────────────────────────────────────────
const AdminIdentityVerification = () => {
	const [requests, setRequests] = useState(MOCK_REQUESTS);
	const [loading] = useState(false);
	const [filter, setFilter] = useState('all');
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [toast, setToast] = useState(null);

	const showToast = (message, type = 'success') => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3500);
	};

	const handleApprove = (userId) => {
		setRequests((prev) =>
			prev.map((u) => (u.id === userId ? { ...u, validatedSeller: true } : u))
		);
		showToast('Vendedor verificado com sucesso!', 'success');
	};

	const handleReject = (userId) => {
		setRequests((prev) =>
			prev.map((u) => (u.id === userId ? { ...u, validatedSeller: false } : u))
		);
		showToast('Verificação revogada.', 'warning');
	};

	const filtered = requests.filter((u) => {
		const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && !u.validatedSeller) ||
            (filter === 'verified' && u.validatedSeller) ||
            (filter === 'no-docs' && !u.docs);

		const q = search.toLowerCase();
		const matchesSearch =
            !q ||
            u.name.toLowerCase().includes(q) ||
            u.surname.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.toLowerCase().includes(q);

		return matchesFilter && matchesSearch;
	});

	const totalPending = requests.filter((u) => !u.validatedSeller).length;
	const totalVerified = requests.filter((u) => u.validatedSeller).length;
	const totalNoDocs = requests.filter((u) => !u.docs).length;

	return (
		<>
			{/* Toast Notification */}
			{toast && (
				<div
					className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold animate-slide-in-right transition-all ${toast.type === 'success'
						? 'bg-emerald-50 text-emerald-700 border-emerald-200'
						: 'bg-amber-50 text-amber-700 border-amber-200'
					}`}
				>
					{toast.type === 'success' ? (
						<svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
					) : (
						<svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					)}
					{toast.message}
				</div>
			)}

			<DetailModal
				user={selectedUser}
				onClose={() => setSelectedUser(null)}
				onApprove={handleApprove}
				onReject={handleReject}
			/>

			<div className="space-y-6 animate-fade-in-up">
				{/* Page Header */}
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
								<span className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</span>
                                Verificação de Identidade
							</h2>
							<p className="text-sm text-slate-500 mt-1 ml-11.5">
                                Reveja e aprove os pedidos de verificação de identidade de vendedores.
							</p>
						</div>

						{/* Search */}
						<div className="flex w-full sm:w-auto">
							<div className="relative w-full sm:w-72">
								<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
								<input
									type="text"
									placeholder="Buscar vendedor..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					<StatCard
						label="Pedidos Pendentes"
						value={totalPending}
						color="bg-gradient-to-b from-amber-400 to-orange-500"
						bg="bg-amber-50"
						text="text-amber-600"
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						}
					/>
					<StatCard
						label="Vendedores Verificados"
						value={totalVerified}
						color="bg-gradient-to-b from-emerald-400 to-teal-500"
						bg="bg-emerald-50"
						text="text-emerald-600"
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						}
					/>
					<StatCard
						label="Sem Documentos"
						value={totalNoDocs}
						color="bg-gradient-to-b from-rose-400 to-pink-500"
						bg="bg-rose-50"
						text="text-rose-600"
						icon={
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						}
					/>
				</div>

				{/* Table Card */}
				<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
					{/* Filter Pills */}
					<div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
						{FILTERS.map((f) => (
							<button
								key={f.key}
								onClick={() => setFilter(f.key)}
								className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filter === f.key
									? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
									: 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
								}`}
							>
								{f.label}
								{f.key !== 'all' && (
									<span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.key ? 'bg-white/20' : 'bg-white'}`}>
										{f.key === 'pending' ? totalPending : f.key === 'verified' ? totalVerified : totalNoDocs}
									</span>
								)}
							</button>
						))}
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-slate-50/80 border-b border-slate-100">
									<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vendedor</th>
									<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
									<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documentos</th>
									<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
									<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Pedido</th>
									<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-slate-100">
								{loading ? (
									Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
								) : filtered.length > 0 ? (
									filtered.map((user) => (
										<tr
											key={user.id}
											className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
											onClick={() => setSelectedUser(user)}
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold flex items-center justify-center uppercase shadow-sm border border-indigo-100/50 flex-shrink-0">
														{user.name.charAt(0)}
													</div>
													<div>
														<div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
															{user.name} {user.surname}
														</div>
														<div className="text-xs text-slate-500 font-medium mt-0.5">ID: {user.id.slice(0, 8)}…</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-slate-700">{user.email}</div>
												<div className="text-xs text-slate-500 mt-0.5">{user.phone}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<DocsBadge hasDocs={!!user.docs} />
												{user.docs && (
													<div className="text-xs text-slate-400 mt-1">
														{user.docs.bi?.length || 0} BI · {user.docs.pics?.length || 0} selfie(s)
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<StatusBadge validated={user.validatedSeller} />
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
												{new Date(user.createdAt).toLocaleDateString('pt-PT')}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
												<div className="flex justify-end gap-2">
													<button
														onClick={() => setSelectedUser(user)}
														className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent transition-all shadow-sm"
													>
                                                        Ver Docs
													</button>
													{!user.validatedSeller && user.docs && (
														<button
															onClick={() => handleApprove(user.id)}
															className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-transparent transition-all shadow-sm"
														>
                                                            Aprovar
														</button>
													)}
													{user.validatedSeller && (
														<button
															onClick={() => handleReject(user.id)}
															className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-transparent transition-all shadow-sm"
														>
                                                            Revogar
														</button>
													)}
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6" className="px-6 py-16 text-center">
											<div className="flex flex-col items-center text-slate-400">
												<svg className="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
												</svg>
												<p className="font-semibold text-slate-600">Nenhum pedido encontrado.</p>
												<p className="text-sm mt-1">Tente mudar o filtro ou limpar a pesquisa.</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<style dangerouslySetInnerHTML={{
				__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.35s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.4); border-radius: 20px; }
      `}} />
		</>
	);
};

export default AdminIdentityVerification;
