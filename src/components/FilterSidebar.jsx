import React from 'react';

const FilterSidebar = ({
	categories = [],
	priceRange = { min: '', max: '' },
	setPriceRange = () => { },
	selectedCategories = [],
	setSelectedCategories = () => { },
	rating = null,
	setRating = () => { }
}) => {
	return (
		<aside style={{
			width: '260px',
			flexShrink: 0
		}}>
			<div style={{
				backgroundColor: '#fff',
				borderRadius: '8px',
				padding: '16px',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
				position: 'sticky',
				top: '20px',
				maxHeight: 'calc(100vh - 40px)',
				overflowY: 'auto',
				scrollbarWidth: 'thin'
			}}>
				<h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>Filtros</h3>

				{/* Categories Filter */}
				<div style={{ marginBottom: '24px' }}>
					<h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Categorias</h4>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						{categories.map((cat) => (
							<label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666', cursor: 'pointer' }}>
								<input
									type="checkbox"
									checked={selectedCategories.includes(cat)}
									onChange={(e) => {
										if (e.target.checked) {
											setSelectedCategories([...selectedCategories, cat]);
										} else {
											setSelectedCategories(selectedCategories.filter(c => c !== cat));
										}
									}}
								/>
								{cat}
							</label>
						))}
					</div>
				</div>

				{/* Price Filter */}
				<div style={{ marginBottom: '24px' }}>
					<h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Preço</h4>
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<input
							type="number"
							placeholder="Mín"
							value={priceRange.min}
							onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
							style={{
								width: '100%',
								padding: '8px',
								border: '1px solid #ddd',
								borderRadius: '4px'
							}}
						/>
						<span style={{ color: '#999' }}>-</span>
						<input
							type="number"
							placeholder="Máx"
							value={priceRange.max}
							onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
							style={{
								width: '100%',
								padding: '8px',
								border: '1px solid #ddd',
								borderRadius: '4px'
							}}
						/>
					</div>
				</div>

				{/* Review Filter */}
				<div>
					<h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Avaliação</h4>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
						{[5, 4, 3, 2, 1].map((stars) => (
							<label key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666', cursor: 'pointer' }}>
								<input
									type="radio"
									name="rating"
									checked={rating === stars}
									onChange={() => setRating(stars)}
								/>
								{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
							</label>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
};

export default FilterSidebar;
