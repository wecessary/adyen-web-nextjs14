import getCurrency from './getCurrency';

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_COUNTRY = 'US';
const AMOUNT = 2000;

export const shopperLocale =  DEFAULT_LOCALE;
export const countryCode =  DEFAULT_COUNTRY;
export const currency = getCurrency(countryCode);
export const amountValue = AMOUNT;
export const shopperReference = 'adyen-nextjs14-shopper';
export const amount = {
    currency,
    value: Number(amountValue)
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    amount,
    countryCode,
    shopperLocale,
    channel: 'Web',
    shopperReference,
};
