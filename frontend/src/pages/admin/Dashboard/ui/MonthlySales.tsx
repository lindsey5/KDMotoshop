import Card from "../../../../components/Card"
import AreaChart from "../../../../components/AreaChart"
import useFetch from "../../../../hooks/useFetch";
import { cn, formatNumber } from "../../../../utils/utils";
import useDarkmode from "../../../../hooks/useDarkmode";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const MonthlySales = () => {
    const { data } = useFetch('/api/sales/monthly')
    const isDark = useDarkmode()

    return (
        <Card className={cn("flex flex-col flex-3 mt-10 border-t-4 border-t-red-500", isDark && "bg-gradient-to-br from-red-950/40 to-[#2A2A2A] shadow-red-900/20 text-white")}>
            <h1 className="font-bold text-lg">Monthly Sales ({new Date().getFullYear()})</h1>
            <div className="flex-1">
                <AreaChart
                title=""
                labels={labels}
                datasets={[
                    {
                        label: 'Monthly Sales',
                        data: data?.monthlySales ?? [],
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    },
                ]}
            />
            </div>
            <h1 className="text-right text-xl font-bold mt-5">Total: {formatNumber(data?.monthlySales.reduce((total : number, sales : number) => total + sales,0) ?? 0)}</h1>
        </Card>
    )
}

export default MonthlySales