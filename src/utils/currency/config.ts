import { Network, SupportedCurrencies } from '~gql';

// For walkthrough, see: https://apiguide.coingecko.com/getting-started/10-min-tutorial-guide/1-get-data-by-id-or-address
export const currencyApiConfig = {
  endpoint: 'https://api.coingecko.com/api/v3/simple/token_price/',
  searchParams: {
    from: 'contract_addresses',
    to: 'vs_currencies',
    api: 'x_cg_demo_api_key',
  },
  attribution: 'https://www.coingecko.com/',
};
export const coinGeckoMappings = {
  // This is a map between our internal reference to a supported currency, and the reference the api uses.
  // For full list: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currencies: {
    [SupportedCurrencies.Usd]: 'usd',
    [SupportedCurrencies.Jpy]: 'jpy',
    [SupportedCurrencies.Gbp]: 'gbp',
    [SupportedCurrencies.Eur]: 'eur',
    [SupportedCurrencies.Cad]: 'cad',
    [SupportedCurrencies.Krw]: 'krw',
    [SupportedCurrencies.Inr]: 'inr',
    [SupportedCurrencies.Brl]: 'brl',
    [SupportedCurrencies.Eth]: 'eth',
  },
  // For full list: https://api.coingecko.com/api/v3/asset_platforms
  chains: {
    [Network.Gnosis]: 'xdai',
    [Network.Mainnet]: 'ethereum',
  },
};

export const locationApiConfig = {
  ipLookupEndpoint: 'https://api.ipify.org/',
  ipGeolocatorEndpoint: 'https://api.iplocation.net/',
};

export const countryCodeToCurrencyMap = {
  US: SupportedCurrencies.Usd, // United States
  JP: SupportedCurrencies.Jpy, // Japan
  GB: SupportedCurrencies.Gbp, // United Kingdom
  CA: SupportedCurrencies.Cad, // Canada
  KR: SupportedCurrencies.Krw, // South Korea
  IN: SupportedCurrencies.Inr, // India
  BR: SupportedCurrencies.Brl, // Brazil
  AD: SupportedCurrencies.Eur, // Andorra
  AT: SupportedCurrencies.Eur, // Austria
  BE: SupportedCurrencies.Eur, // Belgium
  HR: SupportedCurrencies.Eur, // Croatia
  CY: SupportedCurrencies.Eur, // Cyprus
  EE: SupportedCurrencies.Eur, // Estonia
  FI: SupportedCurrencies.Eur, // Finland
  FR: SupportedCurrencies.Eur, // France
  DE: SupportedCurrencies.Eur, // Germany
  GR: SupportedCurrencies.Eur, // Greece
  IE: SupportedCurrencies.Eur, // Ireland
  IT: SupportedCurrencies.Eur, // Italy
  LV: SupportedCurrencies.Eur, // Latvia
  LT: SupportedCurrencies.Eur, // Lithuania
  LU: SupportedCurrencies.Eur, // Luxembourg
  MC: SupportedCurrencies.Eur, // Monaco
  MT: SupportedCurrencies.Eur, // Malta
  NL: SupportedCurrencies.Eur, // Netherlands
  PT: SupportedCurrencies.Eur, // Portugal
  SK: SupportedCurrencies.Eur, // Slovakia
  SI: SupportedCurrencies.Eur, // Slovenia
  SM: SupportedCurrencies.Eur, // San Marino
  ES: SupportedCurrencies.Eur, // Spain
  VA: SupportedCurrencies.Eur, // Vatican City
};

export const currencySymbolMap = {
  [SupportedCurrencies.Usd]: '$',
  [SupportedCurrencies.Jpy]: '¥',
  [SupportedCurrencies.Gbp]: '£',
  [SupportedCurrencies.Eur]: '€',
  [SupportedCurrencies.Cad]: 'C$',
  [SupportedCurrencies.Krw]: '₩',
  [SupportedCurrencies.Inr]: '₹',
  [SupportedCurrencies.Brl]: 'R$',
  [SupportedCurrencies.Eth]: 'Ξ',
};
