import React, { useEffect, useState } from "react"
import { RedTextField } from "../../../components/Textfield"
import { fetchData } from "../../../services/api";
import { CustomizedSelect } from "../../../components/Select";
import { Backdrop, Button, CircularProgress, IconButton, RadioGroup } from "@mui/material";
import { RedButton } from "../../../components/buttons/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { confirmDialog, errorAlert } from "../../../utils/swal";
import VariantContainer from "../../../components/containers/admin/VariantContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveProduct } from "../../../services/productService";
import BreadCrumbs from "../../../components/BreadCrumbs";
import AddProductThumbnail from "../../../components/cards/admin/AddProductThumbnail";
import ProductImages from "../../../components/cards/admin/ProductImages";
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import { RedRadio } from "../../../components/Radio";
import { Title } from "../../../components/text/Text";
import Card from "../../../components/cards/Card";
import PageContainer from "../../../components/containers/admin/PageContainer";

const productInitialState = {
    product_name: '',
    description: '',
    category: '',
    product_type: 'Single',
    sku: undefined,
    price: undefined,
    stock: undefined,
    visibility: 'Published',
    images: [],
    thumbnail: null,
    attributes: [],
    variants: [],
    weight: 0.5,
}

type CategorySelectProps = {
    value: string;
    handleChange: (value : string) => void
}

const CategorySelect : React.FC<CategorySelectProps> = ({ value, handleChange }) => {
    const [categories, setCategories] = useState<Menu[]>([]);

    const getCategories = async () => {
        const response = await fetchData('/api/category');
        if(response.success) setCategories(response.categories.map((category : Category) => ({ value: category.category_name, label: category.category_name  })));
    }

    useEffect(() =>{
        getCategories()
    }, [])

    return (
        <CustomizedSelect 
            label="Category" 
            menu={categories} 
            value={value}
            onChange={(e) => handleChange(e.target.value as string)}
        />
    )
}

const ProductPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const isDark = useDarkmode();
    const [attributeName, setAttributeName] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string>('/photo.png');
    const [loading, setLoading] = useState<boolean>(false)
    const [product, setProduct] = useState<Product>(productInitialState);

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Products', href: '/admin/products' },
        { label: `${id ? 'Edit' : 'Create'} Product`, href: '/admin/products/product' },
    ]


    const getProduct = async (id : string) => {
        const response = await fetchData(`/api/product/${id}`);
        if(response.success) setProduct(response.product)
        else navigate('/admin/products')
    }

    useEffect(() => {
        if(id) getProduct(id as string);
    }, [])

    const handleProductType = (event: React.ChangeEvent<HTMLInputElement>) =>  setProduct({...product, product_type: event.target.value});
    const handleVisibility = (event: React.ChangeEvent<HTMLInputElement>) =>  setProduct({...product, visibility: event.target.value});

    const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct({...product, thumbnail: reader.result})
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result as string]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addVariant = () => {
        const attributesObject = product.attributes.reduce((acc, attr) => {
                acc[attr] = '';
                return acc;
        }, {} as { [key: string]: string });

        setProduct(prev => ({
            ...prev,
            variants: [...prev.variants, { 
                sku: '',
                price: null,
                stock: null,
                image: null,
                attributes: attributesObject
            }]
        }))
    }

    const handleNoDecimal = (input: string, field: string) => {
        if (input === '' || /^\d+$/.test(input)) {
            setProduct(prev => ({ ...prev, [field]: input }));
        }
    };

    const addAttribute = () => {
        if(attributeName && !product.attributes.find(attribute => attribute === attributeName)){
            setProduct(prev => ({
                ...prev,
                attributes: [...prev.attributes, attributeName],
                variants: prev.variants.map(variant => ({ ...variant, attributes: { ...variant.attributes, [attributeName] : '' }}))
            }));
            setAttributeName('')
        }else{
            errorAlert('Attribute already exist', '', isDark)
        }
    };
    
    const deleteAttribute = async (attributeName: string) => {
        if (await confirmDialog("Remove this attribute?", "", isDark)) {
            setProduct(prev => ({
            ...prev,
            attributes: prev.attributes.filter(attr => attr !== attributeName),
            variants: prev.variants.map(variant => ({
                ...variant,
                attributes: Object.fromEntries(
                    Object.entries(variant.attributes).filter(([key]) => key !== attributeName)
                )
            }))
            }));
        }
    };

    const deleteImage = async (index: number): Promise<void> => {
        const confirm = await confirmDialog("Remove this image?", "", isDark);
        if (confirm) {
            setProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
            }));

            setSelectedImage(product.images[0] as string || '');
        }
    };

    const handleCategoryChange = (newValue : string) => {
        setProduct({ ...product, category: newValue})
    }

    return <PageContainer>
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <div>
            <Title className="mb-4">{id ? 'Edit' : 'Create'} Product</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </div>
        <div className="grid xl:grid-cols-[2fr_370px] gap-x-10 gap-y-10 mt-6">
            <div className="w-full">
                <Card className="flex flex-col gap-5">
                    <h1 className="text-lg font-bold">Basic Information</h1>
                    <div className="grid grid-cols-2 gap-10">
                    <RedTextField 
                        label="Product name" 
                        placeholder="Enter product name"
                        onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
                        value={product.product_name}
                    />
                    <CategorySelect value={product.category} handleChange={handleCategoryChange}/>

                    </div>
                    <RedTextField 
                        label="Description" 
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        value={product.description}
                        placeholder="Add product description here"
                        fullWidth
                        multiline
                        rows={10}
                        inputProps={{ maxLength: 500 }}
                    />
                    <div className="flex gap-4 items-center">
                        <h1 className={cn(isDark ? "text-gray-300" : "text-gray-500")}>Product Type</h1>
                        <RadioGroup
                            row
                            value={product?.product_type}
                            onChange={handleProductType}
                        >
                            <RedRadio label="Single" value="Single" />
                            <RedRadio label="Variable" value="Variable" />
                        </RadioGroup>
                    </div>
                    <RedTextField 
                        label="Weight" 
                        type="number"
                        onChange={(e) => setProduct({ ...product, weight: Number(e.target.value)})}
                        value={product.weight}
                        placeholder="Add product weight"
                        fullWidth
                    />
                    {product.product_type === 'Single' ? 
                    (<div className="grid grid-cols-2 gap-10">
                        <RedTextField 
                            label="SKU" 
                            placeholder="Enter product SKU"
                            onChange={(e) => setProduct({ ...product, sku: e.target.value})}
                            value={product.sku || ''}
                        />
                        <RedTextField 
                            type="number"
                            label="Stock" 
                            value={!product.stock && product.stock !== 0 ? '' :product.stock}
                            placeholder="Enter stock"
                            onChange={(e) => handleNoDecimal(e.target.value, 'stock')}
                        />
                        <RedTextField 
                            label="Price" 
                            type="number"
                            onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
                            placeholder="Enter product price"
                            value={product.price || ''}
                        />
                    </div>) : (
                        <>
                        <h1 className="font-bold mt-8">Add product attributes</h1>
                        <div className="flex items-center gap-10 w-full">
                            <RedTextField 
                                sx={{ flex: 1 }}
                                label="Attribute name"
                                placeholder="Enter attribute name"
                                value={attributeName}
                                onChange={(e) => setAttributeName(e.target.value)}
                            />
                            <RedButton
                                disabled={!attributeName}
                                onClick={addAttribute}
                            >Add +</RedButton>
                        </div>
                        {product.attributes.length > 0 &&
                            <>
                            <h1 className="font-bold mt-10">All Attributes</h1>
                            <div className={cn("flex flex-col gap-5 p-3 ", isDark ? 'bg[#1e1e1e]' : 'bg-gray-100')}>
                                {product.attributes.map((attribute, i)=> (
                                    <div key={i} className={cn('p-5 bg-white rounded-md flex justify-between items-center border border-gray-300', isDark ? 'bg-[#121212] border-gray-600' : 'bg-white')}>
                                        <h2 className="font-bold text-lg">{attribute}</h2>
                                        <IconButton onClick={() => deleteAttribute(attribute)}>
                                            <DeleteIcon sx={{ color: 'red' }} fontSize="medium"/>
                                        </IconButton>
                                    </div>)
                                )}
                            </div>
                            </>
                        }
                        </>
                    )}
                </Card>

                {product.product_type === 'Variable' && <Card className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                         <h1 className="text-lg font-bold">Product Variations</h1>
                         <RedButton
                            disabled={product.attributes.length < 1}
                            onClick={addVariant}
                        >Add Variation</RedButton>
                    </div>
                    {product.variants.length > 0 ? (
                        <div className={cn("flex flex-col gap-5 p-5" , isDark ? 'bg-[#1e1e1e]' : 'bg-gray-100')}>
                        {product.variants.map((variant, i) =>(
                            <VariantContainer 
                                key={i}
                                index={i} 
                                variant={variant}
                                setProduct={setProduct}
                            />
                        ))}
                        </div>
                    ) :
                    <div className="flex justify-center">
                        <div>
                            <img className='h-60' src="/empty.png"/>
                            <p className="text-gray-400">There are no variations added for this product</p>
                        </div>
                    </div>}
                </Card>}
            </div>
            
            <div className="grid grid-cols-2 xl:flex xl:flex-col gap-6">
                <AddProductThumbnail 
                    product={product}
                    handleThumbnail={handleThumbnail}
                />
                <ProductImages 
                    images={product.images}
                    setSelectedImage={setSelectedImage}
                    deleteImage={deleteImage}
                    selectedImage={selectedImage}
                    handleImages={handleImages}
                />
                <Card>
                    <h1 className="mb-4">Product Visibility</h1>
                    <RadioGroup
                        row
                        value={product?.visibility}
                        onChange={handleVisibility}
                    >
                        <RedRadio label="Published" value="Published" />
                        <RedRadio label="Hidden" value="Hidden" />
                    </RadioGroup>
                </Card>
            </div>
            <Card className="flex justify-end gap-5">
                <Button 
                    variant="outlined" sx={{ color: "gray", borderColor: 'gray'}}
                    onClick={() => navigate(-1)}
                >Cancel</Button>
                <RedButton onClick={() => saveProduct(product, setLoading)}>Save Product</RedButton>
            </Card>
        </div>
   </PageContainer>
}

export default ProductPage