import { Breadcrumbs, Chip, Link, type BreadcrumbsProps } from "@mui/material";
import type React from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DarkmodeContext } from "../context/DarkmodeContext";
import { useContext } from "react";

interface BreadCrumbsProps extends BreadcrumbsProps{
    breadcrumbs: { label: string; href: string }[];
}

const BreadCrumbs : React.FC<BreadCrumbsProps> = ({ breadcrumbs, ...props }) => {
    const context = useContext(DarkmodeContext);

    return (
        <Breadcrumbs 
            aria-label="breadcrumb"  
            separator={<NavigateNextIcon fontSize="small" />} {...props}
            sx={{ color:  context?.theme === 'dark' ? 'white' : 'black'}}
        >
            {breadcrumbs.map((breadcrumb, index) => (
                index === breadcrumbs.length - 1 ? 
                <Chip 
                    label={breadcrumb.label} 
                    variant="outlined"
                    sx={{ minWidth: '70px', fontWeight: 'bold', backgroundColor: 'white' }}
                    onClick={() => window.location.href = breadcrumb.href }
                /> :
                <Link
                    underline="hover"
                    key={index}
                    sx={{ color: context?.theme === 'dark' ? 'white' : 'black' }}
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