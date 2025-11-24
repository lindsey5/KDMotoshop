import Card from "../../../../components/Card"
import AreaChart from "../../../../components/AreaChart"
import useFetch from "../../../../hooks/useFetch";
import { cn, formatNumberToPeso } from "../../../../utils/utils";
import useDarkmode from "../../../../hooks/useDarkmode";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const MonthlySalesAndExpenses = () => {
    const { data } = useFetch('/api/sales/monthly');
    const { data : monthlyExpensesRes } = useFetch('/api/purchase-orders/monthly-expenses');
    const isDark = useDarkmode()

    return (
        <Card className={cn("flex flex-col flex-3 mt-10 border-t-4 border-t-red-500", isDark && "bg-gradient-to-br from-red-950/40 to-[#2A2A2A] shadow-red-900/20 text-white")}>
            <h1 className="font-bold text-lg">Monthly Sales vs Expenses ({new Date().getFullYear()})</h1>
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
                    {
                        label: 'Monthly Expenses',
                        data: monthlyExpensesRes?.monthlyExpenses ?? [],
                        borderColor: 'green',
                        backgroundColor: 'rgba(0, 128, 0, 0.2)',
                    }
                ]}
            />
            </div>
            <div className="mt-8 border-t py-4 font-medium space-y-3">
                <h1 className="text-right">Total Expenses: {formatNumberToPeso(monthlyExpensesRes?.monthlyExpenses.reduce((total : number, expenses : number) => total + expenses, 0) ?? 0)}</h1>
                <h1 className="text-right">Total Sales: {formatNumberToPeso(data?.monthlySales.reduce((total : number, sales : number) => total + sales, 0) ?? 0)}</h1>
            </div>
        </Card>
    )
}

export default MonthlySalesAndExpenses