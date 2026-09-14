import http from '../services/http';

/**
 * Best-effort: elimina do Cloudinary uploads que subiram mas cujo fluxo fracassou
 * (evita ficheiros órfãos em uploads multi-ficheiro). Nunca lança erros.
 */
export const cleanupUploads = async (publicIds) => {
	const ids = (publicIds || []).filter(Boolean);
	if (ids.length === 0) return;
	try {
		await http.post('/cloudinary/delete', { publicIds: ids });
	} catch {
		// best-effort: se falhar, os ficheiros ficam no Cloudinary (não bloqueia o utilizador)
	}
};