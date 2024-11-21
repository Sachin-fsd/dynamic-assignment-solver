import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

export async function POST(req) {
    try {
        const body = await req.json(); // Parse the request body
        const { courseId, amount } = body;

        if (!amount) {
            return new Response(
                JSON.stringify({ error: 'Amount is required.' }),
                { status: 400 }
            );
        }

        const options = {
            amount: amount * 100, // Convert to smallest currency unit (e.g., paise)
            currency: "INR",
            receipt: `order_rcptid_${new Date().getTime()}`,
            payment_capture: 1, // Automatically capture the payment
        };

        const order = await razorpayInstance.orders.create(options);

        // Return the order ID to the client
        return new Response(JSON.stringify({ id: order.id }), { status: 200 });
    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({ error: 'Failed to create order', details: error.message }),
            { status: 500 }
        );
    }
}
