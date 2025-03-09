import { Webhook } from "svix";
import userModel from "../models/userModel.js";

export const clerkWebhooks = async (req, res) => {
    try {
        //create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //varifiying headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        //getting data from request body
        const { data, type } = req.body;

        //switch case for different events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }

                await userModel.create(userData)
                res.json({})
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }

                await userModel.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted': {

                await userModel.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default:
                break;
        }



    } catch (error) {
        res.json({ success: false, message: "webhooks error" })
    }
}