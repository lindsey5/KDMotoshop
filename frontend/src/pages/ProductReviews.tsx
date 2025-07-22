import { memo, useContext, useEffect, useMemo, useState } from "react";
import useDarkmode from "../hooks/useDarkmode"
import { fetchData } from "../services/api";
import { cn, maskMiddle } from "../utils/utils";
import { CircularProgress, Rating } from "@mui/material";
import Card from "../components/cards/Card";
import { formatDate } from "../utils/dateUtils";
import CustomizedPagination from "../components/Pagination";
import { CustomizedChip } from "../components/Chip";
import { AdminContext } from "../context/AdminContext";
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';

const ProductReviews = ({ product_id } : { product_id : string }) => {  
    const isDark = useDarkmode();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { admin } = useContext(AdminContext);
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });

    if (!product_id) return null;

    const rating : number = useMemo(() => Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)) || 0, [reviews]); 

    useEffect(() => {
        const getReviews = async () => {
            setLoading(true)
            const response = await fetchData(`/api/review/product/${product_id}?page=${pagination.page}&limit=10&rating=${selectedRating || ''}`);
            if (response.success) {
                setReviews(response.reviews);
                setTotalReviews(response.overallTotal);
                setPagination(prev => ({...prev, totalPages: response.totalPages }));
            }
            setLoading(false)
        };

        getReviews();
    }, [pagination.page, product_id, selectedRating]);

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value }))
    };

    return (
        <div className="flex flex-col gap-5 py-5">
            <div className="flex items-center gap-5 justify-between flex-wrap mt-2">
                <h1 className={cn("text-2xl font-bold", isDark && 'text-white')}>Customer Reviews ({totalReviews})</h1>
                <div className="flex items-center gap-2">
                    <Rating 
                        name="read-only"
                        value={rating}
                        readOnly
                        precision={0.5}
                        size="large"
                        emptyIcon={<GradeOutlinedIcon fontSize="inherit" sx={{ color: isDark ? 'white' : ''}}/>}
                    />
                    <span className={cn("text-gray-500", isDark && 'text-gray-400')}>{rating} out of 5</span>
                </div>
            </div>
            <div className="flex gap-5 flex-wrap">
                <CustomizedChip 
                    label="All"
                    onClick={() => setSelectedRating(null)}
                    isSelected={selectedRating === null}
                />
                {Array.from({ length: 5 }, (_, index) => (
                    <CustomizedChip 
                        key={index + 1}
                        label={'★'.repeat(index + 1)}
                        onClick={() => setSelectedRating(index + 1)}   
                        isSelected={selectedRating === index + 1}
                    />
                ))}
            </div>
             {loading ? <div className="w-full flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red'}}/>
                </div> : reviews.length > 0 ? 
            reviews.map((review) => (
                <Card className={cn("flex flex-col gap-3", isDark && 'bg-[#121212]')}>
                    <strong>{admin ? `${review.customer_id.firstname} ${review.customer_id.lastname}` : maskMiddle(`${review.customer_id.firstname} ${review.customer_id.lastname}`)}</strong>
                     <Rating 
                        name="read-only"
                        value={review.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                    />
                    <div className="flex gap-2">
                        {review.orderItemId?.attributes && Object.entries(review.orderItemId.attributes).map(([key, value]) => (
                            <p key={key} className={cn("text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                        ))} 
                    </div>
                    <p className={cn("text-gray-500", isDark && 'text-gray-400')}>{formatDate(review.createdAt)}</p>
                    {review.review && <div className={cn("bg-gray-200 p-3 rounded-lg", isDark && 'bg-[#1e1e1e]')} dangerouslySetInnerHTML={{ __html: review.review }} />}
                </Card>
            ))
            : <p className={cn("text-xl", isDark && 'text-white')}>No Reviews</p>
        }
            {!loading && <CustomizedPagination 
                count={pagination.totalPages}
                onChange={handlePage}
                shape="rounded"
                size="large" 
            />}
        </div>
    )
}

export default memo(ProductReviews);