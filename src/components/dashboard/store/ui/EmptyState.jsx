import React from 'react';

const EmptyState = ({ emoji, title, description, action }) => (
	<div className="text-center py-16 bg-white rounded-2xl border border-dashed border-accent/10">
		<span className="text-5xl mb-4 block">{emoji}</span>
		<p className="text-base font-semibold text-[#1C1917]">{title}</p>
		<p className="text-sm text-[#78716C] mt-1">{description}</p>
		{action}
	</div>
);

export default EmptyState;
