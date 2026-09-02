/**
 * SkyraQR Shared Constants
 * Internal Project Codename: SkyraQR | Parent Company: Skyra Tech
 */

export const PROJECT_CODENAME = 'SkyraQR' as const;
export const PARENT_COMPANY = 'Skyra Tech' as const;
export const COMMERCIAL_PRODUCT_NAME = 'TBD' as const;

export const API_VERSION = 'v1' as const;
export const DEFAULT_API_PORT = 4000;
export const DEFAULT_WEB_PORT = 3000;

/**
 * Master catalog of 16 supported QR Types (for future phase reference)
 */
export const QR_TYPES = {
  DYNAMIC_URL: 'DYNAMIC_URL',
  STATIC_URL: 'STATIC_URL',
  VCARD_PLUS: 'VCARD_PLUS',
  STATIC_VCARD: 'STATIC_VCARD',
  DIGITAL_MENU: 'DIGITAL_MENU',
  PDF_SHOWCASE: 'PDF_SHOWCASE',
  WIFI_ACCESS: 'WIFI_ACCESS',
  LINK_IN_BIO: 'LINK_IN_BIO',
  WHATSAPP_DIRECT: 'WHATSAPP_DIRECT',
  PRODUCT_PAGE: 'PRODUCT_PAGE',
  COUPON_PROMO: 'COUPON_PROMO',
  EVENT_RSVP: 'EVENT_RSVP',
  FEEDBACK_STAR: 'FEEDBACK_STAR',
  SMART_APP_LINK: 'SMART_APP_LINK',
  AUDIO_MP3: 'AUDIO_MP3',
  GS1_DIGITAL_LINK: 'GS1_DIGITAL_LINK',
} as const;

export type QrTypeKey = keyof typeof QR_TYPES;
