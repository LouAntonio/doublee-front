import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import useCartStore from './stores/cartStore';
import useWishlistStore from './stores/wishlistStore';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import CategoryProducts from './pages/CategoryProducts';
import Cupoes from './pages/Cupoes';
import Auth from './pages/Auth';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import Footer from '../src/components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Promocoes from './pages/Promocoes';
import Produtos from './pages/Produtos';
import Lojas from './pages/lojas';
import LojaDetails from './pages/LojaDetails';
import Dashboard from './pages/Dashboard';
import StoreDashboardPage from './pages/StoreDashboardPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminIdentityVerification from './pages/admin/AdminIdentityVerification';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminDeliveryZones from './pages/admin/AdminDeliveryZones';
import AdminOrders from './pages/admin/AdminOrders';
import Vender from './pages/Vender';
import ComoFunciona from './pages/ComoFunciona';

const ConditionalFooter = () => {
	const location = useLocation();
	if (location.pathname.startsWith('/dbe')) return null;
	return <Footer />;
};

const AuthRoute = () => {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const isLoading = useAuthStore((s) => s.isLoading);
	if (!isLoading && isAuthenticated) return <Navigate to="/" replace />;
	return <Auth />;
};

const ProtectedRoute = ({ children }) => {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const isLoading = useAuthStore((s) => s.isLoading);
	if (isLoading) return null;
	if (!isAuthenticated) return <Navigate to="/auth" replace />;
	return children;
};

function AppRoutes() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/categorias" element={<Categorias />} />
				<Route path="/categorias/:slug" element={<CategoryProducts />} />
				<Route path="/produtos" element={<Produtos />} />
				<Route path="/cupoes" element={<Cupoes />} />
				<Route path="/auth" element={<AuthRoute />} />
				<Route path="/contato" element={<Contato />} />
				<Route path="/sobre" element={<Sobre />} />
				<Route path="/vender" element={<Vender />} />
				<Route path="/como-funciona" element={<ComoFunciona />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/produto/:id" element={<ProductDetails />} />
				<Route path="/promocoes" element={<Promocoes />} />
				<Route path="/lojas" element={<Lojas />} />
				<Route path="/loja/:id" element={<LojaDetails />} />
				<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
				<Route path="/loja/dashboard" element={<ProtectedRoute><StoreDashboardPage /></ProtectedRoute>} />
				<Route path="/dbe/login" element={<AdminLogin />} />
				<Route path="/dbe" element={<AdminDashboardLayout />}>
					<Route index element={<AdminDashboard />} />
					<Route path="users" element={<AdminUsers />} />
					<Route path="stores" element={<AdminStores />} />
					<Route path="products" element={<AdminProducts />} />
					<Route path="categories" element={<AdminCategories />} />
					<Route path="identity" element={<AdminIdentityVerification />} />
					<Route path="analytics" element={<AdminAnalytics />} />
					<Route path="promotions" element={<AdminPromotions />} />
					<Route path="delivery-zones" element={<AdminDeliveryZones />} />
					<Route path="orders" element={<AdminOrders />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
			<ConditionalFooter />
		</BrowserRouter>
	);
}

function App() {
	const initSession = useAuthStore((s) => s.initSession);
	const initAdmin = useAuthStore((s) => s.initAdmin);
	const loadCartFromApi = useCartStore((s) => s.loadCartFromApi);
	const resetCart = useCartStore((s) => s.resetCart);
	const resetWishlist = useWishlistStore((s) => s.reset);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	useEffect(() => {
		initSession();
		initAdmin();
	}, [initSession, initAdmin]);

	useEffect(() => {
		if (isAuthenticated) {
			loadCartFromApi();
		} else {
			resetCart();
			resetWishlist();
		}
	}, [isAuthenticated, loadCartFromApi, resetCart, resetWishlist]);

	return <AppRoutes />;
}

export default App;
