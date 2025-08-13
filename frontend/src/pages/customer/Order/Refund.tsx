import { useParams } from "react-router-dom";
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import { fetchData, postData } from "../../../services/api";
import { useEffect, useRef, useState } from "react";
import ProductThumbnail from "../../../components/images/ProductThumbnail";
import Card from "../../../components/cards/Card";
import { Title } from "../../../components/text/Text";
import { CustomizedSelect } from "../../../components/Select";
import VideocamIcon from '@mui/icons-material/Videocam';
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { RedButton } from "../../../components/buttons/Button";
import { RedTextField } from "../../../components/Textfield";
import { errorAlert, successAlert } from "../../../utils/swal";

interface RefundItem extends Omit<OrderItem, 'product_id'> {
    product_id: Product;
}

const reasons = [
    "Item arrived damaged",
    "Wrong item received",
    "Item is defective",
    "Product not as described",
    "Missing parts or accessories",
    "Other"
];

const RequestRefundPage = () => {
    const { id } = useParams();
    const isDark = useDarkmode();
    const [refundItem, setRefundItem] = useState<RefundItem>();
    const [quantity, setQuantity] = useState<number>();
    const [reason, setReason] = useState<string>();
    const [videoFile, setVideoFile] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getOrderItem = async () => {
            const response = await fetchData(`/api/order/item/${id}`)
            if(response.success){
                setRefundItem(response.orderItem)
            }
        }

        getOrderItem()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const response = await postData('/api/refund', {
            order_item_id: refundItem?._id,
            quantity,
            price: refundItem?.price,
            video: videoFile,
            description,
            reason,
            totalAmount: (refundItem?.price ?? 0) * (quantity ?? 0)
        })

        if (response.success) {
            setLoading(false);
            await successAlert(
                'Refund Request Submitted',
                'Your refund request is now pending. We will review it shortly.',
                isDark
            );
            window.location.href = '/';
        }else{
            setLoading(false);
            errorAlert(response.message, '', isDark)
        }
    }

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if (file.size > 50 * 1024 * 1024) {
            await errorAlert("Video must be under 50 MB.", '', isDark);
            return;
        }
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoFile(reader.result as string)
            };
        reader.readAsDataURL(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <form onSubmit={handleSubmit} className={cn("pt-30 pb-10 px-5 md:px-10 transition-colors duration-600 flex justify-center bg-gray-100 min-h-screen", isDark && 'bg-[#121212] text-white')}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Card className="w-full md:w-1/2 flex flex-col gap-5">
                <Title className="text-xl md:text-2xl">Refund/Return Request</Title>
                <div className="flex gap-5">
                    <ProductThumbnail className="w-20 h-20 md:w-30 md:h-30 rounded-lg" product={refundItem?.product_id}/>
                    <div className="flex flex-col gap-5">
                        <h1 className="text-md md:text-xl font-bold">{refundItem?.product_id.product_name}</h1>
                        <div className="flex gap-5 flex-wrap">
                            {refundItem?.attributes && Object.entries(refundItem.attributes).map(([key, value]) => <p className="text-sm md:text-base">{`${key}: ${value}`}</p>)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-5">
                    <CustomizedSelect 
                        menu={Array.from({ length: refundItem?.quantity ?? 0 }).map((_, index) => ({ value: (index + 1).toString(), label: (index + 1).toString()}))}
                        label="QTY"
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <CustomizedSelect 
                        label="Why are you refunding this?"
                        menu={reasons.map(reason => ({ value: reason, label: reason }))}
                        onChange={(e) => setReason(e.target.value as string)}
                    />
                </div>
                <RedTextField 
                    multiline
                    rows={5}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    inputProps={{ maxLength: 200 }}
                    placeholder="Please describe the issue with your product..."
                    required
                />
                <div className="flex flex-col items-center gap-3">
                    <input
                        type="file"
                        accept="video/*"
                        ref={fileInputRef}
                        onChange={handleVideoUpload}
                        style={{ display: "none" }}
                    />

                    <Button startIcon={<VideocamIcon />} onClick={triggerFileSelect}>
                        Upload Video
                    </Button>

                    {videoFile && (
                        <video
                            src={videoFile}
                            controls
                            className="w-full max-h-[500px] rounded-lg border"
                        />
                    )}
                </div>
                <p>Note: NO VIDEO, NO REFUND</p>
                <RedButton type="submit" disabled={!reason || !quantity || !videoFile || loading}>Submit Request</RedButton>
            </Card>
        </form>
    )
}

export default RequestRefundPage