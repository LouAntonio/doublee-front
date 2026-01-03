import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ofertas from './pages/Ofertas';
import Categorias from './pages/Categorias';
import Cupoes from './pages/Cupoes';
import Auth from './pages/Auth';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';
import NotFound from './pages/NotFound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/ofertas" element={<Ofertas />} />
				<Route path="/categorias" element={<Categorias />} />
				<Route path="/cupoes" element={<Cupoes />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/contato" element={<Contato />} />
				<Route path="/sobre" element={<Sobre />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
