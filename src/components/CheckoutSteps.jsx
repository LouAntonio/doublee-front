import React from 'react';
import { IoCheckmarkCircle, IoLocationOutline, IoReceiptOutline } from 'react-icons/io5';

const CheckoutSteps = ({ currentStep, onStepClick }) => {
	const steps = [
		{ id: 1, name: 'Envio', icon: IoLocationOutline },
		{ id: 2, name: 'Pagamento', icon: IoReceiptOutline },
		{ id: 3, name: 'Revisão', icon: IoReceiptOutline },
	];

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
			<div className="flex items-center justify-between">
				{steps.map((step, index) => {
					const Icon = step.icon;
					const isActive = currentStep === step.id;
					const isCompleted = currentStep > step.id;
					const isClickable = currentStep >= step.id;

					return (
						<React.Fragment key={step.id}>
							{/* Step */}
							<div
								className={`flex flex-col items-center flex-1 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
								}`}
								onClick={() => isClickable && onStepClick && onStepClick(step.id)}
							>
								{/* Icon Circle */}
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
										? 'bg-green-500 text-white'
										: isActive
											? 'bg-blue-600 text-white ring-4 ring-blue-100'
											: 'bg-gray-200 text-gray-400'
									}`}
								>
									{isCompleted ? (
										<IoCheckmarkCircle className="w-6 h-6" />
									) : (
										<Icon className="w-6 h-6" />
									)}
								</div>

								{/* Step Name */}
								<span
									className={`text-sm font-medium ${isActive
										? 'text-blue-600'
										: isCompleted
											? 'text-green-600'
											: 'text-gray-400'
									}`}
								>
									{step.name}
								</span>

								{/* Step Number (Mobile) */}
								<span className="text-xs text-gray-400 mt-1 lg:hidden">
									Passo {step.id}
								</span>
							</div>

							{/* Connector Line */}
							{index < steps.length - 1 && (
								<div className="flex-1 h-1 mx-2 lg:mx-4 mb-8">
									<div
										className={`h-full rounded transition-all ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
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
