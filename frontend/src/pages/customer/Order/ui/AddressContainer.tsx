import { Button, Radio } from "@mui/material"
import { cn } from "../../../../utils/utils"
import useDarkmode from "../../../../hooks/useDarkmode";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { useState } from "react";

type AddressContainerProps = {
    address: Address;
    index: number;
    selectedAddress: number;
    remove: (index : number) => Promise<void>;
}

const AddressContainer = ({ address, index, selectedAddress, remove} : AddressContainerProps) => {
    const isDark = useDarkmode();
    const [loading, setLoading] = useState<boolean>(false);

    const removeAddress = async () => {
        setLoading(true)
        await remove(index)
        setLoading(false)
    }


    return (
        <div className={cn("text-sm md:text-md flex justify-between items-center gap-5 border border-gray-300 p-5 rounded-lg", isDark && 'border-gray-500')}>
            <div className="items-start flex flex-col gap-2">
                <LocationPinIcon />
                <p>Fullname: {address.firstname} {address.lastname}</p>
                <p>{address.region}</p>
                <p>{address.city}, {address.barangay}</p>
                <p>{address.street}</p>
                <p>{address.phone}</p>
                <Button 
                    sx={{ color: 'red'}} 
                    disabled={loading}
                    onClick={removeAddress}
                >Remove</Button>
            </div>
            <Radio
                checked={selectedAddress === index}
                value={index}
                name="radio-buttons"
                sx={{
                    color: isDark ? 'white' : '',
                    '&.Mui-checked': {
                        color: 'red',
                    },
                }}
            />
        </div>
    )
}

export default AddressContainer