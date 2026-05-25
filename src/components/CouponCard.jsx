import React, { useState } from 'react';
import { IoHardwareChipOutline, IoCopyOutline, IoCheckmarkCircleOutline, IoCalendarOutline } from 'react-icons/io5';

const CouponCard = ({ coupon, index = 0 }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(coupon.code);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = coupon.code;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();

	return (
		<div
			className="bg-white relative overflow-hidden rounded-xl shadow-md hover:shadow-xl flex flex-col border border-amber-100 hover:border-accent/25 transition-all duration-500 hover:-translate-y-1 group animate-fade-in-up"
			style={{ animationDelay: `${index * 0.08}s` }}
		>
			<div className="h-2 w-full bg-accent" />

			<div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-sand rounded-full -translate-y-1/2" />
			<div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-sand rounded-full -translate-y-1/2" />

			<div className="p-5 flex-1 flex flex-col">
				<div className="flex justify-between items-start mb-4">
					<div className="p-2.5 rounded-xl bg-accent/10 text-accent">
						<IoHardwareChipOutline className="w-5 h-5" />
					</div>
					<span
						className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
							isExpired
								? 'bg-red-50 text-red-500'
								: 'bg-amber-50 text-accent-dark'
						}`}
					>
						<IoCalendarOutline className="w-3.5 h-3.5" />
						{isExpired ? 'Expirado' : `Val. ${new Date(coupon.expiryDate).toLocaleDateString()}`}
					</span>
				</div>

				<div className="mb-4">
					<div className="flex items-baseline gap-1.5 mb-1">
						<span className="text-3xl font-bold text-gray-800 font-display leading-none">
							{coupon.discount}%
						</span>
						<span className="text-sm font-bold text-accent uppercase tracking-widest">
							OFF
						</span>
					</div>
					<h3 className="font-bold text-gray-800 font-display text-lg leading-tight">
						{coupon.store?.name}
					</h3>
					<p className="text-sm text-gray-500 leading-relaxed mt-1.5">
						Aproveite este desconto exclusivo na loja {coupon.store?.name}.
					</p>
				</div>

				<div className="mt-auto pt-4 border-t border-dashed border-gray-200">
					<div className="flex items-center justify-between gap-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50 group-hover:bg-amber-50 transition-colors duration-300">
						<code className="text-sm font-mono font-bold text-accent-dark tracking-widest select-all">
							{coupon.code}
						</code>
						<button
							onClick={handleCopy}
							disabled={isExpired}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 select-none ${
								copied
									? 'bg-green-500 text-white'
									: isExpired
										? 'bg-gray-200 text-gray-400 cursor-not-allowed'
										: 'bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md active:scale-95 cursor-pointer'
							}`}
							aria-label={copied ? 'Código copiado' : 'Copiar código do cupão'}
						>
							{copied ? (
								<><IoCheckmarkCircleOutline className="w-4 h-4" /> Copiado!</>
							) : (
								<><IoCopyOutline className="w-4 h-4" /> {isExpired ? 'Indisponível' : 'Pegar'}</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CouponCard;
