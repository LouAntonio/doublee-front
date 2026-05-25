import React from 'react';

const StatCard = ({ icon, label, value, colorClass }) => {
	const Icon = icon;
	return (
		<div className="bg-white rounded-2xl border border-accent/10 shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow duration-300">
			<span className={`p-3 rounded-xl ${colorClass}`}>
				<Icon className="w-6 h-6" />
			</span>
			<div>
				<p className="text-xs text-[#78716C] font-medium">{label}</p>
				<p className="text-xl font-bold text-[#1C1917] leading-tight font-display">{value}</p>
			</div>
		</div>
	);
};

export default StatCard;
