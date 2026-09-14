const CLOUDINARY_SEGMENT = '/image/upload/';

/**
 * Devolve uma URL do Cloudinary com transformações de entrega
 * (f_auto/q_auto separados por barra + tamanho/crop) para servir variantes
 * optimizadas a partir do mesmo public_id. URLs fora do Cloudinary passam como estão.
 */
export const cloudinaryUrl = (url, { w, h, fit = 'fill', q = 'auto' } = {}) => {
	if (!url || typeof url !== 'string' || !url.includes(CLOUDINARY_SEGMENT)) return url;

	const index = url.indexOf(CLOUDINARY_SEGMENT);
	const before = url.slice(0, index);
	const after = url.slice(index + CLOUDINARY_SEGMENT.length);

	const parts = [];
	parts.push('f_auto');
	parts.push(`q_${q}`);
	const size = [];
	if (w) size.push(`w_${w}`);
	if (h) size.push(`h_${h}`);
	if (w || h) size.push(fit === 'contain' ? 'c_scale' : 'c_fill');
	if (size.length > 0) parts.push(size.join(','));

	return `${before}${CLOUDINARY_SEGMENT}${parts.join('/')}/${after}`;
};

/**
 * URL cru (sem transformações) a partir de uma URL do Cloudinary, para fallback
 * quando a versão optimizada não puder ser gerada.
 */
export const rawCloudinaryUrl = (url) => {
	if (!url || typeof url !== 'string' || !url.includes(CLOUDINARY_SEGMENT)) return url;
	const index = url.indexOf(CLOUDINARY_SEGMENT);
	return `${url.slice(0, index)}${CLOUDINARY_SEGMENT}${url.slice(index + CLOUDINARY_SEGMENT.length)}`;
};