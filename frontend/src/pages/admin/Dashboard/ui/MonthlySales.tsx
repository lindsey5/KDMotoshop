import Card from "../../../../components/Card"
import AreaChart from "../../../../components/AreaChart"
import useFetch from "../../../../hooks/useFetch";
import { formatNumber } from "../../../../utils/utils";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const MonthlySales = () => {
    const { data } = useFetch('/api/sales/monthly')

    return (
        <Card className="flex flex-col flex-3 mt-10">
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