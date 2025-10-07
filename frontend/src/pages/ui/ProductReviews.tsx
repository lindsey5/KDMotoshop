import { memo, useMemo, useState } from "react";
import useDarkmode from "../../hooks/useDarkmode"
import { cn, maskMiddle } from "../../utils/utils";
import { CircularProgress, Rating } from "@mui/material";
import Card from "../../components/Card";
import { formatDate } from "../../utils/dateUtils";
import CustomizedPagination from "../../components/Pagination";
import { CustomizedChip } from "../../components/Chip";
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import { useSelector } from "react-redux";
import type { RootState } from "../../features/store";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const ProductReviews = ({ product_id } : { product_id : string }) => {  
    const isDark = useDarkmode();
    const params = new URLSearchParams(useLocation().search);
    const review_id = params.get("id");
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const { user } = useSelector((state : RootState) => state.user)

    if (!product_id) return null;
    const [page, setPage] = useState(1);
    const { data : reviewsRes, loading} = useFetch(`/api/reviews/product/${product_id}?page=${page}&limit=10&rating=${selectedRating || ''}&id=${review_id ?? ''}`)
    const rating : number = useMemo(() => {
        const reviews : Review[] = reviewsRes?.reviews;
        if(!reviews) return 0

        return Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
    }, [reviewsRes])

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    return (
        <div className="flex flex-col gap-5 py-5">
            <div className="flex items-center gap-5 justify-between flex-wrap mt-2">
                <h1 className={cn("text-2xl font-bold", isDark && 'text-white')}>Customer Reviews ({reviewsRes?.overallTotal})</h1>
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
                </div> : reviewsRes?.reviews.length > 0 ? 
                reviewsRes?.reviews.map((review : Review) => (
                    <Card className={cn("flex flex-col gap-3", isDark && 'bg-[#121212]')}>
                        <strong>{user?.role === 'Admin' || user?.role === 'Super Admin' ? `${review.customer_id.firstname} ${review.customer_id.lastname}` : maskMiddle(`${review.customer_id.firstname} ${review.customer_id.lastname}`)}</strong>
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
                count={reviewsRes?.totalPages}
                onChange={handlePage}
                shape="rounded"
                size="large" 
            />}
        </div>
    )
}

export default memo(ProductReviews);