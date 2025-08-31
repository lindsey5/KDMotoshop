import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { cn, formatNumberToPeso } from '../../../../utils/utils';
import { confirmDialog } from '../../../../utils/swal';
import Counter from '../../../../components/Counter';
import useDarkmode from '../../../../hooks/useDarkmode';

type OrderContainerProps = {
    orderItem: OrderItem;
    index: number;
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>
}

const OrderContainer = ({ orderItem, index, setOrderItems } : OrderContainerProps) => {
    const [show, setShow] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(orderItem.quantity);
    const isDark = useDarkmode();

    const remove = async () => {
        if(await confirmDialog('Remove this item?', '', isDark)){
            setOrderItems(prev => prev.filter((_, i)=> i !== index))
        }
    }

    useEffect(() => {
        setQuantity(orderItem.quantity);
    }, [orderItem.quantity])

    useEffect(() => {
        setOrderItems(prev => prev.map((o, i) => (
            i === index ? { ... orderItem, quantity: quantity, lineTotal: (quantity) * o.price }  : o)
        ))
    }, [quantity])

    return <div className={cn('border-b border-gray-300 flex gap-5 p-3 items-start', index % 2 == 0 ? (isDark ? 'bg-[#252525] border-gray-600' : 'bg-gray-100') : (isDark ? 'bg-[#121212] border-gray-600' : 'bg-white'))}>
        <IconButton onClick={() => setShow(!show)} sx={{ color: isDark ? 'white' : ''}}>
             {show ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
        </IconButton>
        <h1>{orderItem.quantity}</h1>
        <div className='flex-1'>
            <div className='flex gap-5 items-start'>
                <div className='flex-1'>
                    <h1 className='font-bold'>{orderItem.product_name}</h1>
                    {orderItem.attributes && (
                        <p>
                            {Object.entries(orderItem.attributes)
                            .map(([_, value]) => value)
                            .join('-')}
                        </p>
                    )}
                </div>
                <h1 className='font-bold'>{formatNumberToPeso(orderItem.lineTotal)}</h1>
                <IconButton onClick={remove} sx={{ color: isDark ? 'red' : ''}}>
                    <CancelIcon />
                </IconButton>
            </div>
            {show && <div className='mt-6 flex gap-10'>
                <Counter 
                    value={orderItem.quantity} 
                    setValue={setQuantity} 
                    limit={orderItem.stock! | 0} 
                    disabled={false} 
                />
                <img 
                    src={orderItem.image || 'photo.png'} 
                    className='w-20 h-20 rounded-sm' 
                />
            </div>}
        </div>
    </div>
}

export default OrderContainer