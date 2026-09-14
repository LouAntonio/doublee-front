import React, { useState } from 'react';
import { cloudinaryUrl, rawCloudinaryUrl } from '../../utils/cloudinaryUrl';

/**
 * <img> com entrega optimizada do Cloudinary (f_auto/q_auto + tamanho).
 * Cadeia de fallback em erro: URL optimizado → URL cru → imagem local.
 */
const OptimizedImage = ({
	src,
	w,
	h,
	fit = 'fill',
	fallback = '/images/produto.png',
	...props
}) => {
	const [state, setState] = useState({ src, stage: 0 });

	if (state.src !== src) {
		setState({ src, stage: 0 });
	}

	const rawUrl = rawCloudinaryUrl(src);
	const optimizedUrl = cloudinaryUrl(src, { w, h, fit });

	let display = optimizedUrl || rawUrl;
	if (state.stage === 1) display = rawUrl;
	else if (state.stage === 2) display = fallback;

	const handleError = () => {
		setState(s => (s.stage < 2 ? { ...s, stage: s.stage + 1 } : s));
	};

	return <img src={display} onError={handleError} {...props} />;
};

export default OptimizedImage;