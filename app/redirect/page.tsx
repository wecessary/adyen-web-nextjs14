'use client';

import {useCallback, useEffect, useRef} from 'react';
import AdyenCheckout from '@adyen/adyen-web';
import makeDetailsCall from "../_utils/makeDetailsCall";

const getSearchParameters = (search ): any =>
    search
        .replace(/\?/g, '')
        .split('&')
        .reduce((acc, cur) => {
            const [key, prop = ''] = cur.split('=');
            acc[key] = decodeURIComponent(prop);
            return acc;
        }, {});


export default function Redirect() {
    const isRedirectHandled = useRef<boolean>(false);

    const handleRedirectResult = useCallback(async (redirectResult, sessionId) => {
        const checkout = await AdyenCheckout({
            analytics: {
                enabled: false
            },
            clientKey: process.env.CLIENT_KEY,
            environment: 'test',
            onAdditionalDetails: async (state: any) => {
                const result = await makeDetailsCall(state);

                /**
                 * It is assuming that no action is returned back. Don't do this in production
                 */
                document.querySelector('#result-container > pre').innerHTML = JSON.stringify(result, null, '\t');
            },
            onError: error => {
                console.log('Something went wrong', error);
            }
        });

        checkout.submitDetails({ details: { redirectResult }});
    }, []);

    useEffect(() => {
        const { redirectResult, sessionId } = getSearchParameters(window.location.search);
        if (redirectResult) {
            if (!isRedirectHandled.current) {
                isRedirectHandled.current = true;
                void handleRedirectResult(redirectResult, sessionId);
            }
        } else {
            document.querySelector('#result-container').innerHTML = 'No redirectResult available'
        }
    }, [handleRedirectResult]);


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Redirect Result Page</h1>

            <div id='result-container'>
                <pre>Loading...</pre>
            </div>
        </main>
    )
}

