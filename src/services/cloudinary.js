import apiRequest from './api';

export const uploadToCloudinary = async (file, folder = 'products') => {
	try {
		const { data, success, msg } = await apiRequest('/cloudinary/auth', { admin: true });
		if (!success) throw new Error(msg || 'Erro ao obter autenticação cloudinary');

		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', data.apiKey);
		formData.append('timestamp', data.timestamp);
		formData.append('signature', data.signature);
		formData.append('folder', folder);

		const cloudinaryResponse = await fetch(
			`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
			{ method: 'POST', body: formData }
		);

		const cloudinaryData = await cloudinaryResponse.json();
		if (cloudinaryData.secure_url) {
			return { success: true, url: cloudinaryData.secure_url };
		}
		return { success: false, msg: 'Erro ao fazer upload para Cloudinary' };
	} catch (error) {
		return { success: false, msg: error.message || 'Erro ao fazer upload' };
	}
};
