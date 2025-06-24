import mongoose from 'mongoose'

const connectDB = async()=>{
    try {
           const  connectionInstance = await mongoose.connect('mongodb://127.0.0.1:27017/bloodzy')
            console.log(`MongoDB is connected ! DB HOST : ${connectionInstance.connection.host}`);

    } catch (error) {
            console.log('MongoDB connection error', error);
            process.exit(1)           
    }    
}
export default connectDB;
