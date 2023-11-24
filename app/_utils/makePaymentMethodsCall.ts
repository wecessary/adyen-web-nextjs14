
import commonConfig from "./commonConfig";

async function makePaymentMethodsCall() {
    try {
        const paymentMethodsConfig = {
            ...commonConfig,
            shopperName: {
                firstName: 'Jan',
                lastName: 'Jansen',
                gender: 'MALE'
            },
            telephoneNumber: '0612345678',
            shopperEmail: 'test@adyen.com',
            dateOfBirth: '1970-07-10'
        };

        const response = await fetch('/api/paymentMethods', {
            method: 'POST',
            body: JSON.stringify(paymentMethodsConfig),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (response) {
            const { paymentMethodsResponse } = await response.json();
            return paymentMethodsResponse;
        }

    } catch (error) {
        console.log(error);
    }

}

export default makePaymentMethodsCall;
