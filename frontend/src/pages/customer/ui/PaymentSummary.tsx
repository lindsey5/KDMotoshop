import useDarkmode from "../../../hooks/useDarkmode";
import { cn, formatNumber } from "../../../utils/utils";
import Card from "../../../components/Card";

type PaymentSummaryCard = {
    subtotal: number;
    total: number;
}

const PaymentSummaryCard = ({ subtotal, total} : PaymentSummaryCard) =>{
    const isDark = useDarkmode();

    return (
        <Card>
            <div className="grid grid-cols-2 gap-5">
                <strong>Subtotal</strong>
                <strong className="text-right">₱{formatNumber(subtotal ?? 0)}</strong>
                <p>Shipping fee</p>
                <p className="text-right">Free</p>
            </div>
            <div className={cn("grid grid-cols-2 font-bold text-2xl mt-5 pt-3 border-t border-gray-300", isDark && 'border-gray-500')}>
                <h1>Total</h1>
                <h1 className="text-right">₱{formatNumber(total)}</h1>
            </div>
        </Card>
    )
}

export default PaymentSummaryCard