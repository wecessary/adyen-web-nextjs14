
import paymentsConfig from "./paymentsConfig";

async function makePaymentsCall(data) {

    const paymentsRequest = {
        ...paymentsConfig,
        ...data,
    };

    try {
        const response = await fetch('/api/payments', {
            method: 'POST',
            body: JSON.stringify(paymentsRequest),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (response) {
            const data = await response.json();
            console.log(data);
            return data;
        }

    } catch (error){
        console.error('Error during /payments call', error);
    }

}

export default makePaymentsCall;
