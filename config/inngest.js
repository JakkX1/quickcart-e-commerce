import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// inngest Function to save user data to a database

export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    }
    { event: 'clerk/user.created'}
    async ({event}) => {
        const { id, first_name, last_name, email_adresses, image_url } = event.data
        const userData = [
            _id:id,
            email:email_adresses[0].email_adress,
            name: first_name + ' ' + last_name
            imageUrl:image_url
        ]
        await connectDB()
        await User.create(userData) // USER IS CEREATED HERE. MONGO DB DATA BASE.
    }
)

// FUNCTION TO SYNC THE USER DATA AND HE CHANGES ANY DETAILS SO IT UPDATES.

// ingest function to update user data in data base 

export const syncUserUpdatation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    }, 
        { event: 'clerk/user.updated'},
    async ({event}) => {
         const { id, first_name, last_name, email_adresses, image_url } = event.data
        const userData = [
            _id:id,
            email:email_adresses[0].email_adress,
            name: first_name + ' ' + last_name
            imageUrl:image_url
        ]
        await connectDB()
        await User.findByIdAndUpdate(id,userData)
    }
)

//inngest function to delete user from the database. 
export const syncUserDeletion = inngest.createFunction(
    {
        id:'delete-user-with-clerk'
    },
    {event:'clerk/user.deleted'}
    async ({event}) => {
        const {id} = event.data

        await connectDB()
        await User.findByIdAndUpdate(id)
    }
)