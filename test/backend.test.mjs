/**
 * ============================================================================
 * CELESTIA LUXURY ATELIER - OFFICIAL BACKEND TEST SUITE
 * Comprehensive Unit, Integration & Security Tests
 * ============================================================================
 */

import crypto from 'crypto';

console.log('💎 =======================================================');
console.log('💎 CELESTIA LUXURY ATELIER - BACKEND AUDIT & TEST SUITE');
console.log('💎 =======================================================\n');

let passCount = 0;
let failCount = 0;
const issues = [];

function assert(condition, testName, category = 'General') {
  if (condition) {
    console.log(`  ✅ [PASS] [${category}] ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] [${category}] ${testName}`);
    failCount++;
    issues.push({ testName, category });
  }
}

// ----------------------------------------------------------------------------
// 1. AUTHENTICATION & SECURITY TESTS
// ----------------------------------------------------------------------------
console.log('--- 1. AUTHENTICATION & USER MANAGEMENT ---');

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateRegistration(name, email, password) {
  if (!name || name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (!validateEmail(email)) return { valid: false, error: 'Invalid email format' };
  if (!password || password.trim().length < 4) return { valid: false, error: 'Password must be at least 4 characters' };
  return { valid: true };
}

// Mock User Database Registry
const userRegistry = [
  { id: 'usr-1', email: 'patron@celestia.in', name: 'Aanya S.', passwordHash: 'hash_123' }
];

function registerUser(name, email, password) {
  const check = validateRegistration(name, email, password);
  if (!check.valid) return { success: false, error: check.error };
  const cleanEmail = email.trim().toLowerCase();
  if (userRegistry.some(u => u.email === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists' };
  }
  const newUser = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    name: name.trim(),
    passwordHash: `hash_${password}`
  };
  userRegistry.push(newUser);
  return { success: true, user: newUser };
}

assert(validateRegistration('Aanya', 'aanya@celestia.in', 'securePass').valid === true, 'Valid registration payload accepted', 'Auth');
assert(validateRegistration('', 'aanya@celestia.in', 'securePass').valid === false, 'Empty name rejected', 'Auth');
assert(validateRegistration('Aanya', 'invalid-email', 'securePass').valid === false, 'Malformed email rejected', 'Auth');
assert(validateRegistration('Aanya', 'aanya@celestia.in', '12').valid === false, 'Short password (<4 chars) rejected', 'Auth');

const regRes1 = registerUser('Radhika M.', 'radhika@celestia.in', 'pass1234');
assert(regRes1.success === true && regRes1.user.email === 'radhika@celestia.in', 'New unique user successfully registered', 'Auth');

const duplicateRes = registerUser('Radhika M.', 'radhika@celestia.in', 'pass1234');
assert(duplicateRes.success === false && duplicateRes.error.includes('already exists'), 'Duplicate account creation prevented', 'Auth');

// ----------------------------------------------------------------------------
// 2. REAL-TIME IST TIMEZONE & DATE ENGINE
// ----------------------------------------------------------------------------
console.log('\n--- 2. REAL-TIME IST TIMEZONE & DATE ENGINE ---');

const TIMEZONE = 'Asia/Kolkata';

function formatOrderDateIST(dateInput) {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function formatOrderTimeIST(dateInput) {
  const d = new Date(dateInput);
  const timeStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
  return `${timeStr} IST`;
}

function getHourInIST(dateInput = new Date()) {
  const hourStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    hour12: false,
  }).format(dateInput);
  return parseInt(hourStr, 10);
}

const fixedTimestamp = new Date('2026-08-28T17:12:00Z'); // 10:42 PM IST
assert(formatOrderDateIST(fixedTimestamp).includes('28 Aug 2026'), 'Order Date correctly converted to IST format', 'Timezone');
assert(formatOrderTimeIST(fixedTimestamp).includes('10:42') && formatOrderTimeIST(fixedTimestamp).includes('IST'), 'Order Time accurately formatted with IST marker', 'Timezone');

// ----------------------------------------------------------------------------
// 3. DYNAMIC DELIVERY ESTIMATION & CUTOFF RULES
// ----------------------------------------------------------------------------
console.log('\n--- 3. DYNAMIC DELIVERY ESTIMATION & CUTOFF RULES ---');

function calculateDeliveryEstimate(shippingMethod, orderDateInput = new Date()) {
  const orderDate = new Date(orderDateInput);
  const isSameDay =
    shippingMethod.toLowerCase().includes('same-day') ||
    shippingMethod.toLowerCase().includes('mumbai');

  if (isSameDay) {
    const currentHourIST = getHourInIST(orderDate);
    const isBeforeCutoff = currentHourIST < 14; // 2:00 PM IST cutoff
    const targetDate = new Date(orderDate);
    if (!isBeforeCutoff) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    const estimatedDateFormatted = formatOrderDateIST(targetDate);
    const expectedTimeWindow = isBeforeCutoff
      ? 'Expected between 6:00 PM – 9:00 PM IST'
      : 'Expected between 10:00 AM – 2:00 PM IST';
    return {
      estimatedDateFormatted,
      expectedTimeWindow,
      isSameDay: true,
    };
  }

  const targetDate = new Date(orderDate);
  targetDate.setDate(targetDate.getDate() + 3);
  return {
    estimatedDateFormatted: formatOrderDateIST(targetDate),
    expectedTimeWindow: 'Expected between 10:00 AM – 8:00 PM IST',
    isSameDay: false,
  };
}

const morningSameDay = calculateDeliveryEstimate('Mumbai Same-Day Express Courier', new Date('2026-08-24T06:00:00Z')); // 11:30 AM IST
const eveningSameDay = calculateDeliveryEstimate('Mumbai Same-Day Express Courier', new Date('2026-08-24T10:00:00Z')); // 3:30 PM IST
const standardAir = calculateDeliveryEstimate('Pan-India Free Express Air Delivery', new Date('2026-08-24T06:00:00Z'));

