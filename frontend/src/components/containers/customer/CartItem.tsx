import { useContext, useEffect, useState } from "react";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn, formatNumber } from "../../../utils/utils"
import { CustomizedChip } from "../../Chip";
import Counter from "../../Counter";
import { updateData } from "../../../services/api";
import { Button } from "@mui/material";

type CartItemContainerProps = {
    item : CartItem;
    remove: (id : string) => void;
}

const CartItemContainer : React.FC<CartItemContainerProps> = ({ item, remove }) => {
    const isDark = useDarkmode();
    const [value, setValue] = useState<number>(item.quantity);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            await updateData(`/api/cart/${item._id}`, { quantity: value });
        }, 500); 
        return () => clearTimeout(delayDebounce);
    }, [value]);

    console.log(item)
    
    return (
        <div className={cn("flex flex-wrap gap-5 py-5 border-b border-gray-300", isDark && 'border-gray-500')}>
            <img className="w-25 h-25" src={item?.image || '/photo.png'} alt="" />
            <div className="flex flex-col gap-5 flex-1">
                <h1 className="font-bold">{item?.product_name}</h1>
                <p>Price: {item?.price}</p>
                <div className="flex gap-2">
                    {Object.values(item?.attributes || {}).map((attribute, i) => <CustomizedChip key={i} label={attribute} />)}
                </div>
                {(item?.stock ?? 0) > 0 ? <Counter 
                    limit={item?.stock || 1} 
                    setValue={setValue} 
                    value={value}
                /> : <p className="text-red-600">Out of Stock</p>}
            </div>
            <div className="flex flex-col gap-5 justify-between">
                <strong className="text-lg">₱{formatNumber(value * (item?.price ?? 0))}</strong>
                <Button sx={{ color: 'red'}} onClick={() => remove(item._id || '')}>Remove</Button>
            </div>
        </div>
    )
}

export default CartItemContainer;