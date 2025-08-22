import Card from "../../../../components/Card"
import AreaChart from "../../../../components/AreaChart"
import useFetch from "../../../../hooks/useFetch";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const MonthlySales = () => {
    const { data } = useFetch('/api/sales/monthly')

    return (
        <Card className="h-[400px] flex flex-col flex-3 mt-10">
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
        </Card>
    )
}

export default MonthlySales