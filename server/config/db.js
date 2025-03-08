import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'))

        await mongoose.connect(`${process.env.MONGODB_URI}/job-portal-db`);
    } catch (error) {
        console.log("Database Error: ", error.messag)
    }
}

export default connectDB;