import http from './http';
import { notyf } from '../utils/notyf';

const apiRequest = async (endpoint, options = {}) => {
	try {
		const { method = 'GET', body, headers, admin, ...rest } = options;

		const config = {
			method: method.toLowerCase(),
			data: body,
			headers,
			admin,
			...rest,
		};

		if (body && typeof body === 'string') {
			try {
				config.data = JSON.parse(body);
			} catch {
				config.data = body;
			}
		}

		const response = await http(endpoint, config);

		if (response && typeof response === 'object' && 'success' in response) {
			return response;
		}

		return { success: true, data: response };
	} catch (error) {
		if (error.message === 'Sessão expirada') {
			throw error;
		}
		console.error('Erro na requisição:', error);
		return {
			success: false,
			msg: error.response?.data?.msg || error.message || 'Erro ao comunicar com o servidor',
		};
	}
};

export default apiRequest;
export { API_URL } from './http';
export { notyf };
