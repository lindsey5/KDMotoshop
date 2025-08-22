import useDarkmode from "../../../../hooks/useDarkmode";
import { cn } from "../../../../utils/utils";
import Card from "../../../../components/Card";
import { type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon; // pass any lucide-react icon
}

const DashboardCard = ({ label, value, icon: Icon }: DashboardCardProps) => {
  const isDark = useDarkmode();
  return (
    <Card className="p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-sm font-medium text-gray-500", isDark && 'text-gray-300')}>{label}</p>
          <h1 className={cn("mt-2 text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight", isDark && 'text-white')}>
            {value}
          </h1>
        </div>

        {Icon && (
          <div className="p-3 rounded-xl bg-gray-100 text-gray-700">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
