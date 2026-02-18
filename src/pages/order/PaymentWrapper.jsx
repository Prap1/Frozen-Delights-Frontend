import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../services/api';
import Payment from './Payment';
import Loader from '../../components/ui/Loader';

const PaymentWrapper = () => {
    const [stripeApiKey, setStripeApiKey] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getStripeApiKey() {
            try {
                const { data } = await api.get('/payment/stripeapikey');
                console.log("Stripe API Key Response:", data);
                if (data.stripeApiKey) {
                    setStripeApiKey(data.stripeApiKey);
                } else {
                    setError('Stripe API Key not found in response');
                }
            } catch (error) {
                console.error("Error fetching Stripe API key:", error.response ? error.response.data : error.message);
                setError(error.response?.data?.message || error.message);
            }
        }
        getStripeApiKey();
    }, []);

    if (error) return <div className="text-center text-red-500 mt-10">Error loading payment system: {error}</div>;
    if (!stripeApiKey) return <Loader />;

    return (
        <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment />
        </Elements>
    );
};

export default PaymentWrapper;
