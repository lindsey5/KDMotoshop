import { Modal } from "@mui/material"

const CreateProductModal = ({ close, open } : ModalProps) => {
    return <Modal open={open} onClose={close}>
        <div className="z-50 w-[90%] max-w-[350px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg">
        
        </div>
    </Modal>
}

export default CreateProductModal