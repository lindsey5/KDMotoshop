import { useEffect, useState } from "react"
import { fetchData } from "../../../services/api"
import { RedButton } from "../../../components/Button";
import * as motion from "motion/react-client"
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type TopCategory = {
    totalQuantity: number;
    image: string;
    category: string;
}

const itemVariants = {
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    hidden: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
}

const containerVariants = {
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
    hidden: {
        transition: { staggerChildren: 0.08, staggerDirection: -1 },
    },
}

const PopularCategoriesSection = () => {
    const [categories, setCategories] = useState<TopCategory[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const pageSize = 3;
    
    useEffect(() => {
        const getCategories = async () => {
            const response = await fetchData('/api/category/top');
            if(response.success){
                setCategories(response.topCategories)
            }
        }

        getCategories()
    }, [])

    return (
        <section className="bg-gray-100 py-20">
            <h1 className="text-center text-5xl font-bold text-red-600">Popular Categories</h1>
            <motion.div 
                className="flex flex-wrap justify-center gap-20 mt-25 relative"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
            >
                <IconButton 
                    size="large" 
                    sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)'}}
                    onClick={() => setOffset(prev => prev - 1)}
                    disabled={offset === 0}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                {categories.slice(offset, offset + pageSize).map(category => (
                    <motion.div 
                        key={category.category} 
                        className="flex flex-col gap-5 items-center"
                        variants={itemVariants}
                        viewport={{ once: true }}
                    >
                        <img className="w-[300px] h-[300px] rounded-full border-2 border-gray-400" src={category.image} alt="" />
                        <h1 className="text-center font-bold text-red-600 text-3xl">{category.category}</h1>
                        <RedButton>Shop now</RedButton>
                    </motion.div>
                ))}
                <IconButton 
                    size="large" 
                    sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)'}}
                    onClick={() => setOffset(prev => prev + 1)}
                    disabled={offset + pageSize === categories.length}
                >
                    <ArrowForwardIosIcon fontSize="inherit"/>
                </IconButton>
            </motion.div>
        </section>
    )
}

export default PopularCategoriesSection