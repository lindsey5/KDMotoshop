import useDarkmode from "../../../hooks/useDarkmode";
import { cn, formatNumberToPeso } from "../../../utils/utils";
import Card from "../../../components/Card";

type PaymentSummaryCard = {
    subtotal: number;
    total: number;
    shipping_fee: number;
    discountedPrice: number;
    voucher?: Voucher
}

const PaymentSummaryCard = ({ subtotal, total, shipping_fee, discountedPrice, voucher} : PaymentSummaryCard) =>{
    const isDark = useDarkmode();

    return (
        <Card>
            <div className="grid grid-cols-2 gap-5">
                <strong>Subtotal</strong>
                <strong className="text-right">{formatNumberToPeso(subtotal ?? 0)}</strong>
                {voucher && (
                    <>
                    <p>Voucher Name:</p>
                    <p className={`text-right text-green-600 ${isDark && 'text-green-500'}`}>{voucher.name}</p>
                    <p>Max Discount:</p>
                    <p className={`text-right text-green-600 ${isDark && 'text-green-500'}`}>{voucher.maxDiscount ? formatNumberToPeso(voucher.maxDiscount) : 'N/A'}</p>
                    <p>Min. Spend:</p>
                    <p className={`text-right text-green-600 ${isDark && 'text-green-500'}`}>{formatNumberToPeso(voucher.minSpend)}</p>
                    <p >Discount:</p>
                    <p className={`text-right text-red-600 ${isDark && 'text-red-500'}`}> - {voucher?.voucherType === 'amount' ? formatNumberToPeso(voucher?.amount ?? 0) : `${voucher?.percentage}%`}</p>
                    {discountedPrice && <>
                    <p>Discounted Subtotal:</p>
                    <p className="text-right">{formatNumberToPeso(discountedPrice)}</p>
                    </>}
                    </>
                )}
                <p>Shipping fee</p>
                <p className="text-right">{shipping_fee ? formatNumberToPeso(shipping_fee) : 'Free'}</p>
            </div>
            <div className={cn("grid grid-cols-2 font-bold text-2xl mt-5 pt-3 border-t border-gray-300", isDark && 'border-gray-500')}>
                <h1>Total</h1>
                <h1 className="text-right">{formatNumberToPeso(Math.round(total))}</h1>
            </div>
        </Card>
    )
}

export default PaymentSummaryCard