import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoRefreshOutline } from 'react-icons/io5';
import { MdCategory } from 'react-icons/md';
import { TbCurrencyDollarOff, TbCurrencyDollar } from 'react-icons/tb';
import apiRequest from '../services/api';

const FilterSidebar = ({
	categories = [],
	priceRange = { min: '', max: '' },
	setPriceRange = () => { },
	selectedCategories = [],
	setSelectedCategories = () => { },
	setRating = () => { },
	searchQuery = '',
	setSearchQuery = () => { },
	setSelectedBrand = () => { },
	featuredOnly = false,
	setFeaturedOnly = () => { },
	onSearch = () => { },
	onClear = () => { },
}) => {
	const [fetchedCategories, setFetchedCategories] = useState([]);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				const res = await apiRequest('/categories');
				if (!mounted) return;
				if (res && res.success) setFetchedCategories(res.data?.categories || []);
			} catch (err) {
				// ignore, keep empty
			}
		};
		load();
		return () => { mounted = false; };
	}, []);

	const handleClear = () => {
		setSearchQuery('');
		setPriceRange({ min: '', max: '' });
		setSelectedCategories([]);
		setRating(null);
		setSelectedBrand('');
		setFeaturedOnly(false);
		onClear();
	};

	return (
		<aside className="w-64 flex-shrink-0">
			<div className="bg-white rounded-lg shadow-sm p-4 sticky top-5">
				{/* Title */}
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrar Produtos</h3>

				{/* Search */}
				<div className="mb-4">
					<label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
						<IoSearchOutline size={14} />
						Pesquisar
					</label>
					<input
						type="text"
						placeholder="Ex: Piscina, Mangueira..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
						className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none transition"
					/>
				</div>

				{/* Categories (inline, multi-select) */}
				<div className="mb-4">
					<label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
						<MdCategory size={13} />
						Categorias
					</label>
					<div className="flex flex-wrap gap-2">
						{(fetchedCategories.length > 0 ? fetchedCategories : categories).map((cat) => {
							// cat can be either string (fallback) or object { id, name }
							const id = typeof cat === 'string' ? cat : cat.id;
							const name = typeof cat === 'string' ? cat : cat.name;
							const selected = selectedCategories.includes(id);
							return (
								<button
									key={id}
									onClick={() => {
										if (selected) setSelectedCategories(selectedCategories.filter(c => c !== id));
										else setSelectedCategories([...selectedCategories, id]);
									}}
									className={`text-sm px-3 py-1 rounded-md border transition focus:outline-none ${selected ? 'bg-[#F97316] text-white' : 'bg-white text-gray-700 border-gray-200'}`}
								>
									{name}
								</button>
							);
						})}
					</div>
				</div>

				{/* removed Tipo, Marca e Avaliação as requested */}

				{/* Price Min & Max */}
				<div className="grid grid-cols-2 gap-2 mb-4">
					<div>
						<label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
							<TbCurrencyDollarOff size={13} />
							Preço Mín.
						</label>
						<input
							type="number"
							placeholder="0 Kz"
							value={priceRange.min}
							onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
							className="w-full border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none transition"
						/>
					</div>
					<div>
						<label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
							<TbCurrencyDollar size={13} />
							Preço Máx.
						</label>
						<input
							type="number"
							placeholder="Sem limite"
							value={priceRange.max}
							onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
							className="w-full border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none transition"
						/>
					</div>
				</div>

				{/* Featured only */}
				<label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mb-5 select-none">
					<input
						type="checkbox"
						checked={featuredOnly}
						onChange={(e) => setFeaturedOnly(e.target.checked)}
						className="w-4 h-4 rounded border-gray-300 accent-[#F97316] cursor-pointer"
					/>
					Apenas produtos em destaque
				</label>

				{/* Search Button */}
				<button
					onClick={onSearch}
					className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mb-2 cursor-pointer"
				>
					<IoSearchOutline size={18} />
					Buscar Produtos
				</button>

				{/* Clear Button */}
				<button
					onClick={handleClear}
					className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-[#F97316] text-sm py-2 rounded-lg transition-colors cursor-pointer"
				>
					<IoRefreshOutline size={16} />
					Limpar Filtros
				</button>
			</div>
		</aside>
	);
};

export default FilterSidebar;
