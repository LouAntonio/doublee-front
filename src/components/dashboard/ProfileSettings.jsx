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
		<div>
			<h2 className="text-xl font-semibold text-gray-900 mb-1">Informações Pessoais</h2>
			<p className="text-sm text-gray-400 mb-8">Actualize os seus dados de identificação e contacto.</p>

			<form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Nome</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
							placeholder="Ex: João"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Sobrenome</label>
						<input
							type="text"
							name="surname"
							value={formData.surname}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
							placeholder="Ex: Silva"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Número de Telefone</label>
					<div className="flex">
						<span className="inline-flex items-center px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium select-none">
                            🇦🇴 +244
						</span>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:outline-none focus:ring-0 transition-all"
							placeholder="9xx xxx xxx"
						/>
					</div>
				</div>

				<div className="pt-4">
					<button
						type="submit"
						disabled={isLoading}
						className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-60 cursor-pointer transition-all"
					>
						{isLoading ? 'A guardar...' : 'Guardar Alterações'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProfileSettings;
