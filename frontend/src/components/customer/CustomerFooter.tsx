import { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import { Link } from "@mui/material";

const CustomIcon = ({ src, alt, path }: { src: string; alt: string, path: string }) => (
  <a href={path} target="_blank">
    <img className="w-15 h-15 cursor-pointer hover:opacity-75" src={src} alt={alt} />
  </a>
);

const CustomerFooter = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const getCategories = async () => {
            const response = await fetchData('/api/category')
            if(response.success){
                setCategories(response.categories)
            }
        }
        getCategories();
    }, [])

    return (
        <footer className="px-20 pt-20 pb-10 text-white shadow-red-600/25 bg-gradient-to-br from-black via-red-900 to-gray-900">
            <div className="flex flex-col md:flex-row gap-20">
                <div className="flex-1 flex flex-col gap-3 items-start">
                    <img className="w-50 h-25 cursor-pointer" src="/kd-logo.png" alt="" />
                    <p className="text-lg">KDmotoshop@gmail.com</p>
                    <p className="text-lg">Blk. 2 Lot 19 Phase 1 Pinagsama, Taguig, Philippines.</p>
                </div>

                <div className="flex-1 flex flex-col gap-3 items-start">
                    <h1 className="w-full font-bold text-2xl mb-2 border-b-1 border-gray-300 pb-5">Products</h1>
                    {categories.map(category => (
                        <Link href="/" underline="hover" sx={{ color: "white"}}>{category.category_name}</Link>
                    ))}
                </div>
                <div className="flex-1 flex flex-col gap-3 items-start">
                    <h1 className="w-full font-bold text-2xl mb-2 border-b-1 border-gray-300 pb-5">Other Info</h1>
                    <Link href="/" underline="hover" sx={{ color: "white"}}>Home</Link>
                    <Link href="/" underline="hover" sx={{ color: "white"}}>Contact</Link>
                    <Link href="/" underline="hover" sx={{ color: "white"}}>Privacy Policy</Link>
                    <Link href="/" underline="hover" sx={{ color: "white"}}>FAQ's</Link>
                </div>
            </div>
            <div className="flex justify-end gap-5 mt-20">
                <CustomIcon src="/icons/facebook.png" alt="facebook" path="https://www.facebook.com/KDmotoshop" />
                <CustomIcon src="/icons/youtube.svg" alt="lazada" path="https://www.youtube.com/@kdmotoshop3496" />
                <CustomIcon src="/icons/tiktok.webp" alt="lazada" path="https://www.tiktok.com/@kdmotoshop_taguig" />
            </div>
        </footer>
    )
}

export default CustomerFooter