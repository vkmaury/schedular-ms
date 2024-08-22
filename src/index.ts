import express, { Application } from 'express';
import mongoose from 'mongoose';
import discountRoutes from './routes/discountRoutes';
// import { startSaleScheduler } from '../src/controllers/discountController'
import { startDiscountScheduler } from '../src/controllers/discountController'
import dotenv from 'dotenv';
// import { consumer } from './config/kafka-consume';
// import { startCronJobs } from './utils/cronJobs';
// import { applyDiscountsController } from './controllers/discountController';


dotenv.config();

const app: Application = express();
const PORT: number = 3009;

// Middleware
app.use(express.json());
// app.post('/apply-discounts', applyDiscountsController);
// app.post('/remove-expired-discounts', removeExpirdDiscountsController);

// MongoDB Connection
const mongoURI: string = 'mongodb+srv://microservice-database:microservice-database@microservice-database.wsomfbj.mongodb.net/?retryWrites=true&w=majority&appName=microservice-database';

mongoose.connect(mongoURI).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// consumer.on('error', (error) => {
//   console.error('Kafka consumer error:', error);
// });

// Routes
app.use('/api/v1', discountRoutes);
// app.use('/api/v1', productRoutes);
// app.use('/api/v1', CartRoutes);
// app.use('/api/v1', bundleRoutes);
// app.use('/api/v1', userHomePageRoutes);
// app.use('/api/v1', categoryRoutes);
// app.use('/api/v1', wishlistRoutes);
// app.use('/api/v1', saleRoutes);


startDiscountScheduler()
// startSaleScheduler()
app.listen(PORT, () => {
    console.log(`Scheduler MS running on port ${PORT}`);
});








