// controllers/paymentController.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        // Create a payment intent using Stripe SDK
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: currency,
        });
        // Send the client secret back to the client
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Payment Intent creation failed' });
    }
};

module.exports = {
    createPaymentIntent,
};
