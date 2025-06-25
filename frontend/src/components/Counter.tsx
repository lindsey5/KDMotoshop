import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';
import type React from 'react';

type CounterProps = {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    disabled?: boolean;
}

const Counter : React.FC<CounterProps>= ({ value, setValue, limit, disabled}) => {
    const incrementQuantity = () => {
        setValue(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setValue(prev => (prev - 1 ));
    };


    return (
        <div>
            <h1 className="mb-2">Quantity</h1>
            <div className="flex gap-2">
                <IconButton onClick={decrementQuantity} disabled={value === 1 || disabled}>
                        <RemoveIcon />
                </IconButton>
                
                    <input
                        className="w-16 bg-white px-2 outline-none text-center border-1 border-gray-300"
                        disabled
                        value={value}
                    />
                    <IconButton onClick={incrementQuantity} disabled={value === limit || disabled}>
                        <AddIcon />
                    </IconButton>
            </div>
        </div>
    )
}
export default Counter;