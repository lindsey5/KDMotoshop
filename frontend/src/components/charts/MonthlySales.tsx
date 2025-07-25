import { useEffect, useState } from "react";
import Card from "../cards/Card"
import AreaChart from "./AreaChart"
import { fetchData } from "../../services/api";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const MonthlySales = () => {
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        const getMonthlySales = async () => {
            const response = await fetchData('/api/sales/monthly');
            if(response.success){
                setData(response.monthlySales)
            }
        }

        getMonthlySales();
    }, [])

    return (
        <Card className="h-[400px] flex flex-col flex-3 mt-10">
            <div className="flex-1"><AreaChart
                title=""
                labels={labels}
                datasets={[
                    {
                        label: 'Monthly Sales',
                        data,
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