import { Button } from "@mui/material"
import { fetchData } from "../../../services/api";
import React, { useEffect, useState } from "react";
import Card from "../../Card";

type CategoryFilterProps = {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryFilterCard : React.FC<CategoryFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    
    const fetchCategories = async () => {
        const response = await fetchData('/api/category');
        if(response.success) setCategories(response.categories)
    }

    useEffect(() => {
        fetchCategories();
    }, [selectedCategory])

    return (
        <Card className="mt-6 flex items-center gap-5">
            <Button
                variant={selectedCategory === 'All' ? 'outlined' : 'text'}   
                onClick={() => setSelectedCategory('All')}
                sx={{ 
                    ...(selectedCategory === 'All' ? 
                        { backgroundColor: '#fee2e2', color: 'red', borderColor: 'red', borderWidth: 2} :
                        { color: 'black', ":hover": { backgroundColor: '#fee2e2', color: 'red' } }
                    ) 
                }}
            >All</Button>
            {categories.map(category => (
                <Button
                    key={category._id}
                    variant={selectedCategory === category.category_name ? 'outlined' : 'text'}   
                    onClick={() => setSelectedCategory(category.category_name)}
                    sx={{ 
                        ...(selectedCategory === category.category_name ? 
                            { backgroundColor: '#fee2e2', color: 'red', borderColor: 'red', borderWidth: 2} :
                            { color: 'black', ":hover": { backgroundColor: '#fee2e2', color: 'red' } }
                        ) 
                    }}
                >{category.category_name}</Button>
            ))}
        </Card>
    )
}

export default CategoryFilterCard;