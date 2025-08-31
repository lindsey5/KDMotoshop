type PurchaseOrder = {
    _id?: string;
    po_id?: string;
    supplier: Supplier;
    totalAmount: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
    receivedDate?: Date;
    createdAt?: Date;
    notes?: string;
    purchase_items: PurchaseOrderItem[] 
}

type Supplier = {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

type PurchaseOrderItem = {
    purchase_order?: string;
    product_id: string;
    sku: string;
    quantity: number;
    price: number;
}