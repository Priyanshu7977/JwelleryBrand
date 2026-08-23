# CELESTIA — Shopify Online Store 2.0 Theme Architecture & Migration Guide

This document defines how each React / TypeScript component in the Celestia interactive homepage maps directly to Shopify Online Store 2.0 Liquid sections, blocks, and schema settings.

---

## 1. Section Mapping Directory

| Homepage Section | React Component | Shopify Liquid Section | Configurable Shopify Blocks / Metafields |
|---|---|---|---|
| **01. The Arrival** | `Section01Arrival.tsx` | `sections/celestia-hero-3d.liquid` | Hero wordmark, Taglines ("WEAR", "YOUR", "WORLD"), 3D WebGL GLTF model upload / fallback poster, Ambient sound toggle |
| **02. The Reveal** | `Section02Reveal.tsx` | `sections/celestia-reveal.liquid` | Featured Product picker (`product` setting), Material tags, Anti-tarnish badges, Same-Day Mumbai trigger |
| **03. The Collections** | `Section03Collections.tsx` | `sections/celestia-collections.liquid` | `collection_list` (Jewellery, Bangles, Accessories, Gifting, Personalised), editorial quote metafields |
| **04. The Celestia World** | `Section04World.tsx` | `sections/celestia-world.liquid` | Brand heritage copy, Mumbai studio location badge, Craftsmanship pillars |
| **05. Bespoke Gifting** | `Section05Gifting.tsx` | `sections/celestia-gifting-builder.liquid` | Velvet box variants, Bundle products, Polaroid custom note line-item properties (`properties[Custom Note]`) |
| **06. Social Proof** | `Section06SocialProof.tsx` | `sections/celestia-social-proof.liquid` | `1000+ Orders` stats counter, Mumbai express badge, Customer review blocks with verified tags |
| **07. Instagram Atelier** | `Section07Instagram.tsx` | `sections/celestia-instagram.liquid` | Instagram handle `@celestiaamor.in`, Highlight story circles, UGC lookbook grid |
| **08. Final Moment** | `Section08FinalMoment.tsx` | `sections/celestia-final-cta.liquid` | Brand manifesto typography, Explore CTA link |
| **09. Atelier Footer** | `Footer.tsx` | `sections/footer.liquid` | WhatsApp direct concierge link (`+91 7718825792`), Newsletter signup, Navigation menus |

---

## 2. Liquid Section Example: `sections/celestia-reveal.liquid`

```liquid
{% schema %}
{
  "name": "Celestia Editorial Reveal",
  "tag": "section",
  "class": "section-celestia-reveal",
  "settings": [
    {
      "type": "text",
      "id": "act_subtitle",
      "label": "Act Subtitle",
      "default": "Act 02 — The Reveal"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Editorial Heading",
      "default": "Sculpted in Gold & Light."
    },
    {
      "type": "product",
      "id": "hero_product",
      "label": "Hero Curated Piece"
    },
    {
      "type": "checkbox",
      "id": "enable_same_day_mumbai",
      "label": "Enable Mumbai Same-Day Badge",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Celestia Editorial Reveal"
    }
  ]
}
{% endschema %}

<div class="reveal-container bg-ivory-100 py-28 px-6 md:px-12">
  <div class="max-w-7xl mx-auto">
    <span class="text-gold-dark text-[11px] uppercase tracking-monumental font-semibold">
      {{ section.settings.act_subtitle }}
    </span>
    <h2 class="font-serif text-5xl md:text-7xl text-obsidian uppercase">
      {{ section.settings.heading }}
    </h2>
    
    {% assign product = all_products[section.settings.hero_product] %}
    {% if product != blank %}
      <div class="product-editorial-grid mt-12">
        <img src="{{ product.featured_image | image_url: width: 1200 }}" alt="{{ product.title | escape }}" class="rounded-3xl shadow-luxury" />
        <div class="details space-y-4">
          <h3 class="font-serif text-3xl">{{ product.title }}</h3>
          <p class="price font-mono text-2xl text-gold-dark">{{ product.price | money }}</p>
          <form method="post" action="/cart/add">
            <input type="hidden" name="id" value="{{ product.variants.first.id }}" />
            <button type="submit" class="btn-celestia-primary">Add to Curated Bag</button>
          </form>
        </div>
      </div>
    {% endif %}
  </div>
</div>
```

---

## 3. Shopify Gifting & Custom Polaroid Integration

To capture custom polaroid photos and handwritten notes in Shopify without third-party app bloat:

```liquid
<div class="gifting-customizer">
  <label for="polaroid-note">Handwritten Note for Wax-Sealed Envelope:</label>
  <textarea id="polaroid-note" name="properties[Handwritten Note]" required></textarea>
  
  <label for="polaroid-image">Upload Photo for Fujifilm Polaroid (Instant Emulsion):</label>
  <input type="file" id="polaroid-image" name="properties[Polaroid Photo]" accept="image/*" />
</div>
```

These line-item properties seamlessly attach to the order in the Shopify Admin and print directly on the packing slip for the Mumbai fulfillment studio.
