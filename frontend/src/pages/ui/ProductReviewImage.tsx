import { Modal } from "@mui/material"

const ProductReviewImageModal = ({ open, close, image } : { open : boolean, close: () => void, image : string}) => {
    return (
        <Modal
            open={open}
            onClose={close}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.85)",
            }}
            >
                <img
                    src={image}
                    alt="Full View"
                    style={{
                    maxHeight: "90vh",
                    maxWidth: "90vw",
                    borderRadius: "8px",
                    objectFit: "contain",
                    }}
                />
        </Modal>
    )
}

export default ProductReviewImageModal