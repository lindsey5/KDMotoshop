import type React from "react";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils"

type PageContainerProps = {
    className?: string;
    children: React.ReactNode;
}

const PageContainer = ({ className, children } : PageContainerProps) => {
    const isDark = useDarkmode();

    return (
        <div className={cn("transition-colors duration-600 p-5 bg-gray-100", className, isDark && 'text-white bg-[#121212]')}>
        {children}
        </div>
    )
}

export default PageContainer;