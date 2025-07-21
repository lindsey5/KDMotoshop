import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';
import type React from 'react';
import { useContext } from 'react';
import { DarkmodeContext } from '../context/DarkmodeContext';

type CounterProps = {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    disabled?: boolean;
    showLabel?: boolean;
}

const Counter = ({ value, setValue, limit, disabled, showLabel} : CounterProps) => {
    const context = useContext(DarkmodeContext)

    const incrementQuantity = () => {
        if(!disabled && value !== limit) setValue(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if(!disabled && value > 1) setValue(prev => (prev - 1 ));
    };

    return (
        <div>
            {showLabel && <h1 className="mb-2">Quantity</h1>}
            <div className="flex gap-2">
                <IconButton 
                    onClick={decrementQuantity} 
                    sx={{ color: context?.theme === 'dark' ? 'white' : ''}}
                >
                        <RemoveIcon />
                </IconButton>
                
                    <input
                        className="w-16 bg-white px-2 outline-none text-black text-center border-1 border-gray-300"
                        disabled
                        value={value}
                    />
                    <IconButton 
                        onClick={incrementQuantity} 
                        sx={{ color: context?.theme === 'dark' ? 'white' : ''}}
                    >
                        <AddIcon />
                    </IconButton>
            </div>
        </div>
    )
}
export default Counter;