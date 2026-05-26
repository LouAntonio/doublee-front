import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const sizeMap = {
	sm: 'max-w-md',
	md: 'max-w-2xl',
	lg: 'max-w-3xl',
};

const DashboardModal = ({ isOpen, onClose, children, size = 'md', className = '' }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up ${sizeMap[size] || sizeMap.md} ${className}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>,
		document.body
	);
};

export default DashboardModal;
