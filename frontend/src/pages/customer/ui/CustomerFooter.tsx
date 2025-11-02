import { useEffect, useState } from "react";
import { fetchData } from "../../../services/api";
import { Link } from "@mui/material";
import { ThemeToggle } from "../../../components/Toggle";

const CustomIcon = ({ src, alt, path }: { src: string; alt: string; path: string }) => (
    <a href={path} target="_blank" rel="noopener noreferrer">
        <img className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:opacity-75 transition" src={src} alt={alt} />
    </a>
);

const CustomerFooter = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const getCategories = async () => {
        const response = await fetchData("/api/categories");
        if (response.success) {
            setCategories(response.categories);
        }
        };
        getCategories();
    }, []);

    return (
        <footer className="w-full px-6 sm:px-10 lg:px-20 pt-10 pb-10 text-white bg-black">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* Company Info */}
            <div className="flex flex-col gap-3">
            <img
                className="w-28 h-16 md:w-40 md:h-20 cursor-pointer"
                src="/kd-logo.png"
                alt="logo"
            />
            <p className="text-sm sm:text-base">KDmotoshop@gmail.com</p>
            <p className="text-sm sm:text-base">
                Blk. 2 Lot 19 Phase 1 Pinagsama, Taguig, Philippines.
            </p>
            </div>

            {/* Products Categories */}
            <div className="flex flex-col gap-3">
            <h1 className="text-lg md:text-xl font-bold border-b border-gray-600 pb-2">
                Products
            </h1>
            <div className="flex flex-col gap-2">
                {categories.map((category) => (
                <Link
                    key={category._id}
                    href="/"
                    underline="hover"
                    sx={{ color: "white", fontSize: { xs: "14px", md: "16px" } }}
                >
                    {category.category_name}
                </Link>
                ))}
            </div>
            </div>

            {/* Other Information */}
            <div className="flex flex-col gap-3">
            <h1 className="text-lg md:text-xl font-bold border-b border-gray-600 pb-2">
                Other Info
            </h1>
            <div className="flex flex-col gap-2">
                <Link href="/" underline="hover" sx={{ color: "white" }}>
                Home
                </Link>
                <Link href="/contact" underline="hover" sx={{ color: "white" }}>
                Contact
                </Link>
                <Link href="/privacy-policy" underline="hover" sx={{ color: "white" }}>
                Privacy Policy
                </Link>
                <Link href="/faq" underline="hover" sx={{ color: "white" }}>
                FAQ's
                </Link>
                <Link href="/terms-and-conditions" underline="hover" sx={{ color: "white" }}>
                Terms
                </Link>
            </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mt-10 border-t border-gray-700 pt-5">
            {/* Theme Toggle (only mobile) */}
            <div className="block sm:hidden">
            <ThemeToggle />
            </div>

            {/* Social Icons */}
            <div className="flex gap-5">
            <CustomIcon src="/icons/facebook.png" alt="facebook" path="https://www.facebook.com/KDmotoshop" />
            <CustomIcon src="/icons/youtube.svg" alt="youtube" path="https://www.youtube.com/@kdmotoshop3496" />
            <CustomIcon src="/icons/tiktok.webp" alt="tiktok" path="https://www.tiktok.com/@kdmotoshop_taguig" />
            </div>
        </div>
        </footer>
    );
};

export default CustomerFooter;
