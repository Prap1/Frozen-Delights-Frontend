import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../services/api';
import Payment from './Payment';

const PaymentWrapper = () => {
    const [stripeApiKey, setStripeApiKey] = useState('');

    useEffect(() => {
        async function getStripeApiKey() {
            try {
                const { data } = await api.get('/payment/stripeapikey');
                console.log("Stripe API Key Response:", data);
                setStripeApiKey(data.stripeApiKey);
            } catch (error) {
                console.error("Error fetching Stripe API key:", error.response ? error.response.data : error.message);
            }
        }
        getStripeApiKey();
    }, []);

    if (!stripeApiKey) return null;

    return (
        <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment />
        </Elements>
    );
};

export default PaymentWrapper;
