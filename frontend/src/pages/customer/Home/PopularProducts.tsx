import { Link } from "@mui/material";
import { RedButton } from "../../../components/buttons/Button";
import CustomerProductContainer from "../Product/ui/CustomerProductContainer";
import * as motion from "motion/react-client"
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import { Title } from "../../../components/text/Text";
import useFetch from "../../../hooks/useFetch";

const itemVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
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
        transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
    hidden: {
        transition: { staggerChildren: 0.5, staggerDirection: -1 },
    },
}

const PopularProductsSection = ({ isParallax } : { isParallax : boolean }) => {
    const { data } = useFetch("/api/products/top?limit=4")
    const isDark = useDarkmode()

    return (
        <section className={cn("bg-white transition-colors duration-600 px-3 py-20 lg:px-10 lg:py-20 flex flex-col items-center", isDark && 'bg-[#1e1e1e]',isDark && isParallax && 'bg-gray-900/20 backdrop-blur-md rounded-xl shadow-lg')}>
        <div className="w-full">
            <Title className="text-2xl md:text-4xl">Most Selling Products</Title>
        </div>

        <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-12 md:gap-10 gap-5"
            >
            {data?.topProducts.map((product : TopProduct) => (
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