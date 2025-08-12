import { SparkLineChart } from "@mui/x-charts"
import Card from "./Card"

const DashboardCard = ({ label, value} : { label: string, value: string}) => {
    return (
        <Card className="flex items-center justify-between gap-5">
            <div>
                <p>{label}</p>
                <h1 className="mt-2 font-bold text-2xl">{value}</h1>
            </div>
            <SparkLineChart
                plotType="bar"
                data={[1, 4, 6, 3, 4]}
                color="red"
                width={100}
                sx={{ maxWidth: '100px'}}
                height={80}
            />
        </Card>
    )
}

export default DashboardCard