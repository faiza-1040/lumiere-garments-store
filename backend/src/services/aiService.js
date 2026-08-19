const Groq = require('groq-sdk');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { getPolicy, listPolicyTopics } = require('../config/storePolicies');

const MODEL_NAME = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in .env');
  return new Groq({ apiKey });
}

// ---------- Tool (function) definitions, OpenAI-style ----------

const tools = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description:
        'Search the store catalog for products matching filters like keyword, gender, category, color, size, price range, or sale status. Always call this instead of guessing product info.',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'Free text search, e.g. "hoodie"' },
          gender: { type: 'string', enum: ['Men', 'Women', 'Kids'] },
          category: { type: 'string', description: 'e.g. "Jackets", "Dresses"' },
          color: { type: 'string' },
          size: { type: 'string' },
          minPrice: { type: 'number' },
          maxPrice: { type: 'number' },
          sale: { type: 'boolean', description: 'True to only show items on sale' },
          sortBy: {
            type: 'string',
            enum: ['priceAsc', 'priceDesc', 'rating', 'newest'],
          },
          limit: { type: 'number', description: 'Max results, default 8' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getProductDetails',
      description:
        'Get full details for one specific product by ID or name, including description, images, sizes, colors, and stock count. Use this to check stock or size/color availability.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          productName: { type: 'string' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'addToCart',
      description:
        'Add a product to the customer\'s shopping cart. Only call this after the customer clearly confirms they want to add a specific product to cart (e.g. "add it to cart", "add the second one", "yes add that hoodie"). Requires a productId from a previous searchProducts or getProductDetails call.',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'The product _id to add' },
        },
        required: ['productId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'addToWishlist',
      description:
        'Add a product to the customer\'s wishlist/favourites. Only call after the customer confirms (e.g. "save that for later", "add to my favourites").',
      parameters: {
        type: 'object',
        properties: {
          productId: { type: 'string', description: 'The product _id to add' },
        },
        required: ['productId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'validateCoupon',
      description: 'Check whether a discount coupon code is valid and calculate the discount for a given order value.',
      parameters: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'The coupon code, e.g. SAVE20' },
          orderValue: { type: 'number', description: 'Current order subtotal in PKR' },
        },
        required: ['code'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'trackOrder',
      description: 'Look up the status of an order by its order ID.',
      parameters: {
        type: 'object',
        properties: {
          orderId: { type: 'string', description: 'The MongoDB order _id' },
        },
        required: ['orderId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getStorePolicy',
      description:
        'Get the exact, official store policy text on a specific topic — shipping, returns, exchange, payment methods, cash on delivery, size guide, fabric care, warranty, gift cards, loyalty program, store locations, contact info, business hours, privacy policy, or terms and conditions. ALWAYS call this for any question about store policy, sizing rules, delivery, returns, exchanges, payment, or similar — never answer these from memory.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description:
              'One of: shipping, returns, exchange, paymentMethods, cod, sizeGuide, fabricCare, warranty, giftCards, loyaltyProgram, storeLocations, contact, businessHours, privacyPolicy, termsAndConditions',
          },
        },
        required: ['topic'],
      },
    },
  },
];

