import OptimizedImage from '../../components/ui/OptimizedImage';

const StoreLogo = ({ logo, name, className = '' }) => {
	if (logo) {
		return <OptimizedImage src={logo} alt={name} w={160} h={160} fit="fill" loading="lazy" decoding="async" className={`w-full h-full object-cover ${className}`} />;
	}
	const initials = name ? name.slice(0, 2).toUpperCase() : '??';
	return (
		<div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 text-[#F97316] font-bold text-lg ${className}`}>
			{initials}
		</div>
	);
};

export default StoreLogo;
