import React, { useState, useEffect, useCallback } from 'react';
import apiRequest, { notyf } from '../../services/api';

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ user, onClose, onApprove, onReject, initialActionMode }) => {
	const [lightboxSrc, setLightboxSrc] = useState(null);
	const [actionMode, setActionMode] = useState(initialActionMode || null);
	const [reason, setReason] = useState('');


	if (!user) return null;
	const docs = user.docs || null;

	return (
		<>
			{/* Lightbox */}
			{lightboxSrc && (
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
					onClick={() => setLightboxSrc(null)}
				>
					<div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
						<button
							onClick={() => setLightboxSrc(null)}
							className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors z-10"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<img src={lightboxSrc} alt="Documento" className="w-full rounded-2xl shadow-2xl object-contain max-h-[80vh]" />
					</div>
				</div>
			)}

			{/* Modal backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 "
				onClick={onClose}
			>
				<div
					className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 flex-shrink-0">
						<div className="flex items-center gap-4">
							<div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-lg flex items-center justify-center uppercase shadow-sm border border-indigo-200/50">
								{user.name.charAt(0)}
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-800">{user.name} {user.surname}</h3>
								<p className="text-sm text-slate-500">{user.email}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							{user.validatedSeller ? (
								<span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
									<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
									Verificado
								</span>
							) : (
								<span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
									Pendente
								</span>
							)}
							<button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					{/* Body */}
					{actionMode ? (
						<div className="p-6 flex-1 flex flex-col">
							<h4 className="text-base font-bold text-slate-800 mb-4">
								{actionMode === 'reject' ? 'Rejeitar Candidatura' : 'Revogar Verificação'}
							</h4>
							{actionMode === 'reject' && (
								<div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
									<svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
									<p className="text-sm">
										<strong>Atenção:</strong> Ao rejeitar, todos os documentos enviados pelo utilizador serão <strong>permanentemente eliminados</strong> da plataforma.
									</p>
								</div>
							)}
							<label className="block text-sm font-semibold text-slate-700 mb-2">
								Motivo da {actionMode === 'reject' ? 'rejeição' : 'revogação'} (enviado por email ao utilizador)
							</label>
							<textarea
								className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 outline-none transition-all resize-none min-h-[120px]"
								placeholder="Especifique o motivo..."
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								autoFocus
							/>
						</div>
					) : (
						<div className="overflow-y-auto p-6 space-y-6 flex-1">
							{/* Info grid */}
							<div className="grid grid-cols-2 gap-3">
								{[
									{ label: 'Telemóvel', value: user.phone || 'Sem telefone' },
									{ label: 'Registado em', value: user.createdAt && !isNaN(new Date(user.createdAt).getTime()) ? new Date(user.createdAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Data não disponível' },
									{ label: 'Tipo de conta', value: user.seller ? 'Vendedor' : 'Comprador' },
									{ label: 'Verificação', value: user.validatedSeller ? 'Concluída' : 'Aguardando revisão' },
								].map(({ label, value }) => (
									<div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
										<p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
										<p className="text-sm font-bold text-slate-700">{value}</p>
									</div>
								))}
							</div>

							{/* Documentos */}
							{docs ? (
								<>
									{docs.bi?.length > 0 && (
										<div>
											<div className="flex items-center gap-2 mb-3">
												<svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
												<h4 className="text-sm font-bold text-slate-700">BI / Passaporte</h4>
												<span className="text-xs text-slate-400 font-medium">{docs.bi.length} ficheiro(s)</span>
											</div>
											<div className="grid grid-cols-2 gap-3">
												{docs.bi.map((src, i) => (
													<div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in shadow-sm hover:shadow-md transition-shadow" onClick={() => setLightboxSrc(src)}>
														<img src={src} alt={`BI ${i + 1}`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
														<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
															<svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
														</div>
														<div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/50 to-transparent">
															<span className="text-white text-xs font-semibold">Frente/Verso {i + 1}</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
									{docs.pics?.length > 0 && (
										<div>
											<div className="flex items-center gap-2 mb-3">
												<svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
												<h4 className="text-sm font-bold text-slate-700">Selfie / Foto de identificação</h4>
												<span className="text-xs text-slate-400 font-medium">{docs.pics.length} foto(s)</span>
											</div>
											<div className="grid grid-cols-2 gap-3">
												{docs.pics.map((src, i) => (
													<div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in shadow-sm hover:shadow-md transition-shadow" onClick={() => setLightboxSrc(src)}>
														<img src={src} alt={`Selfie ${i + 1}`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
														<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
															<svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</>
							) : (
								<div className="py-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
									<svg className="w-12 h-12 text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
									<p className="font-semibold text-slate-500">Nenhum documento submetido</p>
									<p className="text-sm mt-1">O utilizador ainda não enviou os documentos de identificação.</p>
								</div>
							)}
						</div>
					)}

					{/* Footer */}
					{actionMode ? (
						<div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
							<button
								onClick={() => setActionMode(null)}
								className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={() => { if (reason.trim()) { onReject(user.id, reason); onClose(); } }}
								disabled={!reason.trim()}
								className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Confirmar {actionMode === 'reject' ? 'Rejeição' : 'Revogação'}
							</button>
						</div>
					) : (
						<>
							{!user.validatedSeller && docs && (
								<div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
									<button
										onClick={() => setActionMode('reject')}
										className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
										Rejeitar
									</button>
									<button
										onClick={() => { onApprove(user.id); onClose(); }}
										className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
										Aprovar Verificação
									</button>
								</div>
							)}
							{user.validatedSeller && (
								<div className="p-5 border-t border-slate-100 bg-emerald-50/50 flex items-center justify-between flex-shrink-0">
									<div className="flex items-center gap-2 text-emerald-700">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
										<span className="text-sm font-bold">Identidade verificada com sucesso</span>
									</div>
									<button
										onClick={() => setActionMode('revoke')}
										className="text-xs font-semibold text-slate-500 hover:text-rose-600 underline transition-colors cursor-pointer"
									>
										Revogar verificação
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const RowSkeleton = () => (
	<tr className="animate-pulse border-b border-slate-100 last:border-0">
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-slate-200"></div>
				<div className="space-y-2">
					<div className="h-4 bg-slate-200 rounded w-32"></div>
					<div className="h-3 bg-slate-100 rounded w-24"></div>
				</div>
			</div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap">
			<div className="space-y-2">
				<div className="h-4 bg-slate-200 rounded w-40"></div>
				<div className="h-3 bg-slate-100 rounded w-28"></div>
			</div>
		</td>
		<td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-24 bg-slate-200 rounded-full"></div></td>
		<td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-20 bg-slate-200 rounded-full"></div></td>
		<td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
		<td className="px-6 py-4 whitespace-nowrap text-right">
			<div className="flex justify-end gap-2">
				<div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
				<div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
			</div>
		</td>
	</tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminIdentityVerification = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all');
	const [search, setSearch] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [modalMode, setModalMode] = useState(null);

	const fetchSellers = useCallback(async () => {
		setLoading(true);
		try {
			const data = await apiRequest('/admin/unverified-sellers', { admin: true });
			if (data.success) {
				setRequests(data.sellers || []);
			} else {
				notyf.error(data.msg || 'Erro ao carregar vendedores.');
			}
		} catch {
			notyf.error('Erro ao comunicar com o servidor.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { fetchSellers(); }, [fetchSellers]);

	const handleApprove = async (userId) => {
		try {
			const data = await apiRequest('/admin/approve-seller', {
				method: 'POST',
				body: JSON.stringify({ sellerId: userId, approve: true }),
				admin: true,
			});
			if (data.success) {
				notyf.success('Vendedor verificado com sucesso!');
				await fetchSellers();
			} else {
				notyf.error(data.msg || 'Erro ao aprovar vendedor.');
			}
		} catch {
			notyf.error('Erro ao comunicar com o servidor.');
		}
	};

	const handleReject = async (userId, message) => {
		const seller = requests.find((u) => u.id === userId);
		const endpoint = seller?.validatedSeller ? '/admin/revoke-seller' : '/admin/approve-seller';
		const body = seller?.validatedSeller
			? { sellerId: userId, message }
			: { sellerId: userId, approve: false, message };
		try {
			const data = await apiRequest(endpoint, {
				method: 'POST',
				body: JSON.stringify(body),
				admin: true,
			});
			if (data.success) {
				notyf.success(seller?.validatedSeller ? 'Verificação revogada.' : 'Candidatura rejeitada.');
				await fetchSellers();
			} else {
				notyf.error(data.msg || 'Erro ao processar ação.');
			}
		} catch {
			notyf.error('Erro ao comunicar com o servidor.');
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setSearch(searchInput);
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
			u.email.toLowerCase().includes(q);
		return matchesFilter && matchesSearch;
	});

	const totalPending = requests.filter((u) => !u.validatedSeller).length;
	const totalVerified = requests.filter((u) => u.validatedSeller).length;
	const totalNoDocs = requests.filter((u) => !u.docs).length;

	const FILTERS = [
		{ key: 'all', label: 'Todos', count: null },
		{ key: 'pending', label: 'Pendentes', count: totalPending },
		{ key: 'verified', label: 'Verificados', count: totalVerified },
		{ key: 'no-docs', label: 'Sem Documentos', count: totalNoDocs },
	];

	return (
		<div className="space-y-6 animate-fade-in-up">
			<DetailModal
				key={`${selectedUser?.id || 'none'}-${modalMode || 'none'}`}
				user={selectedUser}
				onClose={() => { setSelectedUser(null); setModalMode(null); }}
				onApprove={handleApprove}
				onReject={handleReject}
				initialActionMode={modalMode}
			/>

			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
				<div>
					<h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
						<svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
						Verificação de Identidade
					</h2>
					<p className="text-sm text-slate-500 mt-1">Reveja e aprove os pedidos de verificação de identidade de vendedores.</p>
				</div>
				<form onSubmit={handleSearch} className="flex w-full sm:w-auto relative group">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
					</div>
					<input
						type="text"
						placeholder="Buscar vendedor..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-l-xl border border-slate-200 bg-slate-50 text-sm transition-all outline-none"
					/>
					<button type="submit" className="px-5 py-2.5 border border-transparent text-sm font-semibold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm">
						Buscar
					</button>
				</form>
			</div>

			{/* Table Card */}
			<div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
				{/* Filter Pills */}
				<div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
					{FILTERS.map((f) => (
						<button
							key={f.key}
							onClick={() => setFilter(f.key)}
							className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filter === f.key
								? 'bg-slate-800 text-white border-slate-800 shadow-sm'
								: 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
							}`}
						>
							{f.label}
							{f.count !== null && (
								<span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.key ? 'bg-white/20' : 'bg-white border border-slate-200'}`}>
									{f.count}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-100">
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vendedor</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documentos</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registo</th>
								<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações de Gestão</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-slate-100">
							{loading ? (
								<>
									<RowSkeleton /><RowSkeleton /><RowSkeleton /><RowSkeleton /><RowSkeleton />
								</>
							) : filtered.length > 0 ? (
								filtered.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-slate-50/80 transition-colors group "
										onClick={() => setSelectedUser(user)}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold flex items-center justify-center uppercase shadow-sm border border-indigo-200/50 flex-shrink-0">
													{user.name.charAt(0)}
												</div>
												<div>
													<div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{user.name} {user.surname}</div>
													<div className="text-xs text-slate-500 font-medium mt-0.5">ID: {user.id.slice(0, 8)}…</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-slate-700">{user.email}</div>
											<div className="text-xs text-slate-500 mt-0.5">{user.phone || 'Sem telefone'}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{user.docs ? (
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
													<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
													{user.docs.bi?.length || 0} BI · {user.docs.pics?.length || 0} selfie(s)
												</span>
											) : (
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md bg-rose-50 text-rose-600 border border-rose-200">
													<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
													Sem Documentos
												</span>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-2">
												<span className={`w-2 h-2 rounded-full ${user.validatedSeller ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
												<span className={`text-sm font-bold ${user.validatedSeller ? 'text-emerald-700' : 'text-amber-700'}`}>
													{user.validatedSeller ? 'Verificado' : 'Pendente'}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
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
														onClick={(e) => { e.stopPropagation(); setSelectedUser(user); setModalMode('revoke'); }}
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
										<div className="flex flex-col items-center justify-center text-slate-400">
											<svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
											<p className="text-base font-semibold text-slate-600">Nenhum pedido encontrado.</p>
											<p className="text-sm mt-1">Tente ajustar o filtro ou limpar a pesquisa.</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<style dangerouslySetInnerHTML={{
				__html: `
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
				`}} />
		</div>
	);
};

export default AdminIdentityVerification;
