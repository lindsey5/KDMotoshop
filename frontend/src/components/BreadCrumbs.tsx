import { Breadcrumbs, Chip, Link, type BreadcrumbsProps } from "@mui/material";
import type React from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import useDarkmode from "../hooks/useDarkmode";

interface BreadCrumbsProps extends BreadcrumbsProps{
    breadcrumbs: { label: string; href: string }[];
}

const BreadCrumbs : React.FC<BreadCrumbsProps> = ({ breadcrumbs, ...props }) => {
    const isDark = useDarkmode();

    return (
        <Breadcrumbs 
            aria-label="breadcrumb"  
            separator={<NavigateNextIcon fontSize="small" />} {...props}
            sx={{ color:  isDark ? 'white' : 'black'}}
        >
            {breadcrumbs.map((breadcrumb, index) => (
                index === breadcrumbs.length - 1 ? 
                <Chip 
                    label={breadcrumb.label} 
                    variant="outlined"
                    sx={{ 
                        minWidth: '70px', 
                        fontWeight: 'bold', 
                        color: isDark ? 'white' : 'black',
                        backgroundColor: isDark ? 'red' : 'white' 
                    }}
                    onClick={() => window.location.href = breadcrumb.href }
                /> :
                <Link
                    underline="hover"
                    key={index}
                    sx={{ color: isDark ? 'white' : 'black' }}
                    href={breadcrumb.href}
                    aria-current="page"
                >
                {breadcrumb.label}
                </Link>  
            ))}
        </Breadcrumbs>
    );
}

export default BreadCrumbs;