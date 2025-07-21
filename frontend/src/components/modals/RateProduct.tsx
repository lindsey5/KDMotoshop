import { Modal, Rating } from "@mui/material"
import type React from "react";
import { RedTextField } from "../Textfield";
import Card from "../cards/Card";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import GradeIcon from '@mui/icons-material/Grade';
import useDarkmode from "../../hooks/useDarkmode";
import { RedButton } from "../Button";
import { postData } from "../../services/api";
import { memo, useState } from "react";

interface RateProductModalProps extends ModalProps {
    orderItemId: string;
    product_id: string;
}

const RateProductModal : React.FC<RateProductModalProps> = ({ open, close, orderItemId, product_id}) => {
    const isDark = useDarkmode();
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const submitReview = async () => {
        setLoading(true)
        const response = await postData('/api/review', { orderItemId, product_id, review, rating })
        if(response.success){
            window.location.reload();
        }
        setLoading(false)
    }

    const handleClose = () =>{
        if(!loading) close()
    }
    
    return (
         <Modal open={open} onClose={handleClose}>
            <Card className="w-[80%] max-w-[400px] flex flex-col p-5 bg-white absolute top-1/2 left-1/2 transform -translate-1/2 rounded-xl">
                <h1 className="font-bold text-2xl mb-4">Overall Rating</h1>
                <Rating
                    onChange={(_, newValue) => setRating(newValue || 0)}
                    value={rating}
                    icon={<GradeIcon fontSize="inherit" sx={{ color: 'red' }}/>}        
                    emptyIcon={<StarOutlineIcon fontSize="inherit" sx={{ color: isDark ? 'white' : ''}}/>} 
                    sx={{
                        fontSize: 40,
                    }}
                />
                <strong className="mt-6 mb-4">Product Review</strong>
                <RedTextField 
                    onChange={(e) => setReview(e.target.value)}
                    value={review}
                    multiline 
                    rows={6} 
                    inputProps={{ maxLength: 100 }}
                />
                <RedButton sx={{ marginTop: 3 }} onClick={submitReview} disabled={loading || !rating}>Submit Review</RedButton>
            </Card>
         </Modal>
    )
}

export default memo(RateProductModal)