// import asyncHandler from 'express-async-handler';
// import crypto from 'crypto';
// import Razorpay from 'razorpay';
// import Order from '../models/orderModel.js';
// import Product from '../models/Product.js'; // Ensure Product is imported if needed elsewhere
// import Category from '../models/categoryModel.js'; // Ensure Category is imported if needed elsewhere

// // Initialize Razorpay instance from environment variables
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error('No order items');
//   } else {
//     // This mapping transforms the frontend data to match the backend schema
//     const transformedOrderItems = orderItems.map(item => ({
//       name: item.title,
//        slug: item.slug,           // Use 'title' from cart item for 'name'
//       qty: item.qty,
//       image: item.images[0].url, // Use the first image's URL for 'image'
//       price: item.price,
//       product: item._id,         // Link to the original product document
//     }));

//     // --- Server-side Price Calculation ---
//     const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    
//     // You can change this value to manage your shipping cost
//     const SHIPPING_COST = 50; 
//     const shippingPrice = itemsPrice > 100 ? 0 : SHIPPING_COST;
    
//     const taxPrice = 0; // Tax is now removed
//     const totalPrice = itemsPrice + shippingPrice;

//     const order = new Order({
//       orderItems: transformedOrderItems, // Use the new, corrected array
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });
    
//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   }
// });

// // @desc    Get order by ID
// // @route   GET /api/orders/:id
// // @access  Private
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate('user', 'name email');
//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

// // @desc    Get logged in user's orders
// // @route   GET /api/orders/myorders
// // @access  Private
// const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.json(orders);
// });

// // @desc    Get all orders (Admin)
// // @route   GET /api/orders
// // @access  Private/Admin
// const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({}).populate('user', 'id name');
//   res.json(orders);
// });

// // @desc    Update order to delivered (Admin)
// // @route   PUT /api/orders/:id/deliver
// // @access  Private/Admin
// const updateOrderToDelivered = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

// // @desc    Create Razorpay order
// // @route   POST /api/orders/:id/create-razorpay-order
// // @access  Private
// const createRazorpayOrder = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     const options = {
//       amount: Math.round(order.totalPrice * 100), // Amount in paise
//       currency: 'INR',
//       receipt: order._id.toString(),
//     };
//     const razorpayOrder = await razorpay.orders.create(options);
//     if (!razorpayOrder) {
//       res.status(400);
//       throw new Error('Could not create Razorpay order');
//     }
//     res.json({ id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

// // @desc    Verify Razorpay payment and update order
// // @route   POST /api/orders/:id/verify-payment
// // @access  Private
// const verifyRazorpayPayment = asyncHandler(async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     const body = razorpay_order_id + '|' + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     if (expectedSignature === razorpay_signature) {
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentResult = {
//         id: razorpay_payment_id,
//         status: 'completed',
//         update_time: new Date().toISOString(),
//         email_address: req.user.email,
//       };
//       const updatedOrder = await order.save();
//       res.json({ message: 'Payment successful', order: updatedOrder });
//     } else {
//       res.status(400);
//       throw new Error('Payment verification failed. Invalid signature.');
//     }
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

// export {
//   addOrderItems,
//   getOrderById,
//   getMyOrders,
//   getOrders,
//   updateOrderToDelivered,
//   createRazorpayOrder,
//   verifyRazorpayPayment,
// };

import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/orderModel.js';
import Setting from '../models/settingModel.js'; // Import the settings model

// Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // --- Secure Server-side Price Calculation ---
    const settings = await Setting.findOne();
    if (!settings) {
      res.status(500);
      throw new Error('Site settings not found. Cannot calculate shipping.');
    }

    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > settings.freeShippingThreshold ? 0 : settings.shippingCharge;
    const taxPrice = 0; // Tax is 0
    const totalPrice = itemsPrice + shippingPrice;

    const order = new Order({
      orderItems: orderItems.map(x => ({
        name: x.title,
        slug: x.slug,
        qty: x.qty,
        image: x.images[0].url,
        price: x.price,
        product: x._id,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order to delivered (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `admin-${Date.now()}`,
      status: 'marked-paid',
      update_time: new Date().toISOString(),
      email_address: order.user?.email || 'admin-marked',
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create Razorpay order
// @route   POST /api/orders/:id/create-razorpay-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: 'INR',
      receipt: order._id.toString(),
    };
    const razorpayOrder = await razorpay.orders.create(options);
    if (!razorpayOrder) {
      res.status(400);
      throw new Error('Could not create Razorpay order');
    }
    res.json({ id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Verify Razorpay payment and update order
// @route   POST /api/orders/:id/verify-payment
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findById(req.params.id);
  if (order) {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    if (expectedSignature === razorpay_signature) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = { id: razorpay_payment_id, status: 'completed' };
      const updatedOrder = await order.save();
      res.json({ message: 'Payment successful', order: updatedOrder });
    } else {
      res.status(400);
      throw new Error('Payment verification failed. Invalid signature.');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  createRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderToPaid,

};