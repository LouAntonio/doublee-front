import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Ofertas from './pages/Ofertas';
import Categorias from './pages/Categorias';
import Cupoes from './pages/Cupoes';
import Auth from './pages/Auth';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/ofertas" element={<Ofertas />} />
				<Route path="/categorias" element={<Categorias />} />
				<Route path="/cupoes" element={<Cupoes />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/contato" element={<Contato />} />
				<Route path="/sobre" element={<Sobre />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
