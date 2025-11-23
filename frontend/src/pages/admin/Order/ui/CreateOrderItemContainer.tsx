import { useEffect, useState } from "react";
import Counter from "../../../../components/Counter";
import { RedTextField } from "../../../../components/Textfield";
import { formatNumberToPeso } from "../../../../utils/utils";
import { RedButton } from "../../../../components/buttons/Button";
import Card from "../../../../components/Card";

const CreateOrderItemContainer = ({ orderItem, setOrderItems } : { orderItem : OrderItem, setOrderItems : React.Dispatch<React.SetStateAction<OrderItem[]>>}) => {
    const [quantity, setQuantity] = useState<number>(orderItem.quantity);

    useEffect(() => {
        setQuantity(orderItem.quantity)
    }, [orderItem.quantity])

    useEffect(() => {
        setOrderItems(prev => prev.map(item => item.sku === orderItem.sku ? 
            ({
                ...item,
                quantity,
                lineTotal: item.price * quantity
            }) : item
        ))
    }, [quantity])

    const handleRemove = () => {
        setOrderItems(prev => prev.filter(item => item.sku !== orderItem.sku))
    }

    const handlePriceChange = (value : number) => {
        setOrderItems(prev => 
            prev.map((item) => 
                item.sku === orderItem.sku ? 
                ({
                    ...item,
                    price : value,
                    lineTotal: value * item.quantity

                }) : item
            )
        )
    }
    
    return (
        <Card className="flex md:flex-row flex-col gap-5 md:justify-between">
            <div className="flex gap-4">
                <img src={orderItem.image || '/photo.png'} className="w-20 h-20" alt="Product image" />
                <div className="flex flex-col items-start space-y-4 max-w-64">
                    <h1>{orderItem.product_name}</h1>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(orderItem.attributes ?? {}).map(([_, value]) => (
                            <div key={value} className="text-sm p-2 border border-gray-400 rounded-full">
                                {value}
                            </div>
                        ))}
                    </div>
                    <p>Stock: {orderItem.stock}</p>
                </div>
            </div>
            <Counter 
                limit={orderItem?.stock || 0}
                setValue={setQuantity}
                value={quantity}
                showLabel
            />
            <div className="space-y-2">
                <h1>Price</h1>
                <RedTextField 
                    type="number"
                    onKeyDown={(e) => {
                        if (e.key === '.' || e.key === '-') {
                            e.preventDefault(); 
                        }
                    }}
                    value={orderItem.price || ''}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                />
            </div>
            <div className="space-y-2 flex flex-col justify-center">
                <p>{formatNumberToPeso(orderItem.lineTotal)}</p>
                <RedButton onClick={handleRemove}>Remove</RedButton>
            </div>
        </Card>
    )
}

export default CreateOrderItemContainer