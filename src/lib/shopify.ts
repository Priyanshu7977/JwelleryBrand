import { CartItem } from '../types/shopify';
import { ShopifyCheckoutLineItem } from '../types/backend';

const shopifyDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01';

export const isShopifyConfigured = (): boolean => {
  return Boolean(
    shopifyDomain &&
    storefrontToken &&
    !shopifyDomain.includes('celestia-atelier.myshopify.com') &&
    !storefrontToken.includes('your_public_storefront_access_token')
  );
};

/**
 * Executes a Shopify Storefront GraphQL query safely without exposing admin secrets
 */
export async function shopifyStorefrontFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T | null> {
  if (!isShopifyConfigured()) {
    return null;
  }

  try {
    const endpoint = `https://${shopifyDomain}/api/${apiVersion}/graphql.json`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.warn(`[Shopify Storefront] HTTP error: ${response.status}`);
      return null;
    }

    const json = await response.json();
    if (json.errors) {
      console.warn('[Shopify Storefront] GraphQL errors:', json.errors);
      return null;
    }

    return json.data as T;
  } catch (error) {
    console.error('[Shopify Storefront] Request failed:', error);
    return null;
  }
}

/**
 * Builds a direct Shopify Web Checkout permalink or initiates Storefront Cart Checkout
 * Format: https://{store_domain}/cart/{variant_id}:{quantity}?note=...
 */
export function buildShopifyCartPermalink(
  items: CartItem[],
  customerEmail?: string,
  customNote?: string
): string | null {
  if (!items || items.length === 0) return null;

  const validItems = items
    .filter((item) => item.product?.shopifyVariantId || item.product?.id)
    .map((item) => {
      const variantId = item.product.shopifyVariantId || item.product.id;
      return `${variantId}:${item.quantity}`;
    });

  if (validItems.length === 0) return null;

  const domain = shopifyDomain || 'celestia-atelier.myshopify.com';
  const baseUrl = `https://${domain}/cart/${validItems.join(',')}`;

  const queryParams = new URLSearchParams();
  if (customerEmail) queryParams.append('checkout[email]', customerEmail);
  if (customNote) queryParams.append('note', customNote);

  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
