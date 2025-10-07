import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../ui/PageContainer";
import ProductThumbnail from "../../ui/ProductThumbnail";
import { IconButton, Rating } from "@mui/material";
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import useDarkmode from "../../../hooks/useDarkmode";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { Title } from "../../../components/text/Text";
import ProductReviews from "../../ui/ProductReviews";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useFetch from "../../../hooks/useFetch";

const AdminProductReviews = () => {
    const { id } = useParams();
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const { data } = useFetch(`/api/products/${id}`)

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Products', href: '/admin/products'},
        { label: 'Reviews', href: `/admin/reviews/${id}` },
    ]

    return (
        <PageContainer className="min-h-full">
            <div className="flex items-center mb-4 gap-2">
                <IconButton onClick={() => navigate(-1)} sx={{ color: isDark? 'white' : ''}}>
                    <ArrowBackIosIcon />
                </IconButton>
                 <Title>Product Reviews</Title>
            </div>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <div className="flex gap-5 my-10">
                <ProductThumbnail 
                    className="w-50 h-50 rounded-md"
                    product={data?.product}
                />
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{data?.product.product_name}</h1>
                    <p>{data?.product.category}</p>
                    <Rating 
                        sx={{ fontSize: 30 }} 
                        name="read-only" 
                        value={data?.product.rating ?? 0} 
                        readOnly 
                        precision={0.5}
                        emptyIcon={<GradeOutlinedIcon fontSize="inherit" sx={{ color: isDark ? 'white' : ''}}/>}
                    />
                </div>
            </div>
            <ProductReviews product_id={id ?? ''} />
        </PageContainer>
    )
}

export default AdminProductReviews