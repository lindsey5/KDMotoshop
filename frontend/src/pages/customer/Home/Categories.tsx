import { useEffect, useRef, useState } from "react"
import { fetchData } from "../../../services/api"
import { RedButton } from "../../../components/Button";

type TopCategory = {
    totalQuantity: number;
    image: string;
    category: string;
}

const PopularCategoriesSection = () => {
    const [categories, setCategories] = useState<TopCategory[]>([]);
    const sectionRef = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const getCategories = async () => {
            const response = await fetchData('/api/category/top');
            if(response.success){
                setCategories(response.topCategories.slice(0, 3))
            }
        }

        getCategories()

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target === sectionRef.current) {
                    setIsVisible(true);
                }
                });
            },
            { threshold: 0.5 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
        if (currentRef) observer.unobserve(currentRef);
        };
    }, [])

    return (
        <section className="bg-gray-100 py-20" ref={sectionRef}>
            <div className={`${isVisible ? 'md:animate-slide-to-t' : 'md:opacity-0'}`}>
                <h1 className="text-center text-5xl font-bold text-red-600">Popular Categories</h1>
                <div className="flex flex-wrap justify-center gap-20 mt-25">
                    {categories.map(category => (
                        <div key={category.category} className="flex flex-col gap-5 items-center">
                            <img className="w-[300px] h-[300px] rounded-full border-2 border-gray-400" src={category.image} alt="" />
                            <h1 className="text-center font-bold text-red-600 text-3xl">{category.category}</h1>
                            <RedButton>Shop now</RedButton>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PopularCategoriesSection