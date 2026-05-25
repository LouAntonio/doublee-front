import http from './http';

export const uploadToCloudinary = async (file, folder = 'products') => {
	try {
		const res = await http.get('/cloudinary/auth', { admin: true });
		if (!res?.success) throw new Error(res?.msg || 'Erro ao obter autenticação cloudinary');

		const d = res.data;
		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', d.apiKey);
		formData.append('timestamp', d.timestamp);
		formData.append('signature', d.signature);
		formData.append('folder', folder);

		const cloudinaryResponse = await fetch(
			`https://api.cloudinary.com/v1_1/${d.cloudName}/image/upload`,
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
