import { cn } from "../../utils/utils";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  color?: 'green' | 'blue' | 'red' | 'yellow'; 
};

const StatCard = ({ title, value, subtitle, color = "green" }: StatCardProps) => {
    const colorMap: Record<string, string> = {
        green: "bg-green-500",
        blue: "bg-blue-500",
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

export default StatCard