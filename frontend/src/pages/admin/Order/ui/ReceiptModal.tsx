import { X, Download } from 'lucide-react';
import { formatToLongDateFormat } from '../../../../utils/dateUtils';
import { formatNumberToPeso } from '../../../../utils/utils';
import { Modal } from '@mui/material';
import { useRef } from 'react';
import { receiptHTML } from '../../../../constants';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  payment: number;
  change: number;
  orderItems: OrderItem[];
}

const ReceiptModal = ({ open, onClose, order, orderItems, payment, change } : ReceiptModalProps) => {
    if (!open) return null;
    const receiptRef = useRef<HTMLDivElement | null>(null);

    const exportToPDF = () => {
        const printWindow = window.open("", "_blank");

        if (!printWindow) return; // safety check if popup is blocked
        const receiptElement = document.getElementById("receipt-content");

        if (!receiptElement) return; // prevent null errors
        const receiptContent = receiptElement.innerHTML;

        printWindow.document.write(receiptHTML({ order, receiptContent}));

        printWindow.document.close();
    };

    return (
            <Modal 
                open={open} 
                onClose={onClose}
                sx={{
                    zIndex: 99,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <>
            <div ref={receiptRef} className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto relative">
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                    <button
                        onClick={exportToPDF}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        title="Export as PDF"
                    >
                        <Download size={18} className="text-gray-600" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>
                <div id="receipt-content" className="p-6 font-mono text-sm bg-white">
                {/* Store Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                    <h1 className="text-lg font-bold tracking-wider mb-1">KD MOTOSHOP</h1>
                    <p className="text-xs text-gray-600">Blk. 2 Lot 19 Phase 1 Pinagsama</p>
                    <p className="text-xs text-gray-600">Taguig, Philippines.</p>
                </div>

                {/* Receipt Info */}
                <div className="mb-4 text-center">
                    <p className="font-bold text-base mb-1">RECEIPT</p>
                    <p className="text-xs">ORDER #: {order.order_id}</p>
                    <p className="text-xs">{formatToLongDateFormat(order?.createdAt)}</p>
                </div>

                {/* Customer Info */}
                <div className="border-b border-dashed border-gray-400 pb-3 mb-4">
                    <p className="font-bold mb-1">CUSTOMER:</p>
                    <p className="text-xs">{order.customer.firstname} {order.customer.lastname}</p>
                    <p className="text-xs">{order.customer.phone}</p>
                    <p className="text-xs">{order.customer.email}</p>
                </div>

                {/* Items */}
                <div className="mb-4">
                    <div className="border-b border-dashed border-gray-400 pb-1 mb-2">
                    <div className="flex justify-between font-bold">
                        <span>ITEM</span>
                        <span>TOTAL</span>
                    </div>
                    </div>
                    
                    {orderItems.map((item, idx) => (
                    <div key={idx} className="mb-2">
                        <div className="flex justify-between">
                        <span className="flex-1 pr-2">{item.product_name}</span>
                        <span className="whitespace-nowrap">{formatNumberToPeso(item.lineTotal)}</span>
                        </div>
                        <div className="text-xs text-gray-600 ml-2">
                        {item.quantity} x {formatNumberToPeso(item.lineTotal / item.quantity)}
                        </div>
                    </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-4">
                    <div className="flex justify-between mb-1">
                    <span>SUBTOTAL:</span>
                    <span>{formatNumberToPeso(order.subtotal)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-base">
                        <span>TOTAL:</span>
                        <span>{formatNumberToPeso(order.total)}</span>
                    </div>
                    <div className="flex justify-between mt-3 mb-1">
                    <span>Payment:</span>
                    <span>{formatNumberToPeso(payment)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                    <span>Change:</span>
                    <span>{formatNumberToPeso(change)}</span>
                    </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="border-t border-dashed border-gray-400 pt-3 mb-4">
                    <div className="flex justify-between mb-1">
                    <span>PAYMENT METHOD:</span>
                    <span className="font-bold">{order.payment_method}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t-2 border-dashed border-gray-400 pt-4 text-xs">
                    <p className="mb-2 font-bold">THANK YOU FOR YOUR PURCHASE!</p>
                    <p className="mb-1">Please keep this receipt for your records</p>
                    <p className="text-gray-600">Return Policy: 7 days with receipt</p>
                </div>
                </div>
            </div>
            </>
        </Modal>
    );
};

export default ReceiptModal;