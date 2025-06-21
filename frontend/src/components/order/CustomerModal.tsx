import { Modal } from "@mui/material";
import type React from "react";

interface CustomerModalProps {
    open: boolean;
    onClose: () => void;
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
    order: Order;
}

const CustomerModal : React.FC<CustomerModalProps> = ({ open, onClose, setOrder, order }) => {
    return(
        <Modal 
            open={open}
            onClose={onClose} 
            className="flex items-center justify-center"
        >
            <div className="p-5 bg-white rounded-md">
            </div>
        </Modal>
    )
}

export default CustomerModal;