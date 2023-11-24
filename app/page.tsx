'use client';

import {useCallback,  useEffect, useRef} from 'react';
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';

import {amount, countryCode, shopperLocale} from "./_utils/commonConfig";
import makePaymentsCall from "./_utils/makePaymentsCall";
import makePaymentMethodsCall from "./_utils/makePaymentMethodsCall";
import makeDetailsCall from "./_utils/makeDetailsCall";

function handleFinalState(resultCode, dropin) {
  if (resultCode === 'Authorised' || resultCode === 'Received') {
    dropin.setStatus('success');
  } else {
    dropin.setStatus('error');
  }
}

export default function Home() {
  const dropinRef = useRef<HTMLDivElement>(null);
  const isAdyenWebInitialized = useRef<boolean>(false);

  const loadAdyen = useCallback(async () => {
    console.log('Initializing AdyenWeb');

    const paymentMethodsResponse = await makePaymentMethodsCall();

    const options = {
      analytics: {
        enabled: false,
      },
      clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
      countryCode,
      amount,
      environment: 'test',
      locale: shopperLocale,
      paymentMethodsResponse,
      onSubmit: async (state: any, component: any) => {
        const result = await makePaymentsCall(state.data);

        if (result.action) {
          component.handleAction(result.action);
        } else if (result.order && result.order?.remainingAmount?.value > 0) {
          // TODO: No order handling implemented
        } else {
          handleFinalState(result.resultCode, component);
        }
      },
      onAdditionalDetails: async (state: any, component: any) => {
        const result = await makeDetailsCall(state.data);

        if (result.action) {
          component.handleAction(result.action);
        } else {
          handleFinalState(result.resultCode, component);
        }
      },
      onError(error) {
        console.error('Something went wrong', error);
      }
    };

    console.log('AdyenCheckout configuration', options);

    const checkout = await AdyenCheckout(options);

    if (dropinRef.current) {
      checkout.create('dropin').mount(dropinRef.current);
    }
  }, []);


  useEffect(() => {
    if (!isAdyenWebInitialized.current) {
      isAdyenWebInitialized.current = true;
      loadAdyen();
    }
  }, [loadAdyen]);


  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div ref={dropinRef} id='dropin'></div>
      </main>
  )
}

