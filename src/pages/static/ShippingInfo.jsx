import React from 'react';

const ShippingInfo = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
                <h1 className="text-3xl font-bold text-[#0D1E32] mb-6">Shipping</h1>

                <div className="prose prose-red text-gray-600">
                    <h3 className="text-lg font-semibold text-[#0D1E32] mt-6 mb-2">Why does the delivery date not correspond to the delivery timeline of X-Y business days?</h3>
                    <p className="mb-4">
                        It is possible that the Seller or our delivery partners have a holiday between the day you placed your order and the date of delivery, which is based on the timelines shown on the product page. In this case, we add a day to the estimated date. Some delivery partners and Sellers do not work on Sundays and this is factored in to the delivery dates.
                    </p>

                    <h3 className="text-lg font-semibold text-[#0D1E32] mt-6 mb-2">What is the estimated delivery time?</h3>
                    <p className="mb-2">
                        Sellers generally procure and ship the items within the time specified on the product page. Business days exclude public holidays and Sundays.
                    </p>
                    <p className="mb-2">Estimated delivery time depends on the following factors:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>The Seller offering the product</li>
                        <li>Product's availability with the Seller</li>
                        <li>The destination to which you want the order shipped to and location of the Seller.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-[#0D1E32] mt-6 mb-2">Why does the estimated delivery time vary for each seller?</h3>
                    <p className="mb-4">
                        You have probably noticed varying estimated delivery times for sellers of the product you are interested in. Delivery times are influenced by product availability, geographic location of the Seller, your shipping destination and the delivery partner's time-to-deliver in your location.
                    </p>
                    <p className="mb-4">
                        Please enter your default pin code on the product page (you don't have to enter it every single time) to know more accurate delivery times on the product page itself.
                    </p>

                    <h3 className="text-lg font-semibold text-[#0D1E32] mt-6 mb-2">Seller does not/cannot ship to my area. Why?</h3>
                    <p className="mb-4">
                        Please enter your pincode on the product page (you don't have to enter it every single time) to know whether the product can be delivered to your location.
                    </p>
                    <p className="mb-4">
                        If you haven't provided your pincode until the checkout stage, the pincode in your shipping address will be used to check for serviceability.
                    </p>

                    <div className="mt-8 text-xs text-gray-400">
                        <p>Note: Whether your location can be serviced or not depends on:</p>
                        <ul className="list-disc pl-5 mt-1">
                            <li>Whether the Seller ships to your location</li>
                            <li>Legal restrictions, if any, in shipping particular products to your location</li>
                            <li>The availability of reliable courier partners in your location</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
