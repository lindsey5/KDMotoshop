import useDarkmode from "../../../../hooks/useDarkmode"
import { cn, formatNumberToPeso } from "../../../../utils/utils"
import { CustomizedChip } from "../../../../components/Chip";

const CheckoutItemContainer = ({ item } : { item : OrderItem}) => {
    const isDark = useDarkmode();
    
    return (
        <div className={cn("flex flex-col md:flex-row flex-wrap gap-5 py-5 border-b border-gray-300", isDark && 'border-gray-500')}>
            <img className="w-20 h-20 md:w-25 md:h-25" src={item.image || '/photo.png'} alt="" />
            <div className="flex flex-col gap-5 flex-1">
                <h1 className="font-bold">{item.product_name}</h1>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="flex gap-2">
                    {Object.values(item?.attributes || {}).map((attribute, i) => <CustomizedChip key={i} label={attribute} />)}
                </div>
            </div>
            <strong>{formatNumberToPeso(item.lineTotal)}</strong>
        </div>
    )
}

export default CheckoutItemContainer