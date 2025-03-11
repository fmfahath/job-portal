import { Webhook } from "svix";
import userModel from "../models/userModel.js";

export const clerkWebhooks = async (req, res, next) => {
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
                try {
                    const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        image: data.image_url,
                        resume: ''
                    }

                    await userModel.create(userData)
                    res.json({ success: true, message: "User created successfully" })

                } catch (error) {
                    console.log("webhooks Error (user create): ", error.message);
                    res.json({ success: false, message: error.message })
                }

                break;
            }

            case 'user.updated': {
                try {
                    const userData = {
                        email: data.email_addresses[0].email_address,
                        name: data.first_name + " " + data.last_name,
                        image: data.image_url,
                    }

                    await userModel.findByIdAndUpdate(data.id, userData)
                    res.json({ success: true, message: "User details updated successfully" })

                } catch (error) {
                    console.log("webhooks Error (user update): ", error.message);
                    res.json({ success: false, message: error.message })
                }

                break;
            }
            case 'user.deleted': {

                try {
                    await userModel.findByIdAndDelete(data.id)
                    res.json({ success: true, message: "User deleted successfully" })

                } catch (error) {
                    console.log("webhooks Error (user delete): ", error.message);
                    res.json({ success: false, message: error.message })
                }

                break;
            }

            default:
                break;
        }


    } catch (error) {
        console.log("webhooks Error: ", error.message);

        res.status(500).json({ success: false, message: "webhooks error" })
    }
}