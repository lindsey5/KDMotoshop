
const DashboardCard = ({ label, value} : { label: string, value: string}) => {
    return <div className="bg-black p-5 text-white rounded-lg ">
        <p>{label}</p>
        <h1 className="mt-2 font-bold text-3xl">{value}</h1>
    </div>
}

export default DashboardCard