import ChatbotButton from "../../../components/buttons/Chatbot";
import CustomerFooter from "../ui/CustomerFooter";
import CustomerHeader from "../ui/CustomerHeader";
import { cn } from "../../../utils/utils";
import AboutSection from "./About";
import PopularCategoriesSection from "./PopularCategories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client";
import PromoSection from "./Promo";
import FacebookPageMap from "./FacebookPage";

const MobileHome = () => {

    return (
        <div className="bg-white block lg:hidden">
        {/* ✅ Mobile Header */}
        <CustomerHeader />

        {/* ✅ Hero Section (Responsive) */}
        <div className="relative bg-[url(/bg.png)] bg-cover min-h-[80vh] px-5 flex flex-col justify-center items-center text-center">
            <motion.div
            className="space-y-6 text-white max-w-md flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            >
            <motion.h2
                className={cn("text-4xl font-black leading-tight")}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                RIDE BETTER.
                <br />
                <span className="text-red-500">SHOP BETTER.</span>
            </motion.h2>

            <motion.p
                className="text-base sm:text-lg text-white px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                Your shop for legit and affordable helmets, racks, intercoms, and riding gear—trusted by riders, built for every journey.
            </motion.p>

            <motion.button
                className="cursor-pointer mt-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                onClick={() => window.location.href = '/products'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                <span className="text-md sm:text-lg tracking-wide">SHOP NOW</span>
            </motion.button>
            </motion.div>
        </div>

        {/* ✅ Sections (Still Mobile Friendly) */}
        <PopularProductsSection isParallax={false} />
        <PopularCategoriesSection />
        <FacebookPageMap />
        <AboutSection isParallax={false} />
        <PromoSection isParallax={false} />

        {/* ✅ Footer + Chatbot (Mobile) */}
        <CustomerFooter />
        <ChatbotButton />
        </div>
    );
};

export default MobileHome;
