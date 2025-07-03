import mongoose from 'mongoose' 
import { buffer } from 'stream/consumers'

let cached = global.mongoose

if (!catched) { 
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(){
    if(cached.conn ){
        return cached.conn

    } if (!cached.promise){
        const opts = {
            bufferCommands: false
        }

        cached.promise = mongoose.connect('${process.env.MONGODB_URI}/quickcart', opts). then(mongoose => {
            return mongoose
        })
     
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB