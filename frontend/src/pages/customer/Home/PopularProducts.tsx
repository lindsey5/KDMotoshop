import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../services/api";
import { cn} from "../../../utils/utils";
import { Link } from "@mui/material";
import { RedButton } from "../../../components/Button";
import CustomerProductContainer from "../../../components/customer/ProductContainer";

type Product = {
  _id: string;
  product_name: string;
  price: number;
  image: string;
};

const PopularProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getPopularProducts = async () => {
      const response = await fetchData("/api/product/top");
      if (response.success) {
        setProducts(response.topProducts);
      }
    };
    getPopularProducts();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === sectionRef.current) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      className={cn("min-h-screen px-10 pt-30 flex flex-col items-center",  isVisible && products.length > 0 ? "md:animate-slide-to-t" : "md:opacity-0")}
      id="products"
      ref={sectionRef}
    >
        <div className="w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600">Best Selling Products</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-12 md:gap-10 gap-5">
          {products.map((product) => <CustomerProductContainer product={product}/>)}
        </div>
        <Link href="/products">
          <RedButton>View all products</RedButton>
        </Link>
    </section>
  );
};

export default PopularProductsSection;
