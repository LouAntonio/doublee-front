import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import Cupoes from './pages/Cupoes';
import Auth from './pages/Auth';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import Footer from '../src/components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Promocoes from './pages/Promocoes';
import Produtos from './pages/Produtos';
import Lojas from './pages/Lojas';
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
import { AdminAuthProvider } from './context/AdminAuthContext';

const ConditionalFooter = () => {
	const location = useLocation();
	if (location.pathname.startsWith('/dbe')) return null;
	return <Footer />;
};

// Redirect authenticated users away from /auth
const AuthRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (!isLoading && isAuthenticated) return <Navigate to="/" replace />;
	return <Auth />;
};

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();

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
				<Route path="/produtos" element={<Produtos />} />
				<Route path="/cupoes" element={<Cupoes />} />
				<Route path="/auth" element={<AuthRoute />} />
				<Route path="/contato" element={<Contato />} />
				<Route path="/sobre" element={<Sobre />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/produto/:id" element={<ProductDetails />} />
				<Route path="/promocoes" element={<Promocoes />} />
				<Route path="/lojas" element={<Lojas />} />
				<Route path="/loja/:id" element={<LojaDetails />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/loja/dashboard"
					element={
						<ProtectedRoute>
							<StoreDashboardPage />
						</ProtectedRoute>
					}
				/>

				{/* Admin Routes */}
				<Route path="/dbe/login" element={<AdminLogin />} />
				<Route path="/dbe" element={<AdminDashboardLayout />}>
					<Route index element={<AdminDashboard />} />
					<Route path="users" element={<AdminUsers />} />
					<Route path="stores" element={<AdminStores />} />
					<Route path="products" element={<AdminProducts />} />
					<Route path="categories" element={<AdminCategories />} />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
			<ConditionalFooter />
		</BrowserRouter>
	);
}

function App() {
	return (
		<AuthProvider>
			<AdminAuthProvider>
				<CartProvider>
					<AppRoutes />
				</CartProvider>
			</AdminAuthProvider>
		</AuthProvider>
	)
}

export default App
