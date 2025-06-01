const stripe = require('stripe')(process.env.STRIPE_API_KEY);

class PaymentControllers {
    static async createStripePayment(req, res) {
        try {
            const payment = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: 'usd',
                receipt_email: req.body.email,
                automatic_payment_methods: { enabled: true }
            });

            res.status(200).json({ status: true, clientSecret: payment.client_secret });

        } catch (error) {
            res.status(500).json({ status: false, clientSecret: null })
        }
    }
}


module.exports = PaymentControllers
