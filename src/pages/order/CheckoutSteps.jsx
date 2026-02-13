import { Link } from 'react-router-dom';

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        { label: 'Shipping Details', link: '/shipping' },
        { label: 'Confirm Order', link: '/order/confirm' },
        { label: 'Payment', link: '/process/payment' },
    ];

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={index} className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
                        <div className="relative flex flex-col items-center text-blue-600">
                            <div
                                className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${activeStep >= index ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-500'
                                    } flex items-center justify-center`}
                            >
                                {index + 1}
                            </div>
                            <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${activeStep >= index ? 'text-blue-600' : 'text-gray-500'}`}>
                                <Link to={step.link} disabled={activeStep < index}>
                                    {step.label}
                                </Link>
                            </div>
                        </div>
                        {index !== steps.length - 1 && (
                            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${activeStep > index ? 'border-blue-600' : 'border-gray-300'}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckoutSteps;
