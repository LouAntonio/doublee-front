import React, { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import { notyf } from '../../utils/notyf';
import { useUpdateProfile } from '../../hooks/queries/useProfile';

const ProfileSettings = () => {
	const user = useAuthStore((s) => s.user);
	const login = useAuthStore((s) => s.login);
	const { mutateAsync: updateProfile, isPending: isLoading } = useUpdateProfile();
	const [formData, setFormData] = useState({
		name: user?.name || '',
		surname: user?.surname || '',
		phone: user?.phone || '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await updateProfile(formData);
			if (data?.success) {
				notyf.success('Perfil atualizado com sucesso!');
				const updatedUser = { ...user, ...formData };
				login(updatedUser);
			}
		} catch {
			notyf.error('Erro ao conectar com o servidor.');
		}
	};

	return (
		<div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
			<h2 className="text-xl font-semibold text-[#1C1917] mb-1 font-display">Informações Pessoais</h2>
			<p className="text-sm text-[#78716C] mb-8 font-body">Actualize os seus dados de identificação e contacto.</p>

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
							className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white"
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
							className="w-full px-4 py-3 rounded-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white"
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
							required
							className="w-full px-4 py-3 rounded-r-xl border border-accent/20 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all bg-white"
							placeholder="9xx xxx xxx"
						/>
					</div>
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
