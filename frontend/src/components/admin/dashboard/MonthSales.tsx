import { useEffect, useState } from "react";
import Card from "../../Card"
import AreaChart from "../../charts/AreaChart"
import { fetchData } from "../../../services/api";

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
        <Card className="h-[400px] bg-white flex-3 px-5 pb-5 pt-0">
            <AreaChart 
                label="Monthly Sales"
                data={data}
                labels={labels}
            />
        </Card>
    )
}

export default MonthlySales