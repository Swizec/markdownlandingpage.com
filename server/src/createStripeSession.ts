import { APIGatewayEvent } from "aws-lambda";
import { getItem } from "./dynamodb";

const stripeLib = require("stripe");

type APIResponse = {
    statusCode: number;
    headers: any;
    body: string;
};

const headers = {
    // In a real project, you might want to lock this to a particular domain or two
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "access-control-allow-methods": "GET"
};

export const handler = async (event: APIGatewayEvent): Promise<APIResponse> => {
    // creates new stripe checkout session
    // following docs here: https://stripe.com/docs/payments/checkout/one-time

    // TODO: use secrets manager for secret key
    const stripe = stripeLib(process.env.STRIPE_KEY!);

    const userId = event.pathParameters
        ? decodeURIComponent(event.pathParameters.userId)
        : null;
    const pageId = event.pathParameters
        ? decodeURIComponent(event.pathParameters.pageId)
        : null;
    const callbackDomain = event.queryStringParameters
        ? event.queryStringParameters.callback_domain
        : null;

    if (!userId || !pageId || !callbackDomain) {
        return {
            statusCode: 400,
            headers,
            body: "You need to provide userId, pageId, and callbackDomain"
        };
    }

    const page = await getItem({
        TableName: process.env.PAGE_TABLE!,
        Key: { userId, pageId }
    });

    if (!page.Item) {
        return {
            statusCode: 404,
            headers,
            body: "That page does not exist"
        };
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                name: "Landing Page",
                description: `Your hosted landing page for ${page.Item.pageName}`,
                images: [],
                amount: 500,
                currency: "usd",
                quantity: 1
            }
        ],
        success_url: `${callbackDomain}/${pageId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${callbackDomain}/${pageId}`
    });

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify(session)
    };
};
