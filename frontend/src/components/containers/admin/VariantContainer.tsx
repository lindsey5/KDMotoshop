import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { RedTextField } from '../../Textfield';
import { confirmDialog } from '../../../utils/swal';
import useDarkmode from '../../../hooks/useDarkmode';
import { cn } from '../../../utils/utils';

type VariantContainerProps = {
  index: number;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  variant: Variant;
}

const VariantContainer : React.FC<VariantContainerProps> = ({ index, setProduct, variant }) => {
    const [expand, setExpand] = useState<boolean>(false);
    const isDark = useDarkmode()

    const updateVariant = (
        field: keyof Variant,
        newValue: any
    ) => {
        setProduct(prev => ({
        ...prev,
        variants: prev.variants.map((variant, i) =>
            i === index ? { ...variant, [field]: newValue } : variant
        )
        }));
    };

    const removeVariant = async () => {
        if(await confirmDialog("Remove this variant?", "")){
            setProduct(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
            }))
        }
    };

    const handleAttribute = (attributeKey : string, newValue: string) => {
        const { attributes } = variant;
        updateVariant(
            'attributes',
            { ...attributes, [attributeKey]: newValue }
        )
    }

    const handleNoDecimal = (input : string, field : keyof Variant) => {
        if (input === '' || /^\d+$/.test(input)) {
            updateVariant(field, input)
        }
    };

    return <div className={cn('border-1 border-gray-300 rounded-lg', isDark ? 'bg-[#121212]' : 'bg-white')}>
        <div className="p-5 flex justify-between items-center rounded-lg">
            <div>
                <h1 className='font-bold'>Variant {index + 1}</h1>
                <p>{variant.sku}</p>
            </div>
            <div className='flex items-center'>
                <IconButton 
                    onClick={removeVariant}
                    color='inherit'
                >
                    <DeleteIcon />
                </IconButton>
                <IconButton 
                    onClick={() => setExpand(!expand)}
                    color='inherit'
                >
                    {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </div>
        </div>

        {expand && <div className='p-5'>
            <h1 className="text-gray-400 font-bold mb-6">Attributes</h1>
            <div className='grid grid-cols-2 gap-10 mb-8'>
                {Object.entries(variant.attributes).map(([key, value]) => (
                    <RedTextField 
                        key={key}
                        label={key} 
                        value={value} 
                        onChange={(e) => handleAttribute(key, e.target.value.toLocaleUpperCase())}
                    />
                ))}
            </div>
            <h1 className="text-gray-400 font-bold mb-6">Variant Information</h1>
            <div className='grid grid-cols-2 gap-10 mb-8'>
                <RedTextField 
                    label="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant('sku', e.target.value)}
                    placeholder='Enter Variant SKU'
                />
                <RedTextField 
                    type='number'
                    label="Stock"
                    value={variant.stock}
                    placeholder='Enter Variant Stock' 
                    onChange={(e) => handleNoDecimal(e.target.value, 'stock')}
                />
                <RedTextField 
                    type='number'
                    label="Price" 
                    value={variant.price}
                    onChange={(e) => updateVariant('price', e.target.value)}
                    placeholder='Enter Variant Price' 
                />
            </div>
        </div>}

    </div>
}

export default VariantContainer