import { useEffect, useState } from "react";
import { cn } from "../../utils/utils";
import { fetchData } from "../../services/api";
import Card from "../Card";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  color?: 'green' | 'purple' | 'red' | 'yellow'; 
};

const StatsCard = ({ title, value, subtitle, color = "green" }: StatCardProps) => {
    const colorMap: Record<string, string> = {
        green: "bg-green-500",
        purple: "bg-purple-500",
        red: "bg-red-500",
        yellow: "bg-yellow-500",
    };

    return (
        <div className="flex-1">
            <h2 className="font-bold text-gray-500">{title}</h2>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{value}</h1>
                <hr className={cn(`w-5 h-2 border-none`, colorMap[color])} />
            </div>
            <p className="text-sm 2xl:text-md text-gray-400 mt-1">{subtitle}</p>
        </div>
    );
};

type CardValue = {
    overallTotalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
}

export const StatsCards = () => {
    const [cardValues, setCardValues] = useState<CardValue>(
        {
            overallTotalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0
        }
    );

    useEffect(() => {
        const fetchCardValues = async () => {
            const response = await fetchData('/api/order/statistics');
                if (response.success) {
                    setCardValues({
                    overallTotalOrders: response.overallTotalOrders,
                    pendingOrders: response.pendingOrders,
                    completedOrders: response.completedOrders,
                    cancelledOrders: response.cancelledOrders
                });
            }
        }
        fetchCardValues();
    }, [])

    return (
        <Card className="h-[150px] flex items-center gap-10">
            <StatsCard title="Total Orders" value={cardValues.overallTotalOrders.toString()} subtitle="Total Orders for last 365 days"/>
            <hr className="h-full border-1 border-gray-200" />
        
            <StatsCard title="Pending Orders" value={cardValues.pendingOrders.toString()} subtitle="Total Pending Orders" color="yellow"/>
            <hr className="h-full border-1 border-gray-200" />
        
            <StatsCard title="Completed Orders" value={cardValues.completedOrders.toString()} subtitle="Completed Orders for last 365 days" color="purple"/>
            <hr className="h-full border-1 border-gray-200" />
        
            <StatsCard title="Cancelled Orders" value={cardValues.cancelledOrders.toString()} subtitle="Cancelled Orders for last 365 days" color="red"/>
        </Card>
    )
}