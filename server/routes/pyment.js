import express from "express"
import Razorpay from "razorpay"
import crypto from "crypto"

const PymentRouter = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})
PymentRouter.post("/create-order", async (req, res) => {
   console.log(process.env.RAZORPAY_KEY_ID,process.env.RAZORPAY_KEY_SECRET)
  try {
    const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;
    console.log(amount);

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      status: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ status: false, error: 'Failed to create order' });
  }
});
PymentRouter.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  // Generate expected signature
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Signature is valid
    res.json({ status: true, message: 'Payment verified successfully' });
  } else {
    // Signature mismatch
    res.status(400).json({ status: false, message: 'Invalid signature' });
  }
});

export default PymentRouter