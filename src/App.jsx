import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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

import Supermarket from './pages/Supermarket';

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categorias" element={<Categorias />} />
                    <Route path="/supermercado" element={<Supermarket />} />
                    <Route path="/cupoes" element={<Cupoes />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/produto/:id" element={<ProductDetails />} />
                    <Route path="/promocoes" element={<Promocoes />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </CartProvider>
    )
}

export default App
