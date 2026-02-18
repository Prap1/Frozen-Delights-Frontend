import { Link } from 'react-router-dom';

const CheckoutSteps = ({ activeStep }) => {
    const steps = [
        { label: 'Shipping Details', link: '/shipping' },
        { label: 'Confirm Order', link: '/order/confirm' },
        { label: 'Payment', link: '/process/payment' },
    ];

    return (
        <div className="w-full py-4 md:py-6 font-poppins">
            <div className="flex items-center justify-center px-2 md:px-0">
                {steps.map((step, index) => (
                    <div key={index} className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : ''}`}>
                        <div className="relative flex flex-col items-center">
                            <div
                                className={`rounded-full transition duration-500 ease-in-out h-8 w-8 md:h-12 md:w-12 py-3 border-2 flex items-center justify-center font-bold text-sm md:text-lg shadow-sm ${activeStep >= index
                                    ? 'bg-[#E65555] text-white border-[#E65555]'
                                    : 'border-gray-300 text-gray-400 bg-white'
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <div className={`absolute top-0 mt-10 md:mt-14 w-20 md:w-32 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide ${activeStep >= index ? 'text-[#E65555]' : 'text-gray-400'
                                }`}>
                                <Link to={step.link} className={`${activeStep < index ? 'pointer-events-none' : ''}`}>
                                    {step.label}
                                </Link>
                            </div>
                        </div>
                        {index !== steps.length - 1 && (
                            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out mx-2 md:mx-4 ${activeStep > index ? 'border-[#E65555]' : 'border-gray-200'
                                }`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckoutSteps;
