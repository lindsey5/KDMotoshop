import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { cn, formatNumber } from '../../utils/utils';
import { confirmDialog } from '../../utils/swal';
import Counter from '../Counter';

interface OrderContainerProps{
    orderItem: OrderItem;
    index: number;
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>
}

const OrderContainer : React.FC<OrderContainerProps> = ({ orderItem, index, setOrderItems }) => {
    const [show, setShow] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(orderItem.quantity);

    const remove = async () => {
        if(await confirmDialog('Remove this item?', '')){
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

    return <div className={cn('border-b-1 border-gray-300 flex gap-5 p-3 items-start', index % 2 == 0 && 'bg-gray-100')}>
        <IconButton onClick={() => setShow(!show)}>
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
                <h1 className='font-bold'>₱{formatNumber(orderItem.lineTotal)}</h1>
                <IconButton onClick={remove}>
                    <CancelIcon />
                </IconButton>
            </div>
            {show && <div className='mt-6'>
                <Counter 
                    value={orderItem.quantity} 
                    setValue={setQuantity} 
                    limit={orderItem.stock! | 0} 
                    disabled={false} 
                />
            </div>}
        </div>
    </div>
}

export default OrderContainer