const SYSTEM_PROMPT = `
You are the AI Shopping Assistant for Lumière, an online fashion store selling Men's, Women's, and Kids' clothing.

CRITICAL RULE — POLICY QUESTIONS:
For ANY question about shipping, delivery times, returns, exchanges, payment methods, cash on delivery, size guide/sizing rules, fabric care, warranty, gift cards, loyalty programs, store locations, contact info, business hours, privacy policy, or terms and conditions — you MUST call getStorePolicy first before answering.

- If getStorePolicy returns found:true, answer using ONLY that returned content. Do not add, guess, or supplement details from your own knowledge, even if you think you know more.
- If getStorePolicy returns found:false, that topic is not in our official records. In that case, you may answer helpfully using your own general knowledge, BUT you must clearly say this is general guidance and not officially confirmed store policy, and recommend the customer contact support to confirm before relying on it. Never present a found:false answer as if it were official store policy.

CRITICAL RULE — PRODUCT QUESTIONS:
NEVER invent product names, prices, stock, coupons, or order info. Always call the right function to get real data first.
Before calling addToCart or addToWishlist, you must already know the product's real _id from a prior searchProducts or getProductDetails call in this conversation. Never guess an ID.
Only call addToCart or addToWishlist when the customer has clearly asked for that action, not just when browsing.
If a search returns no results, say so honestly and suggest broadening the search.

OTHER RULES:
- You are a knowledgeable, friendly, concise fashion sales assistant.
- When recommending sizes based on height/weight, make clear it's an estimate, not a guarantee, and point to getStorePolicy's sizeGuide for exact measurements.
- Keep replies short and conversational for a chat widget. No markdown tables.
- If asked about things unrelated to this store, politely steer back to shopping help.
`;

// ---------- Formatters ----------

function formatProduct(p, detailed = false) {
  const base = {
    id: p._id.toString(),
    name: p.name,
    brand: p.brand,
    category: p.category,
    gender: p.gender,
    price: p.price,
    discountPrice: p.discountPrice,
    isSale: p.isSale,
    rating: p.rating,
    numReviews: p.numReviews,
    image: p.image,
    sizes: p.sizes,
    colors: p.colors,
    countInStock: p.countInStock,
  };
  if (detailed) {
    base.description = p.description;
    base.images = p.images;
    base.modelSize = p.modelSize;
  }
  return base;
}

// ---------- Backend function execution ----------

async function searchProducts(args = {}) {
  const { keyword, gender, category, minPrice, maxPrice, color, size, sale, sortBy, limit } = args;
  const query = {};

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
    ];
  }
  if (gender) query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
  if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  if (color) query.colors = { $elemMatch: { $regex: new RegExp(`^${color}$`, 'i') } };
  if (size) query.sizes = { $elemMatch: { $regex: new RegExp(`^${size}$`, 'i') } };
  if (sale) query.isSale = true;
  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) query.price.$gte = Number(minPrice);
    if (maxPrice != null) query.price.$lte = Number(maxPrice);
  }

  let sort = { createdAt: -1 };
  if (sortBy === 'priceAsc') sort = { price: 1 };
  if (sortBy === 'priceDesc') sort = { price: -1 };
  if (sortBy === 'rating') sort = { rating: -1 };

  const products = await Product.find(query)
    .sort(sort)
    .limit(Math.min(Number(limit) || 8, 12));

  return { count: products.length, products: products.map((p) => formatProduct(p)) };
}

async function getProductDetails(args = {}) {
  const { productId, productName } = args;
  let product = null;

  if (productId) {
    product = await Product.findById(productId).catch(() => null);
  }
  if (!product && productName) {
    product = await Product.findOne({ name: { $regex: productName, $options: 'i' } });
  }
  if (!product) return { found: false };
  return { found: true, product: formatProduct(product, true) };
}

async function addToCart(args = {}) {
  const { productId } = args;
  if (!productId) return { success: false, message: 'productId is required' };

  const product = await Product.findById(productId).catch(() => null);
  if (!product) return { success: false, message: 'Product not found' };
  if (product.countInStock <= 0) {
    return { success: false, message: `${product.name} is currently out of stock` };
  }

  return {
    success: true,
    message: `Added ${product.name} to cart`,
    clientAction: {
      type: 'ADD_TO_CART',
      product: formatProduct(product),
    },
  };
}

async function addToWishlist(args = {}) {
  const { productId } = args;
  if (!productId) return { success: false, message: 'productId is required' };

  const product = await Product.findById(productId).catch(() => null);
  if (!product) return { success: false, message: 'Product not found' };

  return {
    success: true,
    message: `Added ${product.name} to wishlist`,
    clientAction: {
      type: 'ADD_TO_WISHLIST',
      product: formatProduct(product, true),
    },
  };
}

