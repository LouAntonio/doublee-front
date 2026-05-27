import React, { useState, useRef } from 'react';
import useAuthStore from '../../stores/authStore';
import { notyf } from '../../utils/notyf';
import { useUpdateProfile, useUpdateAvatar } from '../../hooks/queries/useProfile';
import { IoCameraOutline } from 'react-icons/io5';
import { API_URL } from '../../services/http';

const ProfileSettings = () => {
	const user = useAuthStore((s) => s.user);
	const login = useAuthStore((s) => s.login);
	const updateUser = useAuthStore((s) => s.updateUser);
	const { mutateAsync: updateProfile, isPending: isLoading } = useUpdateProfile();
	const { mutateAsync: updateAvatar, isPending: isAvatarLoading } = useUpdateAvatar();
	const fileInputRef = useRef(null);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		surname: user?.surname || '',
		phone: user?.phone || '',
		country: user?.country || '',
		province: user?.province || '',
		shippingAddress: user?.shippingAddress || '',
	});
	const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = await updateProfile(formData);
		if (data?.success) {
			const updatedUser = { ...user, ...formData };
			login(updatedUser);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			return notyf.error('A imagem deve ter no máximo 5MB.');
		}

		try {
			// 1. Obter autorização para upload
			const authRes = await fetch(`${API_URL}/cloudinary/authorize-upload?folder=photos`, {
				credentials: 'include',
				headers: { Authorization: `Bearer ${localStorage.getItem('Kusumba_token')}` },
			});
			const authData = await authRes.json();
			if (!authData.success) return notyf.error('Erro ao autorizar upload.');

			// 2. Fazer upload para Cloudinary
			const form = new FormData();
			form.append('file', file);
			form.append('api_key', authData.apikey);
			form.append('timestamp', authData.timestamp);
			form.append('signature', authData.signature);
			form.append('folder', authData.folder);

			const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${authData.cloudname}/image/upload`, {
				method: 'POST',
				body: form,
			});
			const uploadData = await uploadRes.json();
			if (!uploadData.secure_url) return notyf.error('Erro ao fazer upload da imagem.');

			const avatarUrl = uploadData.secure_url;

			// 3. Atualizar avatar no backend
			const data = await updateAvatar(avatarUrl);
			if (data?.success) {
				setAvatarPreview(avatarUrl);
				updateUser({ avatar: avatarUrl });
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		}
	};

	const inputClass = 'w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white';

	return (
		<div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
			<h2 className="text-xl font-semibold text-[#1C1917] mb-1 font-display">Informações Pessoais</h2>
			<p className="text-sm text-[#78716C] mb-8 font-body">Actualize os seus dados de identificação e contacto.</p>

			{/* Avatar */}
			<div className="flex items-center gap-5 mb-8">
				<div className="relative">
					<div
						className="w-20 h-20 rounded-full bg-sand border-2 border-accent/20 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
						onClick={handleAvatarClick}
					>
						{avatarPreview ? (
							<img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
						) : (
							<span className="text-2xl font-bold text-accent">
								{user?.name?.charAt(0)?.toUpperCase() || '?'}
							</span>
						)}
					</div>
					<button
						type="button"
						onClick={handleAvatarClick}
						disabled={isAvatarLoading}
						className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center shadow-md hover:bg-accent-dark transition-colors disabled:opacity-60"
					>
						<IoCameraOutline className="w-4 h-4" />
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleAvatarChange}
						className="hidden"
					/>
				</div>
				<div>
					<p className="text-sm font-semibold text-[#1C1917]">{user?.name} {user?.surname}</p>
					<p className="text-xs text-[#78716C]">Clique na câmera para alterar a foto</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-[#1C1917]">Nome</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className={inputClass}
							placeholder="Ex: João"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-[#1C1917]">Sobrenome</label>
						<input
							type="text"
							name="surname"
							value={formData.surname}
							onChange={handleChange}
							required
							className={inputClass}
							placeholder="Ex: Silva"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-[#1C1917]">Número de Telefone</label>
					<div className="flex">
						<span className="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 border-accent/20 bg-sand text-[#78716C] text-sm font-medium select-none">
                            🇦🇴 +244
						</span>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="w-full px-4 py-3 rounded-r-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white"
							placeholder="9xx xxx xxx"
						/>
					</div>
				</div>

				<hr className="border-accent/10" />

				<h3 className="text-lg font-semibold text-[#1C1917] font-display">Morada</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-[#1C1917]">País</label>
						<input
							type="text"
							name="country"
							value={formData.country}
							onChange={handleChange}
							className={inputClass}
							placeholder="Ex: Angola"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-[#1C1917]">Província</label>
						<input
							type="text"
							name="province"
							value={formData.province}
							onChange={handleChange}
							className={inputClass}
							placeholder="Ex: Luanda"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-[#1C1917]">Endereço de Entrega</label>
					<textarea
						name="shippingAddress"
						value={formData.shippingAddress}
						onChange={handleChange}
						rows={3}
						className={`${inputClass} resize-none`}
						placeholder="Ex: Rua Kwame Nkrumah, nº 123, Bairro Maianga"
					/>
				</div>

				<div className="pt-4">
					<button
						type="submit"
						disabled={isLoading}
						className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-full hover:bg-accent-dark disabled:opacity-60 cursor-pointer transition-all duration-300 shadow-lg shadow-accent/20 hover:-translate-y-0.5"
					>
						{isLoading ? 'A guardar...' : 'Guardar Alterações'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProfileSettings;
