import { Router } from "express";
import stripe from "stripe"
import dotenv from "dotenv";
dotenv.config();
const stripeRouter = Router();

stripeRouter.get("/checkout-session", async (req, res) => {
try {
    

  if(!process.env.STRIPE_KEY){
    throw Error("No Stripe API Key")
  }  
 const session = await stripe(process.env.STRIPE_KEY).checkout.sessions.create({
   line_items : [{
    price:'price_1RDWDiQ3qAEn3pjxWEA3AFby',
  
    quantity:1
   }], 
    payment_method_types:["card"],
    mode : 'payment',
    success_url : 'http://localhost:5173/'

 })
 
  return res.send(session)
} 
  catch (err) {
    return res.json({error : err})
  }
});
export default stripeRouter;
