import Alert from "../models/Alert";

export const sendLowStockAlert = async (productId: string, sku: string, currentStock: number, threshold: number) => {
  try {
    const alert = new Alert({
      product_id: productId,
      sku,
      content: `Low stock alert for SKU ${sku}. Current stock is ${currentStock}.`,
      threshold,
      current_stock: currentStock,
      is_resolved: false
    });
    
    await alert.save();
    console.log(`Low stock alert created for SKU ${sku}`);
  } catch (error) {
    console.error('Error creating low stock alert:', error);
  }
}