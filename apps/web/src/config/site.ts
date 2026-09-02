import {
  PROJECT_CODENAME,
  PARENT_COMPANY,
  COMMERCIAL_PRODUCT_NAME,
} from '@skyra/shared';

export const siteConfig = {
  codename: PROJECT_CODENAME,
  parentCompany: PARENT_COMPANY,
  commercialProductName: COMMERCIAL_PRODUCT_NAME,
  name: `${PROJECT_CODENAME} Platform`,
  description:
    'Enterprise B2B Dynamic QR SaaS Platform for high-performance redirection, context routing, and AI-agent integration.',
  version: '1.0.0',
  links: {
    github: 'https://github.com/SkyraTech/skyra-qr-code-generator',
    docs: '/docs',
  },
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  appBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;
