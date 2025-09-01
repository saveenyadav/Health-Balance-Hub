import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected') //* if promise is fulfilled
    } catch (err) {
       console.error('DB Connection Error;', err); 
       process.exit(1);  
    }
};
export default connectDB;