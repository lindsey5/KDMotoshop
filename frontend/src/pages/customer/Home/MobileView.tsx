import ChatbotButton from "../../../components/buttons/Chatbot";
import CustomerFooter from "../ui/CustomerFooter";
import CustomerHeader from "../ui/CustomerHeader";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils";
import AboutSection from "./About";
import PopularCategoriesSection from "./PopularCategories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client";
import PromoSection from "./Promo";
import RippleGrid from "../../../components/backgrounds/RippleGrid";

const MobileHome = () => {
    const isDark = useDarkmode();

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
                className={cn("text-5xl font-black leading-tight")}
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
        <AboutSection isParallax={false} />
        <PromoSection isParallax={false} />

        {/* ✅ Responsive Map */}
        <iframe
            className={cn("w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100", isDark && "bg-[#121212]")}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.349116006964!2d121.05185327507307!3d14.522012278995932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bbee71caad35%3A0x8c8e2d4f2d0bdde3!2sKD%20Motoshop%20Pinagsama%20Branch!5e0!3m2!1sen!2sph!4v1752127835647!5m2!1sen!2sph"
            loading="lazy"
            allowFullScreen
        />

        {/* ✅ Footer + Chatbot (Mobile) */}
        <CustomerFooter />
        <ChatbotButton />
        </div>
    );
};

export default MobileHome;
