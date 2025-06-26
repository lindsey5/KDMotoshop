import { SparkLineChart } from "@mui/x-charts"

const DashboardCard = ({ label, value} : { label: string, value: string}) => {
    return <div className="flex items-center gap-5 p-5 bg-white rounded-lg border-1 border-gray-300 shadow-md">
        <div>
            <p>{label}</p>
            <h1 className="mt-2 font-bold text-3xl">{value}</h1>
        </div>
        <SparkLineChart
          plotType="bar"
          data={[1, 4, 2, 5, 4, 7, 2]}
          color="red"
          height={100}
        />
    </div>
}

export default DashboardCard