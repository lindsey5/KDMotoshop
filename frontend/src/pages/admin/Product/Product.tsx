import { useEffect, useState } from "react"
import { RedTextField } from "../../../components/Textfield"
import { fetchData } from "../../../services/api";
import { CustomizedSelect } from "../../../components/Select";
import { red } from "@mui/material/colors";
import { Backdrop, Button, CircularProgress, FormControlLabel, IconButton, Radio, RadioGroup } from "@mui/material";
import { RedButton } from "../../../components/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { confirmDialog, errorAlert } from "../../../utils/swal";
import VariantContainer from "../../../components/product/VariantContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveProduct } from "../../../services/productService";
import BreadCrumbs from "../../../components/BreadCrumbs";
import ProductThumbnail from "../../../components/product/ProductThumbnail";
import ProductImages from "../../../components/product/ProductImages";
import Card from "../../../components/Card";

const RedRadio = ({ label, value } : { label: string, value: string }) => {
    return (
        <FormControlLabel
            value={value} 
            control={( <Radio 
                sx={{
                    '&.Mui-checked': {
                        color: red[600],
                    },
                }}
            /> )} 
             label={label} 
        />   
    )
}

const ProductPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [categories, setCategories] = useState<Menu[]>([]);
    const [attributeName, setAttributeName] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string>('/photo.png');
    const [loading, setLoading] = useState<boolean>(false)
    const [product, setProduct] = useState<Product>({
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
        weight: 0,
    });

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Products', href: '/admin/products' },
        { label: `${id ? 'Edit' : 'Create'} Product`, href: '/admin/products/product' },

    ]

    const getCategories = async () => {
        const response = await fetchData('/api/category');
        if(response.success) setCategories(response.categories.map((category : Category) => ({ value: category.category_name, label: category.category_name  })));
    }

    const getProduct = async (id : string) => {
        const response = await fetchData(`/api/product/${id}`);
        if(response.success) setProduct(response.product)
        else navigate('/admin/products')
    }

    useEffect(() => {
        if(id) getProduct(id as string);
        getCategories();
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

    const handleNoDecimal = (input : string, field : string) => {
        if (input === '' || /^\d+$/.test(input)) {
            setProduct({ ...product, [field]: input});
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
            errorAlert('Attribute already exist', '')
        }
    };
    
    const deleteAttribute = async (attributeName: string) => {
        if (await confirmDialog("Remove this attribute?", "")) {
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
        const confirm = await confirmDialog("Remove this image?", "");
        if (confirm) {
            setProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
            }));

            setSelectedImage(product.images[0] as string || '');
        }
    };

    return <div className="min-w-[1000px] min-h-full p-5 bg-gray-100 relative">
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <div>
            <h1 className="font-bold text-4xl mb-4">{id ? 'Edit' : 'Create'} Product</h1>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </div>
        <div className="flex items-start gap-10 mt-6">
            <div className="flex-1">
                <Card className="flex flex-col gap-5">
                    <h1 className="text-lg font-bold">Basic Information</h1>
                    <div className="grid grid-cols-2 gap-10">
                    <RedTextField 
                        label="Product name" 
                        placeholder="Enter product name"
                        onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
                        value={product.product_name}
                    />
                    <CustomizedSelect 
                        label="Category" 
                        menu={categories} 
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value as string})}
                    />
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
                        <h1 className="text-gray-500">Product Type</h1>
                        <RadioGroup
                            row
                            value={product?.product_type}
                            onChange={handleProductType}
                        >
                            <RedRadio label="Single" value="Single" />
                            <RedRadio label="Variable" value="Variable" />
                        </RadioGroup>
                    </div>
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
                            value={product.stock}
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
                            <div className="flex flex-col gap-5 p-3 bg-gray-100">
                                {product.attributes.map((attribute, i)=> (
                                    <div key={i} className="p-5 bg-white rounded-md flex justify-between items-center">
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

                {product.product_type === 'Variable' && <div className="mt-8 bg-white p-5 rounded-lg shadow-md border-1 border-gray-300">
                    <div className="flex items-center justify-between mb-6">
                         <h1 className="text-lg font-bold">Product Variations</h1>
                         <RedButton
                            disabled={product.attributes.length < 1}
                            onClick={addVariant}
                        >Add Variation</RedButton>
                    </div>
                    {product.variants.length > 0 ? (
                        <div className="bg-gray-100 flex flex-col gap-5 p-5">
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
                </div>}
                <div className="flex justify-end gap-5 bg-white border-1 border-gray-300 p-5 rounded-lg shadow-lg mt-8">
                    <Button 
                        variant="outlined" sx={{ color: "gray", borderColor: 'gray'}}
                        onClick={() => navigate(-1)}
                    >Cancel</Button>
                    <RedButton onClick={() => saveProduct(product, setLoading)}>Save Product</RedButton>
                </div>
            </div>
            
            <div className="w-[30%] max-w-[350px] flex flex-col gap-6">
                <ProductThumbnail 
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
        </div>
    </div>
}

export default ProductPage