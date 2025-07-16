import { cn } from "../../../utils/utils";
import AboutSection from "./About";
import PopularCategoriesSection from "./Categories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client"

const MobileHome = () => {
    return (
            <div className="bg-white block lg:hidden">
                <div className='bg-[url(/road.jpg)] bg-cover h-screen px-5 overflow-hidden flex justify-center items-center gap-25'>
                    <motion.div 
                        className="space-y-8 text-white max-w-lg flex flex-col items-center"
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
                            className="border border-white cursor-pointer relative group mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-3 rounded-full font-bold overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-red-600/50 hover:scale-105 border border-red-500/50"
                            onClick={() => window.location.href = '/products'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            whileTap={{ scale: 0.95 }}
                        >
                        <span className="text-lg tracking-wide">SHOP NOW</span>
                        </motion.button>
                    </motion.div>
             </div>
                <PopularProductsSection />
                <PopularCategoriesSection />
                <AboutSection />
            </div>
    );
};

export default MobileHome;