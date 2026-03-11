import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Instância do Notyf para notificações
const notyf = new Notyf({
	duration: 4000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

// URL da API
const isProd = import.meta.env.VITE_PROD === 'true' || import.meta.env.PROD;
const API_URL = isProd
	? 'https://doublee-back-production.up.railway.app'
	: 'http://localhost:20262';

/**
 * Faz logout do usuário limpando o localStorage e redirecionando para login
 */
const handleSessionExpired = () => {
	// Limpar dados do localStorage
	localStorage.removeItem('doublee_user');
	localStorage.removeItem('doublee_token');

	// Mostrar notificação
	notyf.error('Sua sessão expirou. Por favor, faça login novamente.');

	// Redirecionar para página de login
	// Pequeno delay para garantir que a notificação seja exibida
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

const handleAdminSessionExpired = () => {
	// Limpar dados de admin do localStorage
	localStorage.removeItem('doublee_admin_token');
	localStorage.removeItem('doublee_admin');

	// Mostrar notificação
	notyf.error('Sessão de administrador expirada. Por favor, faça login novamente.');

	// Redirecionar para página de login admin
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

/**
 * Função principal para fazer requisições HTTP
 * @param {string} endpoint - Endpoint da API (ex: '/users/profile')
 * @param {object} options - Opções do fetch (method, body, headers, etc.)
 * @returns {Promise<object>} - Resposta da API
 */
const apiRequest = async (endpoint, options = {}) => {
	try {
		// Configurar headers padrão
		const headers = {
			...options.headers,
		};

		const tokenKey = options.admin ? 'doublee_admin_token' : 'doublee_token';
		const token = localStorage.getItem(tokenKey);
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		// Adicionar Content-Type apenas se não for FormData
		if (!(options.body instanceof FormData) && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		// Fazer a requisição
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers,
			credentials: 'include',
		});

		// Tentar parsear a resposta como JSON
		let data;
		try {
			data = await response.json();
		} catch (error) {
			// Se não for JSON, retornar um objeto de erro
			throw new Error(`Erro ao processar resposta do servidor: ${error}`);
		}

		// Verificar se é um erro de autenticação (sessão expirada)
		if (data.success === false && data.auth === true) {
			if (options.admin) {
				handleAdminSessionExpired();
			} else {
				handleSessionExpired();
			}
			// Retornar um erro para evitar processamento adicional
			throw new Error('Sessão expirada');
		}

		// Retornar os dados
		return data;
	} catch (error) {
		// Se for erro de sessão expirada, apenas propagar
		if (error.message === 'Sessão expirada') {
			throw error;
		}

		// Para outros erros, retornar objeto padronizado
		console.error('Erro na requisição:', error);
		return {
			success: false,
			msg: error.message || 'Erro ao comunicar com o servidor',
		};
	}
};

export default apiRequest;
export { API_URL, notyf };
