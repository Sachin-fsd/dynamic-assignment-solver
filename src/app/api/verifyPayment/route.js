import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayInstance = new Razorpay({  // create order instance
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});


export async function POST(req) {
    const body = await req.json();  // parsing is very necessar without parsing req.body = ReadableStream { locked: false, state: 'readable', supportsBYOB: false }
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    // Validate the payment using the Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET; // Razorpay Key Secret

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment verified, mark the order as paid in your database
        // await MarkOrderAsPaid(razorpay_order_id, razorpay_payment_id);
        return new Response(
            JSON.stringify({ success: true }),
            { status: 200 }
        );
    } else {
        return new Response(
            JSON.stringify({ error: 'Invalid Payment' }),
            { status: 400 }
        );
    }
}
