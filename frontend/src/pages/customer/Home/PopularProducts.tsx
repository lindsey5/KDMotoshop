import { useEffect, useState } from "react";
import { fetchData } from "../../../services/api";
import { Link } from "@mui/material";
import { RedButton } from "../../../components/Button";
import CustomerProductContainer from "../../../components/containers/customer/CustomerProductContainer";
import * as motion from "motion/react-client"

const itemVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    hidden: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
}

const containerVariants = {
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    hidden: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
}

const PopularProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getPopularProducts = async () => {
      const response = await fetchData("/api/product/top");
      if (response.success) {
        setProducts(response.topProducts);
      }
    };
    getPopularProducts();
  }, []);

  return (
    <section className="min-h-screen px-10 pt-30 flex flex-col items-center">
      <div className="w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600">Best Selling Products</h1>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-12 md:gap-10 gap-5"
        >
        {products.map((product) => (
          <motion.div
            key={product._id}
            variants={itemVariants}
          >
            <CustomerProductContainer className="w-full h-full" product={product} />
          </motion.div>
        ))}
      </motion.div>

      <Link href="/products">
        <RedButton>View all products</RedButton>
      </Link>
    </section>
  );
};

export default PopularProductsSection;