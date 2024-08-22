import Bundle from "../models/bundleSchema";
import Discount from "../models/discountModel";
import Product from "../models/productSchema";

export const removeDiscount = async (discountId: string) => {
    try {
        const discount = await Discount.findById(discountId);
        if (discount && discount.isAppliedDiscount) {
            discount.isAppliedDiscount = false;

            // Revert products to original price
            if (discount.products?.length) {
                const productUpdates = discount.products.map(async (productId) => {
                    const product = await Product.findById(productId);
                    if (product) {
                        product.adminDiscountedPrice = undefined;
                        product.adminDiscountApplied = undefined;
                        console.log(`Removed discount from product: ${product.name}`);
                        await product.save();
                    }
                });
                await Promise.all(productUpdates);
            }

            // Revert bundles to original price
            if (discount.bundles?.length) {
                const bundleUpdates = discount.bundles.map(async (bundleId) => {
                    const bundle = await Bundle.findById(bundleId);
                    if (bundle) {
                        bundle.adminDiscountedPrice = undefined;
                        bundle.adminDiscountApplied = undefined;
                        console.log(`Removed discount from bundle: ${bundle.name}`);
                        await bundle.save();
                    }
                });
                await Promise.all(bundleUpdates);
            }

            await discount.save();
            console.log(`Discount with ID ${discountId} has been successfully removed.`);
        } else {
            console.log(`No active discount found with ID ${discountId} or it has already been removed.`);
        }
    } catch (error) {
        console.error(`Failed to remove discount with ID ${discountId}:`, error);
    }
};