async function validateCoupon(args = {}) {
  const { code, orderValue = 0 } = args;
  if (!code) return { valid: false, message: 'Coupon code is required' };

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return { valid: false, message: 'Invalid or inactive coupon code' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: 'This coupon has expired' };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'This coupon has reached its usage limit' };
  }
  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    return {
      valid: false,
      message: `This coupon requires a minimum order of PKR ${coupon.minOrderValue}`,
    };
  }

  const discount =
    coupon.type === 'percentage' ? (orderValue * coupon.value) / 100 : coupon.value;

  return {
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: Math.min(discount, orderValue),
    description: coupon.description,
  };
}

async function trackOrder(args = {}) {
  const { orderId } = args;
  if (!orderId) return { found: false, message: 'orderId is required' };

  const order = await Order.findById(orderId).catch(() => null);
  if (!order) return { found: false, message: 'No order found with that ID' };

  return {
    found: true,
    orderId: order._id.toString(),
    status: order.status,
    isPaid: order.isPaid,
    isDelivered: order.isDelivered,
    totalPrice: order.totalPrice,
    createdAt: order.createdAt,
    itemCount: order.orderItems.length,
  };
}

async function getStorePolicyFn(args = {}) {
  const { topic } = args;
  const policy = getPolicy(topic);
  if (!policy) {
    return {
      found: false,
      availableTopics: listPolicyTopics(),
      message: 'No policy found for that topic. Choose from the availableTopics list.',
    };
  }
  return { found: true, title: policy.title, content: policy.content };
}

async function executeFunction(name, args) {
  switch (name) {
    case 'searchProducts':
      return await searchProducts(args);
    case 'getProductDetails':
      return await getProductDetails(args);
    case 'addToCart':
      return await addToCart(args);
    case 'addToWishlist':
      return await addToWishlist(args);
    case 'validateCoupon':
      return await validateCoupon(args);
    case 'trackOrder':
      return await trackOrder(args);
    case 'getStorePolicy':
      return await getStorePolicyFn(args);
    default:
      return { error: `Unknown function: ${name}` };
  }
}

// ---------- Main chat orchestration ----------

async function chatWithAssistant(messages) {
  const groq = getClient();

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text,
    })),
  ];

  let lastProducts = [];
  let clientActions = [];
  let guard = 0;

  while (guard < 4) {
    guard++;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: MODEL_NAME,
        messages: chatMessages,
        tools,
        tool_choice: 'auto',
        temperature: 0.4,
      });
    } catch (err) {
      // Model produced a malformed tool call — retry once without forcing tools
      if (err?.error?.code === 'tool_use_failed' && guard === 1) {
        completion = await groq.chat.completions.create({
          model: MODEL_NAME,
          messages: chatMessages,
          temperature: 0.4,
        });
      } else {
        throw err;
      }
    }

    const choice = completion.choices[0];
    const msg = choice.message;

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      chatMessages.push({
        role: 'assistant',
        content: msg.content || null,
        tool_calls: msg.tool_calls,
      });

      for (const call of msg.tool_calls) {
        let args = {};
        try {
          args = JSON.parse(call.function.arguments || '{}');
        } catch {
          args = {};
        }
        const output = await executeFunction(call.function.name, args);

        if (output?.products) lastProducts = output.products;
        if (output?.product) lastProducts = [output.product];
        if (output?.clientAction) clientActions.push(output.clientAction);

        chatMessages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(output),
        });
      }
      continue;
    }

    return { reply: msg.content || '', products: lastProducts, actions: clientActions };
  }

  return {
    reply: "Sorry, I'm having trouble completing that request. Could you rephrase?",
    products: lastProducts,
    actions: clientActions,
  };
}

module.exports = { chatWithAssistant };