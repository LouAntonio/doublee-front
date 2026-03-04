import React from 'react';

const EmptyState = ({ emoji, title, description, action }) => (
	<div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
		<span className="text-5xl mb-4 block">{emoji}</span>
		<p className="text-base font-semibold text-gray-700">{title}</p>
		<p className="text-sm text-gray-400 mt-1">{description}</p>
		{action}
	</div>
);

export default EmptyState;
