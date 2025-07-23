import { useEffect, useState } from "react";
import Card from "../cards/Card"
import AreaChart from "./AreaChart"
import { fetchData } from "../../services/api";
import useDarkmode from "../../hooks/useDarkmode";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const MonthlySales = () => {
    const [data, setData] = useState<number[]>([]);
    const isDark = useDarkmode();

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
            <div className="flex-1">
                <AreaChart 
                    label="Monthly Sales"
                    data={data}
                    labels={labels}
                    fill={isDark ? true : false}
                />
            </div>
        </Card>
    )
}

export default MonthlySales