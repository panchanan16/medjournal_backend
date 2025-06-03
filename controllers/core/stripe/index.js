const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const Razorpay = require('razorpay');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

class PaymentControllers {
    static async createStripePayment(req, res) {
        try {
            const payment = await stripe.paymentIntents.create({
                amount: parseInt(req.body.amount) * 100,
                currency: 'usd',
                receipt_email: req.body.email,
                automatic_payment_methods: { enabled: true }
            });

            res.status(200).json({ status: true, clientSecret: payment.client_secret });

        } catch (error) {
            res.status(500).json({ status: false, clientSecret: null, message: 'Someting went Wrong While Creating Payments!' })
        }
    }


    static async createRazorpayPayments(req, res) {
        try {
            const instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY_ID, key_secret: process.env.RAZORPAY_API_KEY })
            const options = {
                amount: parseInt(req.body.amount) * 100,
                currency: "INR",
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err)
                    throw err
                }

                res.status(201).json({ status: true, order })
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: false, order: null, message: 'Something went while creating payment!' })
        }
    }


    static async razorPaymentVerify(req, res) {
        try {
            const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
            const payStatus = validatePaymentVerification(
                { order_id: orderId, payment_id: razorpayPaymentId },
                razorpaySignature,
                process.env.RAZORPAY_API_KEY
            );

            if (payStatus) {
                return res.status(200).json({ status: true, data: payStatus })
            }

            return res.status(403).json({ status: false, data: false })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: false, data: false })
        }
    }
}


module.exports = PaymentControllers
