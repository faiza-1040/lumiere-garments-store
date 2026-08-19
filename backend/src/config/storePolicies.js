// Central store policy knowledge base.
// The AI assistant is instructed to ONLY answer policy questions using this data —
// never from its own training knowledge. Edit these values to match your real policies.

const policies = {
  shipping: {
    title: 'Shipping Policy',
    content: `We deliver across Pakistan. Standard delivery takes 3–5 business days in major cities (Lahore, Karachi, Islamabad) and 5–7 business days elsewhere. Shipping is free on orders over PKR 5,000; otherwise a flat PKR 200 shipping fee applies. We currently do not offer international shipping.`,
  },
  returns: {
    title: 'Return Policy',
    content: `Items can be returned within 7 days of delivery if unused, unwashed, and with original tags attached. Sale/clearance items are final sale and not eligible for return. Refunds are issued to the original payment method within 5–7 business days of us receiving the returned item.`,
  },
  exchange: {
    title: 'Exchange Policy',
    content: `We offer free size exchanges within 7 days of delivery, subject to stock availability. To request an exchange, contact support with your order ID and desired size. Exchanges are not available on sale/clearance items.`,
  },
  paymentMethods: {
    title: 'Payment Methods',
    content: `We accept Cash on Delivery (COD) across Pakistan, as well as credit/debit card payments and bank transfers for online orders.`,
  },
  cod: {
    title: 'Cash on Delivery',
    content: `Cash on Delivery is available on all orders within Pakistan with no extra charge. You pay the courier in cash when your order arrives.`,
  },
  sizeGuide: {
    title: 'Size Guide',
    content: `Our sizes run true to standard Pakistani/Asian sizing: XS (32), S (34-36), M (38-40), L (42-44), XL (46-48), XXL (50+). Size charts with exact chest/waist/hip measurements in inches are available on each product page. If a customer gives height/weight, treat any size suggestion as an estimate only, not a guarantee — always recommend checking the product's specific size chart.`,
  },
  fabricCare: {
    title: 'Fabric Care',
    content: `Most cotton items should be machine washed cold and air dried to prevent shrinkage. Delicate fabrics (silk, chiffon, embellished pieces) should be dry cleaned only. Specific care instructions are listed on each product's label and product page.`,
  },
  warranty: {
    title: 'Warranty',
    content: `We do not offer a general product warranty. However, if an item arrives damaged or defective, contact support within 48 hours of delivery for a free replacement or refund.`,
  },
  giftCards: {
    title: 'Gift Cards',
    content: `We do not currently offer gift cards.`,
  },
  loyaltyProgram: {
    title: 'Loyalty & Membership',
    content: `We do not currently have a loyalty points or membership program.`,
  },
  storeLocations: {
    title: 'Store Locations',
    content: `We are an online-only store and do not currently operate physical retail locations.`,
  },
  contact: {
    title: 'Contact Information',
    content: `For support, customers can reach us via the email address listed in the site footer, or through this chat assistant. We aim to respond within 24 hours.`,
  },
  businessHours: {
    title: 'Business Hours',
    content: `Our online store is open 24/7. Customer support responds Monday–Saturday, 10am–6pm PKT.`,
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    content: `We collect only the information needed to process orders (name, address, contact info, payment details) and do not sell customer data to third parties. Full privacy policy details are available on our Privacy Policy page.`,
  },
  termsAndConditions: {
    title: 'Terms and Conditions',
    content: `By placing an order, customers agree to our stated pricing, shipping, return, and exchange terms as described in this policy set. Full terms are available on our Terms & Conditions page.`,
  },
};

// Lookup helper: exact key match first, then fuzzy match on title/content
function getPolicy(topicKey) {
  if (!topicKey) return null;
  const normalized = topicKey.toLowerCase().replace(/[^a-z]/g, '');

  // Try exact key match
  const exactKey = Object.keys(policies).find(
    (k) => k.toLowerCase() === normalized
  );
  if (exactKey) return policies[exactKey];

  // Try fuzzy match against key names and titles
  const fuzzyKey = Object.keys(policies).find((k) => {
    const title = policies[k].title.toLowerCase();
    return normalized.includes(k.toLowerCase()) || title.replace(/[^a-z]/g, '').includes(normalized);
  });
  if (fuzzyKey) return policies[fuzzyKey];

  return null;
}

function listPolicyTopics() {
  return Object.entries(policies).map(([key, val]) => ({ key, title: val.title }));
}

module.exports = { policies, getPolicy, listPolicyTopics };