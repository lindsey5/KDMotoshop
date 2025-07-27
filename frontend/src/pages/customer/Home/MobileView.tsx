import ChatbotButton from "../../../components/buttons/Chatbot";
import CustomerFooter from "../../../components/partials/customer/CustomerFooter";
import CustomerHeader from "../../../components/partials/customer/CustomerHeader";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils";
import AboutSection from "./About";
import PopularCategoriesSection from "./PopularCategories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client"

const MobileHome = () => {
    const isDark = useDarkmode();

    return (
            <div className="relative bg-white block lg:hidden">
                <CustomerHeader />
                <div className='relative bg-[url(/bg.png)] bg-cover h-screen px-5 overflow-hidden flex justify-center items-center gap-25'>
                    <motion.div 
                        className="z-5 space-y-8 text-white max-w-lg flex flex-col items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.h2 
                            className={cn("text-5xl lg:text-6xl font-black text-center text-white")}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            RIDE BETTER.
                            <br />
                            <span className="text-red-500">SHOP BETTER.</span>
                        </motion.h2>
                                                                        
                        <motion.p 
                            className="text-center text-xl  text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                        Your shop for legit and affordable helmets, racks, intercoms, and riding gear—trusted by riders, built for every journey.
                        </motion.p>
                        <motion.button 
                            className="relative border border-white cursor-pointer relative group mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-3 rounded-full font-bold overflow-hidden shadow-2xl shadow-red-600 hover:scale-105 border border-red-500/50"
                            onClick={() => window.location.href = '/products'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                        >
                            <span className="relative text-lg tracking-wide">SHOP NOW</span>
                        </motion.button> 
                                                            
                    </motion.div>
             </div>
                <PopularProductsSection isParallax={false} />
                <PopularCategoriesSection />
                <AboutSection isParallax={false}/>
                <iframe className={cn("w-full h-screen px-5 py-20 bg-gray-100", isDark && "bg-[#121212]")} height="700" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.349116006964!2d121.05185327507307!3d14.522012278995932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bbee71caad35%3A0x8c8e2d4f2d0bdde3!2sKD%20Motoshop%20Pinagsama%20Branch!5e0!3m2!1sen!2sph!4v1752127835647!5m2!1sen!2sph" loading="lazy" />
                <CustomerFooter />
                <ChatbotButton />
            </div>
    );
};

export default MobileHome;