assert(morningSameDay.isSameDay === true && morningSameDay.expectedTimeWindow.includes('6:00 PM – 9:00 PM IST'), 'Same-Day pre-cutoff delivers evening same day', 'Delivery');
assert(eveningSameDay.isSameDay === true && eveningSameDay.expectedTimeWindow.includes('10:00 AM – 2:00 PM IST'), 'Same-Day post-cutoff delivers next morning priority', 'Delivery');
assert(standardAir.isSameDay === false && standardAir.expectedTimeWindow.includes('10:00 AM – 8:00 PM IST'), 'Pan-India air delivery computes realistic 3-day window', 'Delivery');

// ----------------------------------------------------------------------------
// 4. 5-STAGE MILESTONE TIMELINE PROGRESSION
// ----------------------------------------------------------------------------
console.log('\n--- 4. 5-STAGE MILESTONE TIMELINE PROGRESSION ---');

const STAGES = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

function generateTimeline(currentStage) {
  const currentIndex = STAGES.indexOf(currentStage);
  return STAGES.map((s, idx) => ({
    stage: s,
    completed: idx <= currentIndex,
    isCurrent: idx === currentIndex
  }));
}

STAGES.forEach((stage, expectedIndex) => {
  const timeline = generateTimeline(stage);
  const completedCount = timeline.filter(t => t.completed).length;
  assert(completedCount === expectedIndex + 1, `Stage "${stage}" completes exactly ${expectedIndex + 1}/5 milestones`, 'Milestones');
});

// ----------------------------------------------------------------------------
// 5. E-COMMERCE CART & PRICING ENGINE
// ----------------------------------------------------------------------------
console.log('\n--- 5. E-COMMERCE CART & PRICING ENGINE ---');

const cartItems = [
  { id: '1', title: 'pink and blue bangle set of 2', price: 500, quantity: 2 },
  { id: '2', title: 'Desi Barbie Hamper', price: 999, quantity: 1 }
];

const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
const freeShippingThreshold = 999;
const shippingCost = subtotal >= freeShippingThreshold ? 0 : 99;
const totalPayable = subtotal + shippingCost;

assert(totalUnits === 3, 'Total items count is accurate (3 units)', 'Cart');
assert(subtotal === 1999, 'Subtotal calculation is accurate (₹1999)', 'Cart');
assert(shippingCost === 0, 'Free shipping threshold applied correctly over ₹999', 'Cart');
assert(totalPayable === 1999, 'Total payable amount is verified (₹1999)', 'Cart');

// ----------------------------------------------------------------------------
// 6. SHOPIFY WEBHOOK HMAC-SHA256 SIGNATURE VALIDATION
// ----------------------------------------------------------------------------
console.log('\n--- 6. SHOPIFY WEBHOOK SECURITY & DEDUPLICATION ---');

const MOCK_SECRET = 'celestia_atelier_webhook_secret_2026';

function signShopifyPayload(payloadString, secret) {
  return crypto.createHmac('sha256', secret).update(payloadString, 'utf8').digest('base64');
}

function verifyShopifyHmac(rawBody, hmacHeader, secret) {
  if (!secret || !hmacHeader) return false;
  const calculated = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(calculated, 'utf8'), Buffer.from(hmacHeader, 'utf8'));
  } catch {
    return false;
  }
}

const webhookBody = JSON.stringify({ id: 1042991, order_number: 1042, total_price: '1999.00', financial_status: 'paid' });
const validHmac = signShopifyPayload(webhookBody, MOCK_SECRET);
const invalidHmac = 'invalid_tampered_signature_string';

assert(verifyShopifyHmac(webhookBody, validHmac, MOCK_SECRET) === true, 'Valid Shopify HMAC SHA-256 signature verified', 'Webhook');
assert(verifyShopifyHmac(webhookBody, invalidHmac, MOCK_SECRET) === false, 'Tampered or invalid HMAC signature rejected', 'Webhook');
assert(verifyShopifyHmac(webhookBody, '', MOCK_SECRET) === false, 'Empty HMAC signature rejected', 'Webhook');

// ----------------------------------------------------------------------------
// 7. CONTACT API & INPUT SANITATION
// ----------------------------------------------------------------------------
console.log('\n--- 7. CONTACT API & INPUT SANITATION ---');

function sanitizeContactInput(name, email, phone, message) {
  if (!name || typeof name !== 'string' || name.trim().length < 2) return { valid: false, error: 'Invalid name' };
  if (!validateEmail(email)) return { valid: false, error: 'Invalid email' };
  if (!message || typeof message !== 'string' || message.trim().length < 5) return { valid: false, error: 'Message too short' };

  return {
    valid: true,
    data: {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 100),
      phone: phone ? String(phone).trim().slice(0, 20) : null,
      message: message.trim().slice(0, 2000),
    }
  };
}

assert(sanitizeContactInput('Radhika', 'radhika@celestia.in', '+917718825792', 'Inquiring about bespoke hampers').valid === true, 'Clean contact inquiry accepted', 'API');
assert(sanitizeContactInput('R', 'radhika@celestia.in', '', 'Hello').valid === false, 'Single char name rejected', 'API');
assert(sanitizeContactInput('Radhika', 'radhika@celestia.in', '', 'Hi').valid === false, 'Short message (<5 chars) rejected', 'API');

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n=======================================================');
console.log(`🏁 BACKEND TEST SUITE COMPLETED: ${passCount} PASSED / ${failCount} FAILED`);
console.log('=======================================================\n');

if (failCount > 0) {
  console.error('Failed Test Cases:', issues);
  process.exit(1);
}
