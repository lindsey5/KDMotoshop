import { Modal } from "@mui/material";
import useDarkmode from "../../../hooks/useDarkmode";
import { RefundStatusChip } from "../../../components/Chip";
import { ExpandableText } from "../../../components/text/Text";
import Card from "../../../components/Card";
import { formatNumberToPeso } from "../../../utils/utils";
import { cn } from "../../../utils/utils";
import { formatToLongDateFormat } from "../../../utils/dateUtils";
import { RedButton } from "../../../components/buttons/Button";

interface RefundRequestModalProps {
  open: boolean;
  close: () => void;
  refundRequest: RefundRequest;
}

const CustomerRefundRequestModal: React.FC<RefundRequestModalProps> = ({
  open,
  close,
  refundRequest,
}) => {
    const isDark = useDarkmode();
    console.log(refundRequest)

    return (
        <Modal
        open={open}
        onClose={close}
        aria-labelledby="refund-request-modal-title"
        aria-describedby="refund-request-modal-description"
        sx={{
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        <Card className="w-[90%] max-w-6xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex gap-5 items-center mb-4">
                <h2 className="text-xl font-semibold">Refund Details</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-20">
            {/* Left Column */}
            <div className="flex-1 space-y-4">

                {/* Product Info */}
                <div className="flex items-center gap-4">
                <img
                    src={refundRequest.order_item_id.product_id.thumbnail.imageUrl}
                    alt={refundRequest.order_item_id.product_id.product_name}
                    className="w-20 h-20 object-cover rounded"
                />
                <div>
                    <p className="text-md md:text-lg font-semibold">
                    {refundRequest.order_item_id.product_id.product_name}
                    </p>
                    {refundRequest.order_item_id.attributes && <p className="text-sm my-2">{Object.entries(refundRequest.order_item_id.attributes).map(([_, value]) => value).join(' | ')}</p>}
                    <p className={cn("text-gray-500", isDark && 'text-gray-300')}>
                    Quantity: {refundRequest.quantity}
                    </p>
                </div>
                </div>

                {/* Return Proof Video */}
                {refundRequest.video?.videoUrl && (
                    <video
                        src={refundRequest.video.videoUrl}
                        controls
                        className="w-full rounded"
                    />
                )}
                
                {/* Payment Refunded */}
                <h3 className="font-semibold">Payment to refund</h3>
                <div className={cn("space-y-1 rounded-md bg-gray-100 p-4", isDark && 'bg-gray-700')}>
                    <div className="flex justify-between gap-10">
                        <p>{refundRequest.order_item_id.product_id.product_name}</p>
                    <p className="text-end">{formatNumberToPeso(refundRequest.order_item_id.price)} x {refundRequest.quantity}</p>
                    </div>
                    <hr className="border-gray-300 mt-10 mb-4"/>
                    <div className="flex justify-between gap-10">
                        <p className="font-bold">Total:</p>
                        <p className="font-bold text-end">{formatNumberToPeso(refundRequest.totalAmount)}</p>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-bold">Order Details</h3>
                    <p>Order ID: {refundRequest.order_item_id.order_id.order_id}</p>
                    <p>Order Date: {formatToLongDateFormat(refundRequest.createdAt)}</p>
                    <div className="flex gap-2">
                        <p>Refund Status:</p>
                        <RefundStatusChip status={refundRequest.status}/>
                    </div>
                </div>
                <hr className="border-gray-300"/>
                <div className="space-y-2 mb-8">
                    <div className="text-sm md:text-base mt-4">
                        <h2 className="font-semibold">Address</h2>
                        <p>{refundRequest.order_item_id.order_id.customer.firstname} {refundRequest.order_item_id.order_id.customer.lastname}</p>
                        <p>{refundRequest.order_item_id.order_id.customer.phone}</p>
                        <p>{refundRequest.order_item_id.order_id.address?.street}</p>
                        <p>{refundRequest.order_item_id.order_id.address?.barangay}</p>
                        <p>{refundRequest.order_item_id.order_id.address?.city}</p>
                        <p>{refundRequest.order_item_id.order_id.address?.region}</p>
                    </div>
                </div>
                <hr className="border-gray-300"/>
                <p className="mt-2 border-l-6 pl-2 border-red-500">{refundRequest.reason}</p>
                <div className={cn("space-y-2 p-4 rounded-md", isDark ? 'bg-gray-700' : 'bg-gray-100')}>
                    <h3 className="font-semibold">Refund Description</h3>
                    <ExpandableText text={refundRequest.description} limit={80}/>
                </div>
            </div>
            </div>

            <div className="mt-6 flex justify-between gap-2">
                <p>Refund Date: {formatToLongDateFormat(refundRequest.createdAt)}</p>
                <RedButton onClick={close}>Close</RedButton>
            </div>
        </Card>
        </Modal>
    );
};

export default CustomerRefundRequestModal