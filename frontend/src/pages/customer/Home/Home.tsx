import AboutSection from "./About";
import PopularCategoriesSection from "./Categories";
import PopularProductsSection from "./PopularProducts";
import * as motion from "motion/react-client"

const SpeedLines = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"
          style={{
            top: `${20 + i * 10}%`,
            width: `${150 + i * 20}px`,
            left: '-200px',
            animation: `speedLine 2s linear infinite ${i * 0.2}s`
          }}
        />
      ))}
    </div>
);

const KDMotoshopHome = () => {

    return (
            <div className="bg-white">
                <div className='h-screen p-5 relative shadow-red-600/25 bg-gradient-to-br from-black via-red-900 to-gray-900 overflow-hidden flex justify-center items-center gap-25'>
                    <SpeedLines />
                    <motion.div 
                        className="relative space-y-8 text-white max-w-lg flex flex-col items-center lg:items-start z-10"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.h2 
                            className="lg:text-6xl font-black text-center lg:text-start bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Ride better.
                            <br />
                            <span className="text-red-500">Shop better.</span>
                        </motion.h2>
                                    
                        <motion.p 
                            className="text-center text-xl lg:text-start text-gray-300 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Your shop for legit and affordable helmets, racks, intercoms, and riding gear—trusted by riders, built for every journey.
                        </motion.p>
                            
                        <motion.button 
                            className="cursor-pointer relative group mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-3 rounded-full font-bold overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-red-600/50 hover:scale-105 border border-red-500/50"
                            onClick={() => window.location.href = '/products'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                             whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 text-lg tracking-wide">SHOP NOW</span>
                        </motion.button>
                    </motion.div>
                    <div className="relative w-[450px] h-[450px] hidden md:block">
                        <motion.div
                            className="border-3 border-white absolute w-[350px] h-[350px] rounded-lg"
                            initial={{ opacity: 0, x: -50}}
                            whileInView={{ opacity: 1, x: 0}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <img src="/evo.jpg" alt="" />
                        </motion.div>
                        <motion.div
                            className="border-3 border-white w-[250px] h-[250px] absolute -bottom-10 md:right-5 xl:-right-30 rounded-lg"
                            initial={{ opacity: 0, x: 50}}
                            whileInView={{ opacity: 1, x: 0}}
                            transition={{ duration: 0.6, delay: 0.4}}
                        >
                            <img src="/topbox.jpg" alt="" />
                        </motion.div>
                    </div>
                </div>
                <PopularProductsSection />
                <PopularCategoriesSection />
                <AboutSection />
                <div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.349116006964!2d121.05185327507307!3d14.522012278995932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397bbee71caad35%3A0x8c8e2d4f2d0bdde3!2sKD%20Motoshop%20Pinagsama%20Branch!5e0!3m2!1sen!2sph!4v1751989631542!5m2!1sen!2sph" width="600" height="450" loading="lazy"></iframe>
                </div>
            </div>
    );
};

export default KDMotoshopHome;