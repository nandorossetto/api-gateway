import { timeout } from "rxjs";

export const serviceConfig = {
  users: {
    url: process.env.USERS_SERVICE_URL || 'http://locvalhost:3000',
    timeout: 10000
  },
  products: {
    url: process.env.PRODUCTS_SERVICE_URL || 'http://locvalhost:3001',
    timeout: 10000
  },
  checkout: {
    url: process.env.CHECKOUT_SERVICE_URL || 'http://locvalhost:3003',
    timeout: 10000
  },
  payments: {
    url: process.env.PAYMENTS_SERVICE_URL || 'http://locvalhost:3004',
    timeout: 10000
  },
} as const;
