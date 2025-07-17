import AboutSection from "./About";
import PopularCategoriesSection from "./Categories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client"
import { Parallax, ParallaxLayer, type IParallax } from '@react-spring/parallax'
import { useRef, } from "react";
import CustomerFooter from "../../../components/partials/customer/CustomerFooter";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils";
import { CustomerContextProvider } from "../../../context/CustomerContext";
import MobileHome from "./MobileView";

const KDMotoshopHome = () => {
    const parallax = useRef<IParallax>(null!)
    const isDark = useDarkmode();

    return (
        <CustomerContextProvider>
            <div className="transition-colors duration-600 border-box">
                <MobileHome />
                <Parallax ref={parallax} pages={4} className='bg-[url(/road.jpg)] bg-cover bg-white hidden lg:block'>
                    <ParallaxLayer offset={0} speed={0.2} className="z-10">
                         <div className='h-screen px-5 overflow-hidden flex justify-center items-center gap-25'>
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
                                className="z-10 relative border border-white cursor-pointer relative group mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-3 rounded-full font-bold overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-red-600/50 hover:scale-105 border border-red-500/50"
                                onClick={() => window.location.href = '/products'}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                whileTap={{ scale: 0.95 }}
                                >
                                <span className="relative z-10 text-lg tracking-wide">SHOP NOW</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </ParallaxLayer>
                    <ParallaxLayer offset={0} speed={-0.3}>
                        <img src="/moto-pov.png" className="w-full lg:h-[1200px] xl:h-[1500px] 2xl:h-[2000px]"/>
                    </ParallaxLayer>
                    <ParallaxLayer offset={1} speed={1} factor={2}>
                        <PopularProductsSection />
                        <PopularCategoriesSection />
                        <AboutSection />
                        <iframe className={cn("w-full p-20 bg-gray-100 hidden xl:block", isDark && "bg-[#121212]")} height="700" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.349116006964!2d121.05185327507307!3d14.522012278995932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bbee71caad35%3A0x8c8e2d4f2d0bdde3!2sKD%20Motoshop%20Pinagsama%20Branch!5e0!3m2!1sen!2sph!4v1752127835647!5m2!1sen!2sph" loading="lazy" />
                    </ParallaxLayer>
                    <ParallaxLayer offset={3} speed={1} className="flex items-end">
                        <CustomerFooter />
                    </ParallaxLayer>
                </Parallax>
            </div>
        </CustomerContextProvider>
    );
};

export default KDMotoshopHome;