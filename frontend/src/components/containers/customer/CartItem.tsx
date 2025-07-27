import { useEffect, useState } from "react";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn, formatNumber } from "../../../utils/utils"
import { CustomizedChip } from "../../Chip";
import Counter from "../../Counter";
import { updateData } from "../../../services/api";
import { Button, Checkbox } from "@mui/material";
import { red } from "@mui/material/colors";
import type { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { deleteCartItem, updateCartItem } from "../../../redux/cart-reducer";

type CartItemContainerProps = {
    item : CartItem;
}

const CartItemContainer = ({ item } : CartItemContainerProps) => {
    const isDark = useDarkmode();
    const [value, setValue] = useState<number>(item.quantity);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(updateCartItem({...item, quantity: value}))
        const delayDebounce = setTimeout(async () => {
            await updateData(`/api/cart/${item._id}`, { quantity: value });
        }, 500); 
        return () => clearTimeout(delayDebounce);
    }, [value]);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCartItem({...item, isSelected: event.target.checked}))
    };
    
    return (
        <div className={cn("flex flex-wrap justify-between gap-5 py-5 border-b border-gray-300 items-start", isDark && 'border-gray-500')}>
            <div className="flex flex-row-reverse lg:flex-row gap-5 items-center">
                <Checkbox
                    disabled={item.stock === 0}
                    checked={item.isSelected}
                    onChange={handleCheck}
                    sx={{ 
                        '& .MuiSvgIcon-root': { fontSize: 28 } ,
                        '&.Mui-checked': {
                            color: red[600],
                        },
                        color: isDark ? 'white' : ''
                    }}
                />
                <div className="flex gap-5 flex-wrap">
                    <img className="w-25 h-25" src={item?.image || '/photo.png'} alt="" />
                    <div className="flex flex-col gap-5 flex-1">
                        <h1 className="font-bold">{item?.product_name}</h1>
                        <p>Price: {item?.price}</p>
                        <div className="flex gap-2 flex-wrap">
                            {Object.values(item?.attributes || {}).map((attribute, i) => <CustomizedChip key={i} label={attribute} />)}
                        </div>
                        {(item?.stock ?? 0) > 0 ? <Counter 
                            limit={item?.stock || 1} 
                            setValue={setValue} 
                            value={value}
                        /> : <p className="text-red-600">Out of Stock</p>}
                    </div>
                </div>
            </div>
            <div className="flex flex-1 items-end justify-between md:flex-col gap-2">
                <strong className="text-lg">₱{formatNumber(item.quantity * (item?.price ?? 0))}</strong>
                <Button sx={{ color: 'red'}} onClick={async () => dispatch(await deleteCartItem({id: item._id ?? '', isDark}))}>Remove</Button>
            </div>
        </div>
    )
}

export default CartItemContainer;