import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { setBuyNowIntent } from '../utils/buyNow';

const useBuyNow = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return (product, quantity = 1) => {
		if (!product?.id) return;

		const checkoutItem = {
			...product,
			name: product.name ?? product.title,
			productId: product.productId ?? product.id,
			store: product.store ?? product.seller ?? null,
			quantity,
		};

		setBuyNowIntent([checkoutItem]);

		if (!isAuthenticated) {
			navigate('/auth');
			return;
		}

		navigate('/checkout');
	};
};

export default useBuyNow;