import AboutSection from "./About";
import PopularCategoriesSection from "./Categories";
import PopularProductsSection from "./PopularProducts";

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
            <div className="bg-white" id="home">
                <div className='h-screen relative shadow-red-600/25 bg-gradient-to-br from-black via-red-900 to-gray-900 overflow-hidden flex justify-center items-center gap-25'>
                    <SpeedLines />
                    <div className="relative space-y-4 text-white max-w-md flex flex-col items-center lg:items-start">
                        <h2 className="text-5xl font-bold text-center lg:text-start">Ride better. Shop better.</h2>
                        <p className="text-center text-xl lg:text-start">
                           Your shop for legit and affordable helmets, racks, intercoms, and riding gear—trusted by riders, built for every journey.
                        </p>
                        <button className="border-1 border-white cursor-pointer mt-4 bg-red-600 text-white px-8 py-2 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-700">
                        SHOP NOW
                        </button>
                    </div>
                    <div className="relative w-[450px] h-[450px] hidden md:block">
                        <img className="animate-slide-to-r border-3 border-white absolute w-[350px] h-[350px] rounded-lg" src="/evo.jpg" alt="" />
                        <img className="animate-slide-to-l border-3 border-white w-[250px] h-[250px] absolute -bottom-10 -right-30 rounded-lg" src="/topbox.jpg" alt="" />
                    </div>
                </div>
                <PopularProductsSection />
                <PopularCategoriesSection />
                <AboutSection />
            </div>
    );
};

export default KDMotoshopHome;