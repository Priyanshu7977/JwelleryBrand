/**
 * CELESTIA LUXURY ATELIER — SHOPIFY THEME ENGINE (OS 2.0)
 * Handles AJAX Cart API, Slide-over Drawer, Quick View, Gifting Customizer, and Modals
 */

class CelestiaTheme {
  constructor() {
    this.initCartDrawer();
    this.initQuickView();
    this.initGiftingBuilder();
    this.initEntranceModal();
    this.initLiveSocialProof();
    this.initMobileNav();
  }

  /* ==========================================================================
     1. SHOPIFY AJAX CART ENGINE & SLIDE-OVER DRAWER
     ========================================================================== */
  initCartDrawer() {
    this.drawer = document.getElementById('CelestiaCartDrawer');
    this.drawerBackdrop = document.getElementById('CelestiaCartBackdrop');
    this.drawerClose = document.getElementById('CelestiaCartClose');
    this.cartCountBadges = document.querySelectorAll('[data-cart-count]');

    // Attach open buttons
    document.querySelectorAll('[data-open-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    });

    if (this.drawerClose) {
      this.drawerClose.addEventListener('click', () => this.closeCart());
    }
    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => this.closeCart());
    }

    // Intercept form submissions for AJAX add to cart
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.matches('form[action*="/cart/add"]') || form.dataset.ajaxCartForm) {
        e.preventDefault();
        this.addToCart(new FormData(form));
      }
    });

    // Delegated click for quick add buttons
    document.addEventListener('click', (e) => {
      const quickAddBtn = e.target.closest('[data-quick-add]');
      if (quickAddBtn) {
        e.preventDefault();
        const variantId = quickAddBtn.dataset.variantId;
        if (variantId) {
          this.addToCartDirect(variantId, 1);
        }
      }
    });
  }

  async openCart() {
    if (!this.drawer) return;
    await this.refreshCart();
    this.drawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    if (!this.drawer) return;
    this.drawer.classList.add('hidden');
    document.body.style.overflow = '';
  }

  async addToCart(formData) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const item = await response.json();
        this.showToast(`✨ "${item.title}" added to your curated bag`);
        this.openCart();
      } else {
        const err = await response.json();
        this.showToast(err.description || 'Could not add item to bag');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async addToCartDirect(variantId, quantity = 1, properties = {}) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity, properties })
      });
      if (response.ok) {
        const item = await response.json();
        this.showToast(`✨ "${item.title}" added to your curated bag`);
        this.openCart();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async refreshCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.updateCartDrawerUI(cart);
      this.cartCountBadges.forEach(b => {
        b.textContent = cart.item_count;
        b.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    } catch (e) {
      console.error(e);
    }
  }

  updateCartDrawerUI(cart) {
    const itemsContainer = document.getElementById('CelestiaCartItems');
    const subtotalEl = document.getElementById('CelestiaCartSubtotal');
    const grandTotalEl = document.getElementById('CelestiaCartGrandTotal');
    const emptyState = document.getElementById('CelestiaCartEmpty');
    const filledState = document.getElementById('CelestiaCartFilled');

    if (!itemsContainer) return;

    if (cart.item_count === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (filledState) filledState.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (filledState) filledState.classList.remove('hidden');

    const formattedTotal = (cart.total_price / 100).toLocaleString('en-IN');
    if (subtotalEl) subtotalEl.textContent = `₹${formattedTotal}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${formattedTotal}`;

    itemsContainer.innerHTML = cart.items.map(item => `
      <div class="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#D8C39A]/30">
        <img src="${item.image}" alt="${item.title}" class="w-14 h-14 object-cover rounded-xl shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-serif font-bold text-[#1E1A17] truncate">${item.product_title}</h4>
          <p class="text-[10px] text-[#786E65] font-mono">₹${(item.final_price / 100).toLocaleString('en-IN')} × ${item.quantity}</p>
          ${item.properties ? Object.entries(item.properties).map(([k, v]) => `<p class="text-[9px] text-emerald-800 font-mono italic">${k}: ${v}</p>`).join('') : ''}
        </div>
        <button onclick="window.celestiaTheme.updateQuantity('${item.key}', 0)" class="p-1 text-[#786E65] hover:text-red-600 transition-colors">
          ✕
        </button>
      </div>
    `).join('');
  }

  async updateQuantity(key, quantity) {
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      this.refreshCart();
    } catch (e) {
      console.error(e);
    }
  }

  /* ==========================================================================
     2. DYNAMIC QUICK VIEW MODAL
     ========================================================================== */
  initQuickView() {
    this.quickModal = document.getElementById('CelestiaQuickViewModal');
    if (!this.quickModal) return;

    document.addEventListener('click', async (e) => {
      const trigger = e.target.closest('[data-quick-view-handle]');
      if (trigger) {
        e.preventDefault();
        const handle = trigger.dataset.quickViewHandle;
        await this.loadQuickView(handle);
      }
    });

    const closeBtn = document.getElementById('CelestiaQuickViewClose');
    const backdrop = document.getElementById('CelestiaQuickViewBackdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeQuickView());
    if (backdrop) backdrop.addEventListener('click', () => this.closeQuickView());
  }

  async loadQuickView(handle) {
    try {
      const res = await fetch(`/products/${handle}.js`);
      const prod = await res.json();
      
      document.getElementById('QuickViewImage').src = prod.featured_image;
      document.getElementById('QuickViewTitle').textContent = prod.title;
      document.getElementById('QuickViewPrice').textContent = `₹${(prod.price / 100).toLocaleString('en-IN')}`;
      document.getElementById('QuickViewDescription').innerHTML = prod.description;
      document.getElementById('QuickViewVariantId').value = prod.variants[0].id;
      
      this.quickModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } catch (e) {
      console.error(e);
    }
  }

  closeQuickView() {
    if (!this.quickModal) return;
    this.quickModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     3. BESPOKE GIFTING & FUJIFILM POLAROID IMAGE UPLOADER
     ========================================================================== */
  initGiftingBuilder() {
    const polaroidInput = document.getElementById('PolaroidUploadInput');
    const polaroidPreview = document.getElementById('PolaroidImagePreview');
    const noteInput = document.getElementById('PolaroidNoteInput');
    const notePreview = document.getElementById('PolaroidNotePreview');

    if (polaroidInput && polaroidPreview) {
      polaroidInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            polaroidPreview.src = ev.target.result;
            polaroidPreview.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (noteInput && notePreview) {
      noteInput.addEventListener('input', (e) => {
        notePreview.textContent = e.target.value || 'Write your handwritten message for the wax-sealed envelope...';
      });
    }
  }

  /* ==========================================================================
     4. CELSTIA CIRCLE ENTRANCE MODAL
     ========================================================================== */
  initEntranceModal() {
    const modal = document.getElementById('CelestiaEntranceModal');
    if (!modal) return;

    const hasSeen = localStorage.getItem('celestia_entrance_seen');
    if (!hasSeen) {
      setTimeout(() => {
        modal.classList.remove('hidden');
      }, 1200);
    }

    const dismissBtns = document.querySelectorAll('[data-dismiss-entrance]');
    dismissBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('hidden');
        localStorage.setItem('celestia_entrance_seen', 'true');
      });
    });
  }

  /* ==========================================================================
     5. LIVE SHOPPER ACTIVITY SOCIAL PROOF TOAST
     ========================================================================== */
  initLiveSocialProof() {
    const toast = document.getElementById('CelestiaLiveToast');
    if (!toast) return;

    const buyers = [
      { name: 'Aanya S.', city: 'Bandra, Mumbai', text: 'ordered Baroque Pearl Drop Suite' },
      { name: 'Rhea M.', city: 'Juhu, Mumbai', text: 'customised a Velvet Hamper with Polaroids' },
      { name: 'Kabir & Tanvi', city: 'South Delhi', text: 'saved Imperial Wave Bangle' },
      { name: 'Simran B.', city: 'Bengaluru', text: 'ordered with Express Same-Day Dispatch' }
    ];

    let idx = 0;
    setInterval(() => {
      const buyer = buyers[idx % buyers.length];
      const buyerText = document.getElementById('LiveToastText');
      if (buyerText) {
        buyerText.innerHTML = `<strong>${buyer.name}</strong> (${buyer.city}) ${buyer.text}`;
        toast.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          toast.classList.add('opacity-0', 'pointer-events-none');
        }, 5000);
      }
      idx++;
    }, 18000);
  }

  /* ==========================================================================
     6. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  initMobileNav() {
    const navDrawer = document.getElementById('CelestiaMobileNavDrawer');
    const openBtn = document.getElementById('CelestiaMobileNavOpen');
    const closeBtn = document.getElementById('CelestiaMobileNavClose');

    if (openBtn && navDrawer) {
      openBtn.addEventListener('click', () => {
        navDrawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && navDrawer) {
      closeBtn.addEventListener('click', () => {
        navDrawer.classList.add('hidden');
        document.body.style.overflow = '';
      });
    }
  }

  /* Toast Notification Helper */
  showToast(message) {
    let toast = document.getElementById('CelestiaGlobalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'CelestiaGlobalToast';
      toast.className = 'fixed bottom-6 right-4 sm:right-6 mb-safe z-[250] flex items-center gap-3 px-5 py-3.5 bg-[#1E1A17] text-[#FAF7F0] rounded-2xl shadow-2xl border border-[#D8C39A]/50 transition-all duration-300 transform translate-y-10 opacity-0 font-sans text-xs';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('translate-y-10', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.celestiaTheme = new CelestiaTheme();
});
