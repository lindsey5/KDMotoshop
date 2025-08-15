import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../../../services/api";
import PageContainer from "../../../components/containers/admin/PageContainer";
import ProductThumbnail from "../../../components/images/ProductThumbnail";
import { IconButton, Rating } from "@mui/material";
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import useDarkmode from "../../../hooks/useDarkmode";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { Title } from "../../../components/text/Text";
import ProductReviews from "../../ProductReviews";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const AdminProductReviews = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>();
    const isDark = useDarkmode();
    const navigate = useNavigate();
    
    useEffect(() => {
        const getProductAsync = async () => {
            const response = await fetchData(`/api/products/${id}`);
            if(response.success) {
                setProduct(response.product)
            }
        }

        getProductAsync()
    }, [])

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
                    product={product}
                />
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{product?.product_name}</h1>
                    <p>{product?.category}</p>
                    <Rating 
                        sx={{ fontSize: 30 }} 
                        name="read-only" 
                        value={product?.rating ?? 0} 
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