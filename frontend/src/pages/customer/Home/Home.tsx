import AboutSection from "./About";
import PopularCategoriesSection from "./PopularCategories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client"
import { Parallax, ParallaxLayer, type IParallax } from '@react-spring/parallax'
import { useRef, } from "react";
import { cn } from "../../../utils/utils";
import MobileHome from "./MobileView";
import CustomerHeader from "../ui/CustomerHeader";
import SplashCursor from "../../../components/SplashCursor";
import useDarkmode from "../../../hooks/useDarkmode";
import RippleGrid from "../../../components/backgrounds/RippleGrid";
import TextType from "../../../components/text/TextType";
import ChatbotButton from "../../../components/buttons/Chatbot";
import { useSelector } from "react-redux";
import type { RootState } from "../../../features/store";
import { Navigate } from "react-router-dom";
import PromoSection from "./Promo";

const KDMotoshopHome = () => {
    const parallax = useRef<IParallax>(null!)
    const isDark = useDarkmode();
    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)

    if (user && user.role !== 'Customer' && !userLoading) {
        return <Navigate to="/admin/login" />;
    }

    return (
            <div className="transition-colors duration-600 border-box">
                {isDark && <SplashCursor />}
                <ChatbotButton />
                <MobileHome />
                <Parallax ref={parallax} pages={7} className='bg-[url(/bg.png)] bg-cover bg-white hidden lg:block'>
                    <ParallaxLayer className="relative z-100" offset={0}>
                        <CustomerHeader />
                         <div className='relative h-screen px-5 overflow-hidden flex justify-center items-center gap-25'>
                            <motion.div 
                                className="space-y-8 text-white max-w-xl flex flex-col items-center"
                            >
                                <motion.h2 
                                    className={cn("text-5xl lg:text-7xl font-black text-center text-white")}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                RIDE BETTER.
                                <br />
                                <span className="text-red-500">SHOP BETTER.</span>
                                </motion.h2>
                                <motion.p 
                                    className="text-center text-xl  text-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                >
                                    Easy shopping, secure payments, and genuine products guaranteed.
                                </motion.p>  
                                <motion.button 
                                    className="relative border border-white cursor-pointer relative group mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-3 rounded-full font-bold overflow-hidden shadow-2xl shadow-red-600 hover:scale-105 border border-red-500/50"
                                    onClick={() => window.location.href = '/products'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.5 }}
                                >
                                <span className="relative text-lg tracking-wide">SHOP NOW</span>
                                </motion.button> 
                            </motion.div>
                        </div>
                        
                    </ParallaxLayer>

                    <ParallaxLayer offset={0} speed={-0.2}>
                        <RippleGrid
                            enableRainbow
                            rippleIntensity={0.05}
                            gridSize={10}
                            gridThickness={15}
                            mouseInteraction={true}
                            mouseInteractionRadius={1.2}
                            opacity={0.8}
                        />
                    </ParallaxLayer>
                    

                    <ParallaxLayer className="relative flex justify-center items-center z-10" offset={1} speed={1}>
                        <TextType 
                            text ={["Welcome to KD Motoshop", "Find everything you need", "Enjoy seamless checkout!", "Thanks for shopping with us!"]}
                            typingSpeed={75}
                            className="text-6xl font-bold"
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                    </ParallaxLayer>

                    <ParallaxLayer className="relative" sticky={{ start: 1, end: 1.3 }}>
                        <img className="w-100 h-45 absolute right-20 bottom-[60%]" src="/icons/satellite.png" />
                    </ParallaxLayer>

                    <ParallaxLayer offset={2} speed={0.3}>
                        <PopularProductsSection isParallax />
                    </ParallaxLayer>
                    <ParallaxLayer offset={3} speed={0.3}>
                        <PopularCategoriesSection />
                    </ParallaxLayer>

                    <ParallaxLayer offset={4} speed={0.3}>
                        <PromoSection isParallax={true} />
                    </ParallaxLayer>

                    <ParallaxLayer offset={5} speed={0.5}>
                        <AboutSection isParallax={true}/>
                    </ParallaxLayer>

                    <ParallaxLayer className="relative" sticky={{ start: 5, end: 5.2 }}>
                        <img className="absolute right-20 bottom-1/2 translate-y-1/2" src="/icons/Astronot.gif" />
                    </ParallaxLayer>

                    <ParallaxLayer offset={6} speed={0.3}>
                        <img className="w-full h-screen" src="/moon.png" />
                    </ParallaxLayer>

                    <ParallaxLayer offset={6} speed={-0.2}>
                        <img className="w-full h-screen" src="/mountain.png" />
                    </ParallaxLayer>
                
                    <ParallaxLayer offset={6}>
                        <img className="w-full h-screen" src="/road.png" />
                    </ParallaxLayer>

                    <ParallaxLayer offset={6.3} speed={-0.3}>
                        <img className="w-full h-screen" src="/moto-pov.png" />
                    </ParallaxLayer>
                </Parallax>
            </div>
    );
};

export default KDMotoshopHome;