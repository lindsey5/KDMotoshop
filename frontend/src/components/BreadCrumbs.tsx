import { Breadcrumbs, Link, type BreadcrumbsProps } from "@mui/material";
import type React from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface BreadCrumbsProps extends BreadcrumbsProps{
    breadcrumbs: { label: string; href: string }[];
}

const BreadCrumbs : React.FC<BreadCrumbsProps> = ({ breadcrumbs, ...props }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb"  separator={<NavigateNextIcon fontSize="small" />} {...props}>
        {breadcrumbs.map((breadcrumb, index) => (
            <Link
                underline="hover"
                key={index}
                sx={ index === breadcrumbs.length - 1 ? { fontWeight: 'bold', color: 'text.primary' } : { color: 'text.secondary' }}
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