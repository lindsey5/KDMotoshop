import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton } from '@mui/material';
import type React from 'react';
import { cn } from '../utils/utils';
import useDarkmode from '../hooks/useDarkmode';

type CounterProps = {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    disabled?: boolean;
    showLabel?: boolean;
}

const Counter = ({ value, setValue, limit, disabled, showLabel} : CounterProps) => {
    const isDark = useDarkmode();

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
                    sx={{ color: isDark ? 'white' : ''}}
                >
                        <RemoveIcon />
                </IconButton>
                
                    <input
                        type='number'
                        onKeyDown={(e) => {
                            if (e.key === '.' || e.key === '-') {
                                e.preventDefault(); 
                            }
                        }}
                        className={cn("no-spinner w-16 bg-white px-2 outline-none text-black text-center border-1 border-gray-300", isDark && 'bg-gray-700 text-white border-gray-600', value === 0 && 'border-red-600')}
                        onChange={(e) => {
                            let val = Number(e.target.value);
                            if (val > limit) val = limit
                            setValue(val)
                        }}
                        value={value || ''}
                    />
                    <IconButton 
                        onClick={incrementQuantity} 
                        sx={{ color: isDark ? 'white' : ''}}
                    >
                        <AddIcon />
                    </IconButton>
            </div>
        </div>
    )
}
export default Counter;