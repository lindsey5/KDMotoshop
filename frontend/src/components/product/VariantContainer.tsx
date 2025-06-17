import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { RedTextField } from '../Textfield';
import { confirmDialog } from '../../utils/swal';
import { RedButton } from '../Button';

interface VariantContainerProps {
  index: number;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  variant: Variant;
}

const VariantContainer : React.FC<VariantContainerProps> = ({ index, setProduct, variant }) => {
    const [expand, setExpand] = useState<boolean>(false);

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

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateVariant('image', reader.result)
            };
            reader.readAsDataURL(file);
        }
    };

    return <div className='bg-white border-1 border-gray-300 rounded-lg'>
        <div className="p-5 flex justify-between items-center rounded-lg">
            <div>
                <h1 className='font-bold'>Variant {index + 1}</h1>
                <div className="flex gap-2 mt-2">
                {Object.entries(variant.attributes).map(([key, value], index : number) => (
                    <span key={key}>{value}</span>
                ))}
                </div>
            </div>
            <div className='flex items-center'>
                <IconButton onClick={removeVariant}>
                    <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => setExpand(!expand)}>
                    {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </div>
        </div>

        {expand && <div className='p-5'>
            <img 
                className="w-35 h-35 bg-gray-100 mb-4"
                src={
                    typeof variant.image === 'object' && variant.image !== null && 'imageUrl' in variant.image
                    ? variant.image.imageUrl
                       : typeof variant.image === 'string'
                       ? variant.image
                    : '/photo.png'
                }
            />
            <input
                type="file"
                accept="image/*"
                id="image-input"
                style={{ display: 'none' }}
                onChange={handleImage}
            />
            <label htmlFor="image-input">
                <RedButton component="span">Add Image</RedButton>
            </label>
            <h1 className="text-gray-400 font-bold my-6">Attributes</h1>
            <div className='grid grid-cols-2 gap-10 mb-8'>
                {Object.entries(variant.attributes).map(([key, value]) => (
                    <RedTextField 
                        key={key}
                        label={key} 
                        value={value} 
                        onChange={(e) => handleAttribute(key, e.target.value)}
                    />
                ))}
            </div>
            <h1 className="text-gray-400 font-bold mb-6">Variant Information</h1>
            <div className='grid grid-cols-2 gap-10 mb-8'>
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
                <RedTextField 
                    label="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant('sku', e.target.value)}
                    placeholder='Enter Variant SKU'
                />
            </div>
        </div>}

    </div>
}

export default VariantContainer