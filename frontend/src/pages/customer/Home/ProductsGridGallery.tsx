import { useEffect, useState } from "react"
import GridMotion from "../../../components/GridMotion"
import { getProducts } from "../../../services/productService";

const ProductsGrid = () => {
    const [items, setItems] = useState<string[]>([]);

    const getAllProducts = async () => {
        const response = await getProducts(`page=1&limit=30&visibility=Published`);

        if (response.success) {
            const thumbnails = response.products.map((product: any) => product.thumbnail.imageUrl);
            const repeated = thumbnails.length < 10 ? Array(10).fill(thumbnails).flat() : thumbnails;
            setItems(repeated);
        }
    };

    useEffect(() => {
        getAllProducts()
    }, [])

    return (
        <GridMotion items={items} />
    )
}

export default ProductsGrid