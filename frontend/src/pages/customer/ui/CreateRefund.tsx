import { memo, useEffect, useRef, useState } from "react";
import VideocamIcon from '@mui/icons-material/Videocam';
import { Backdrop, Button, CircularProgress, Modal } from "@mui/material";
import useDarkmode from "../../../hooks/useDarkmode";
import { fetchData, postData } from "../../../services/api";
import { errorAlert, successAlert } from "../../../utils/swal";
import Card from "../../../components/Card";
import ProductThumbnail from "../../ui/ProductThumbnail";
import { RedTextField } from "../../../components/Textfield";
import { CustomizedSelect } from "../../../components/Select";
import { Title } from "../../../components/text/Text";
import { RedButton } from "../../../components/buttons/Button";
import Counter from "../../../components/Counter";

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

const VideoContainer = memo(({ videoFile } : { videoFile : File}) => {
    return <video
        src={URL.createObjectURL(videoFile)}
        controls
        className="w-full max-h-[500px] rounded-lg border"
    />
})

const RequestRefundModal = ({ id, open, close } : { id : string, open : boolean, close : () => void}) => {
    const isDark = useDarkmode();
    const [refundItem, setRefundItem] = useState<RefundItem>();
    const [quantity, setQuantity] = useState<number>(1);
    const [reason, setReason] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    useEffect(() => {
        const getOrderItem = async () => {
            const response = await fetchData(`/api/orders/item/${id}`)
            if(response.success){
                setRefundItem(response.orderItem)
            }
        }

        getOrderItem()
    }, [])

    const handleSubmit = async () => {
        if (!videoFile) {
            errorAlert("Video is required for a refund request.", "", isDark);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("video", videoFile);
            formData.append("order_item_id", refundItem?._id || "");
            formData.append("quantity", String(quantity));
            formData.append("price", String(refundItem?.price || 0));
            formData.append("description", description);
            formData.append("reason", reason || "");
            formData.append("totalAmount", String((refundItem?.price ?? 0) * (quantity ?? 0)));

            const response = await postData('/api/refunds', formData)

            if (response.success) {
                close();
                await successAlert(
                    "Refund Request Submitted",
                    "Your refund request is now pending. We will review it shortly.",
                    isDark
                );
                window.location.reload();
            } else {
                errorAlert(response.message, "", isDark);
            }
        } catch (error) {
            console.error("Refund request error:", error);
            errorAlert("Something went wrong. Please try again later.", "", isDark);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 30 * 1024 * 1024) {
            window.alert("File size exceeds 30MB limit. Please upload a smaller video.");
            return;
        }

        setVideoFile(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <Modal open={open} onClose={close} className="p-5 flex justify-center items-start overflow-y-auto">
                <Card className="w-[90%] md:max-w-[600px] md:w-[70%] lg:w-1/2 flex flex-col gap-5">
                    <Backdrop
                        sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
                        open={loading}
                    >
                    <Card className="max-w-[400px] flex flex-col items-center justify-center p-6 text-center">
                        <CircularProgress />
                        <h1 className="text-2xl font-semibold mt-2">Uploading Video...</h1>
                        <p className="text-md text-gray-500 mt-2">
                            This may take a moment. Please don’t close or reload the page.
                        </p>
                    </Card>
                    </Backdrop>
                    <Title className="text-xl md:text-2xl">Request a refund</Title>
                    <div className="flex gap-5">
                        <ProductThumbnail className="w-20 h-20 md:w-30 md:h-30 rounded-lg" product={refundItem?.product_id}/>
                        <div className="flex flex-col gap-5">
                            <h1 className="text-md md:text-xl font-bold">{refundItem?.product_id.product_name}</h1>
                            <div className="flex gap-5 flex-wrap">
                                {refundItem?.attributes && Object.entries(refundItem.attributes).map(([key, value]) => <p className="text-sm md:text-base">{`${key}: ${value}`}</p>)}
                            </div>
                        </div>
                    </div>
                    <Counter 
                        limit={refundItem?.quantity ?? 0}
                        setValue={setQuantity}
                        value={quantity}
                        showLabel
                    />
                    <CustomizedSelect 
                        label="Why are you refunding this?"
                        menu={reasons.map(reason => ({ value: reason, label: reason }))}
                        onChange={(e) => setReason(e.target.value as string)}
                    />
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
    
                        <Button 
                            sx={{ color: isDark ? 'white' : 'red', borderColor: isDark ? 'white' : ''}} 
                            variant={isDark ? "outlined" : "text"}
                            startIcon={<VideocamIcon />} 
                            onClick={triggerFileSelect}
                        >
                            Upload Video
                        </Button>

                        {videoFile && (
                            <VideoContainer videoFile={videoFile}/>
                        )}
                    </div>
                    <p>Note: NO VIDEO, NO REFUND</p>
                    <div className="grid grid-cols-2 gap-5">
                        <Button 
                            variant="outlined" 
                            disabled={loading}
                            sx={{ border: 1, borderColor: 'gray', color: isDark ? 'white' : 'black'}}
                            onClick={close}
                        >Close</Button>
                        <RedButton 
                            onClick={handleSubmit}
                            disabled={!reason || !quantity || !videoFile || !description || loading}
                        >Submit Request</RedButton>
                    </div>
                </Card>
        </Modal>
    )
}

export default RequestRefundModal