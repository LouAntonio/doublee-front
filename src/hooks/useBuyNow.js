import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';

const useBuyNow = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const setCheckoutItems = useCartStore((s) => s.setCheckoutItems);

	return (product, quantity = 1) => {
		if (!product?.id) return;

		const checkoutItem = {
			...product,
			productId: product.productId ?? product.id,
			store: product.store ?? product.seller ?? null,
			quantity,
		};

		if (!isAuthenticated) {
			sessionStorage.setItem('kuv_buynow', JSON.stringify(checkoutItem));
			navigate('/auth');
			return;
		}

		setCheckoutItems([checkoutItem]);
		navigate('/checkout');
	};
};

export default useBuyNow;