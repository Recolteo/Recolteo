import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const ASSOCIATION_ANNUAL_PRICE_ID = process.env.STRIPE_ASSOCIATION_ANNUAL_PRICE_ID!;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const TRIAL_DAYS = 183;
export const COMMISSION_RATE = 0.1;
