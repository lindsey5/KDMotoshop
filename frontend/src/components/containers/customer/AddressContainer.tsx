import { Button, Radio } from "@mui/material"
import { cn } from "../../../utils/utils"
import useDarkmode from "../../../hooks/useDarkmode";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { useContext, useState } from "react";
import { updateData } from "../../../services/api";
import { CustomerContext } from "../../../context/CustomerContext";
import { confirmDialog, successAlert } from "../../../utils/swal";

type AddressContainerProps = {
    address: Address;
    index: number;
    handleChange: (e : any) => void;
    selectedAddress: number;
}

const AddressContainer = ({ address, index, selectedAddress, handleChange } : AddressContainerProps) => {
    const isDark = useDarkmode();
    const { customer, setCustomer } = useContext(CustomerContext);
    const [loading, setLoading] = useState<boolean>(false);

    const removeAddress = async () => {
        if(await confirmDialog('Remove this address?', '', isDark)){
            setLoading(true)
            const data = {...customer!, addresses: customer?.addresses?.filter((_, i) => i !== index)}
            const response = await updateData('/api/customer', data)
            if(response.success){
                setCustomer(data)
                successAlert('Address successfully removed', '', isDark)
            }
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex justify-between items-center gap-5 border border-gray-300 p-5 rounded-lg", isDark && 'border-gray-500')}>
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
                onChange={handleChange}
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