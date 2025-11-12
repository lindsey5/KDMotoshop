import { Modal, Rating, Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type React from "react";
import { RedTextField } from "../../components/Textfield";
import Card from "../../components/Card";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import GradeIcon from '@mui/icons-material/Grade';
import useDarkmode from "../../hooks/useDarkmode";
import { RedButton } from "../../components/buttons/Button";
import { postData } from "../../services/api";
import { memo, useState } from "react";

interface RateProductModalProps extends ModalProps {
    orderItemId: string;
    product_id: string;
}

const RateProductModal: React.FC<RateProductModalProps> = ({ open, close, orderItemId, product_id }) => {
    const isDark = useDarkmode();
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [image, setImage] = useState<string>();

    const submitReview = async () => {
        setLoading(true);
        const response = await postData('/api/reviews', { orderItemId, product_id, review, rating, image });
        if (response.success) {
            window.location.reload();
        }
        setLoading(false);
    }

    const handleClose = () => {
        if (!loading) close();
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Card className="w-[80%] max-w-[400px] flex flex-col absolute top-1/2 left-1/2 transform -translate-1/2 rounded-xl p-6">
                <h1 className="font-bold text-2xl mb-4 text-center">Overall Rating</h1>
                
                <Rating
                    onChange={(_, newValue) => setRating(newValue || 0)}
                    value={rating}
                    icon={<GradeIcon fontSize="inherit" sx={{ color: 'red' }} />}
                    emptyIcon={<StarOutlineIcon fontSize="inherit" sx={{ color: isDark ? 'white' : '' }} />}
                    sx={{ fontSize: 40, alignSelf: 'center' }}
                />

                <strong className="mt-6 mb-4">Product Review</strong>
                <RedTextField
                    onChange={(e) => setReview(e.target.value)}
                    value={review}
                    multiline
                    rows={6}
                    inputProps={{ maxLength: 100 }}
                />

                {/* Image Upload */}
                <div className="mt-4 flex flex-col items-center">
                    <input
                        accept="image/*"
                        id="upload-image"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleImage}
                    />
                    <label htmlFor="upload-image">
                        <Button
                            variant="outlined"
                            disabled={loading}
                            component="span"
                            color="error"
                            startIcon={<CloudUploadIcon />}
                        >
                            {image ? "Change Image" : "Upload Image"}
                        </Button>
                    </label>

                    {image && (
                        <img
                            src={image}
                            alt="Preview"
                            className="mt-3 max-h-40 rounded-md object-cover"
                        />
                    )}
                </div>

                <RedButton
                    sx={{ marginTop: 3 }}
                    onClick={submitReview}
                    disabled={loading || !rating}
                >
                    Submit Review
                </RedButton>
            </Card>
        </Modal>
    );
}

export default memo(RateProductModal);
