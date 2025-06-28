import { useEffect, useState, useRef } from "react";
import { fetchData } from "../../../services/api";
import { cn, formatNumber } from "../../../utils/utils";
import { Link } from "@mui/material";
import { RedButton } from "../../../components/Button";

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
      className={cn("min-h-screen px-10 pt-30 flex flex-col items-center",  isVisible && products.length > 0 ? "animate-slide-to-t" : "opacity-0")}
      id="products"
      ref={sectionRef}
    >
        <div className="w-full">
          <h1 className="text-4xl font-bold text-red-600">Best Selling Products</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-12 gap-10">
          {products.map((product) => (
            <div key={product._id} className="bg-black rounded-md overflow-hidden">
              <img
                src={product.image}
                alt={product.product_name}
                className="w-full h-[250px] 2xl:h-[300px]"
              />
              <div className="p-3 flex flex-col gap-3">
                <h1 className="text-lg font-bold text-white">{product.product_name}</h1>
                <h1 className="text-2xl font-bold text-red-600">
                  ₱{formatNumber(product.price)}
                </h1>
              </div>
            </div>
          ))}
        </div>
        <Link href="/products">
          <RedButton>View all products</RedButton>
        </Link>
    </section>
  );
};

export default PopularProductsSection;
