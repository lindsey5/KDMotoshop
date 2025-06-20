import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { cn, formatNumber } from '../../utils/utils';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { confirmDialog } from '../../utils/swal';

interface OrderContainerProps{
    order: Sale;
    index: number;
    setOrders: React.Dispatch<React.SetStateAction<Sale[]>>
}

const OrderContainer : React.FC<OrderContainerProps> = ({ order, index, setOrders }) => {
    const [show, setShow] = useState<boolean>(false);

    const remove = async () => {
        if(await confirmDialog('Remove this item?', '')){
            setOrders(prev => prev.filter((_, i)=> i !== index))
        }
    }

    const incrementQuantity = () => {
        setOrders(prev => prev.map((o, i) => (
                i === index ? { ...order, quantity: o.quantity + 1, sales: (o.quantity + 1) * o.price }  : o)))
    };

    const decrementQuantity = () => {
        setOrders(prev => prev.map((o, i) => (
                i === index ? { ...order, quantity: o.quantity - 1, sales: (o.quantity - 1) * o.price }  : o)))
    };

    return <div className={cn('border-b-1 border-gray-300 flex gap-5 p-3 items-start', index % 2 == 0 && 'bg-gray-100')}>
        <IconButton onClick={() => setShow(!show)}>
             {show ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
        </IconButton>
        <h1>{order.quantity}</h1>
        <div className='flex-1'>
            <div className='flex gap-5 items-start'>
                <div className='flex-1'>
                    <h1 className='font-bold'>{order.product_name}</h1>
                    {order.attributes && (
                        <p>
                            {Object.entries(order.attributes)
                            .map(([_, value]) => value)
                            .join('-')}
                        </p>
                    )}
                </div>
                <h1 className='font-bold'>₱{formatNumber(order.sales)}</h1>
                <IconButton onClick={remove}>
                    <CancelIcon />
                </IconButton>
            </div>
            {show && <div className='mt-6'>
                <h1 className="mb-2">Quantity</h1>
                    <div className="flex gap-2">
                        <IconButton 
                            onClick={decrementQuantity} 
                            disabled={order.quantity === 1 }
                        >
                            <RemoveIcon fontSize='small'/>
                        </IconButton>
            
                        <input
                            className="w-16 bg-white px-2 outline-none text-center border-1 border-gray-300"
                            disabled
                            value={order.quantity}
                        />
                        <IconButton 
                            onClick={incrementQuantity} 
                            disabled={order.quantity === order.stock}
                        >
                            <AddIcon fontSize='small'/>
                        </IconButton>
                    </div>
            </div>}
        </div>
    </div>
}

export default OrderContainer