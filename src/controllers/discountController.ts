import cron from 'node-cron';
import moment from 'moment';
import Discount from '../models/discountModel';
import { applyDiscount } from '../services/apply.discount';
import { removeDiscount } from '../services/removeDiscount'

export const startDiscountScheduler = () => {
    cron.schedule('* * * * *', async () => {  // Runs every minute
        try {
            const now = moment().startOf('minute');
            console.log('Checking for discounts to apply at:', now.toISOString());
  
            // Find discounts that need to be applied
            const discountsToApply = await Discount.find({

                startDate: { $lte: now.toDate() },
                // isAppliedDiscount: false,
                isActive:true,
            });

            console.log('Discounts to apply:', discountsToApply);

            // Apply each discount
            for (const discount of discountsToApply) {
                if (moment(discount.startDate).isSame(now)) {
                    console.log(`Applying discount with ID ${discount.id}`);
                    await applyDiscount(discount.id.toString());
                }
            }

             // Find discounts that need to be removed
             const discountsToRemove = await Discount.find({
              endDate: { $lte: new Date() },
              // isAppliedDiscount: true,
              isActive:true,
          });

          console.log('Discounts to remove:', discountsToRemove);

          // Remove each discount
          for (const discount of discountsToRemove) {
            if(moment(discount.endDate).isSame(now)){
              console.log(`Removing discount with ID ${discount.id}`);
              await removeDiscount(discount.id.toString());
            }
          }
        } catch (error) {
            console.error('Error occurred while applying discounts:', error);
        }
    });
};
