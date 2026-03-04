import React from 'react';

const StatCard = ({ icon, label, value, colorClass }) => {
	const Icon = icon;
	return (
		<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
			<span className={`p-3 rounded-xl ${colorClass}`}>
				<Icon className="w-6 h-6" />
			</span>
			<div>
				<p className="text-xs text-gray-400 font-medium">{label}</p>
				<p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
			</div>
		</div>
	);
};

export default StatCard;
