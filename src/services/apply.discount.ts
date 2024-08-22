import Bundle from '../models/bundleSchema'
import Discount from '../models/discountModel'
import Product from '../models/productSchema'

export const applyDiscount = async (discountId: string) => {
    try {
        const discount = await Discount.findById(discountId)
        if (discount && !discount.isAppliedDiscount) {
            discount.isAppliedDiscount = true

            // Apply discount to products
            if (discount.products?.length) {
                const productUpdates = discount.products.map(async (productId) => {
                    const product = await Product.findById(productId)
                    if (product) {
                        let discountedPrice
                        if (discount.type === 'MRP') {
                            discountedPrice = product.MRP - (product.MRP * discount.adminDiscount) / 100
                            product.adminDiscountedPrice = discountedPrice
                            console.log(`Applying MRP discount to product: ${product.name}`)
                        } else if (discount.type === 'sellerDiscounted') {
                            discountedPrice = product.sellerDiscounted - (product.sellerDiscounted * discount.adminDiscount) / 100
                            product.adminDiscountedPrice = discountedPrice
                            console.log(`Applying seller discount to product: ${product.name}`)
                        }
                        product.adminDiscountApplied = discount.adminDiscount
                        product.adminDiscountedPrice = product.adminDiscountedPrice
                        await product.save()
                    }
                })
                await Promise.all(productUpdates)
            }

            // Apply discount to bundles
            if (discount.bundles?.length) {
                const bundleUpdates = discount.bundles.map(async (bundleId) => {
                    const bundle = await Bundle.findById(bundleId)
                    if (bundle) {
                        let discountedPrice
                        if (discount.type === 'MRP') {
                            discountedPrice = bundle.MRP - (bundle.MRP * discount.adminDiscount) / 100
                            bundle.adminDiscountedPrice = discountedPrice
                            console.log(`Applying MRP discount to bundle: ${bundle.name}`)
                        } else if (discount.type === 'sellerDiscounted') {
                            discountedPrice = bundle.sellerDiscounted - (bundle.sellerDiscounted * discount.adminDiscount) / 100
                            bundle.adminDiscountedPrice = discountedPrice
                            console.log(`Applying seller discount to bundle: ${bundle.name}`)
                        }
                        bundle.adminDiscountApplied = discount.adminDiscount
                        bundle.adminDiscountedPrice = bundle.adminDiscountedPrice
                        await bundle.save()
                    }
                })
                await Promise.all(bundleUpdates)
            }

            await discount.save()
        }
    } catch (error) {
        console.error(`Failed to apply discount with ID ${discountId}:`, error)
    }
}
