import React from 'react';
import { IoCheckmarkCircle, IoLocationOutline, IoReceiptOutline } from 'react-icons/io5';

const CheckoutSteps = ({ currentStep, onStepClick }) => {
	const steps = [
		{ id: 1, name: 'Envio', icon: IoLocationOutline },
		{ id: 2, name: 'Pagamento', icon: IoReceiptOutline },
		{ id: 3, name: 'Revisão', icon: IoReceiptOutline },
	];

	return (
		<div className="bg-white rounded-2xl shadow-md p-6 mb-6">
			<div className="flex items-center justify-between">
				{steps.map((step, index) => {
					const Icon = step.icon;
					const isActive = currentStep === step.id;
					const isCompleted = currentStep > step.id;
					const isClickable = currentStep >= step.id;

					return (
						<React.Fragment key={step.id}>
							<div
								className={`flex flex-col items-center flex-1 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
								}`}
								onClick={() => isClickable && onStepClick && onStepClick(step.id)}
							>
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
										? 'bg-accent text-white'
										: isActive
											? 'bg-accent text-white ring-4 ring-accent/20'
											: 'bg-accent/15 text-[#78716C]'
									}`}
								>
									{isCompleted ? (
										<IoCheckmarkCircle className="w-6 h-6" />
									) : (
										<Icon className="w-6 h-6" />
									)}
								</div>

								<span
									className={`text-sm font-display ${isActive
										? 'text-accent'
										: isCompleted
											? 'text-accent'
											: 'text-[#78716C]'
									}`}
								>
									{step.name}
								</span>

								<span className="text-xs text-[#78716C] mt-1 lg:hidden">
									Passo {step.id}
								</span>
							</div>

							{index < steps.length - 1 && (
								<div className="flex-1 h-1 mx-2 lg:mx-4 mb-8">
									<div
										className={`h-full rounded transition-all ${currentStep > step.id ? 'bg-accent' : 'bg-accent/15'
										}`}
									/>
								</div>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};

export default CheckoutSteps;
