import http from './http';

export const uploadToCloudinary = async (file, folder = 'products') => {
	try {
		const isAdmin = folder === 'bis' || folder === 'photos';
		const endpoint = isAdmin ? '/cloudinary/authorize-upload-admin' : '/cloudinary/authorize-upload';
		const res = await http.get(`${endpoint}?folder=${folder}`, { admin: isAdmin });
		if (!res?.success) throw new Error(res?.msg || 'Erro ao obter autenticação cloudinary');

		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', res.apikey);
		formData.append('timestamp', res.timestamp);
		formData.append('signature', res.signature);
		formData.append('folder', folder);

		const cloudinaryResponse = await fetch(
			`https://api.cloudinary.com/v1_1/${res.cloudname}/image/upload`,
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
