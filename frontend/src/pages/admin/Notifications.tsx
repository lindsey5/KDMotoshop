import { useContext } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import Card from "../../components/Card";
import CustomizedTable from "../../components/Table";
import { NotificationsTableColumns, NotificationTableRow } from "../../components/tables/NotificationTable";
import { Title } from "../../components/Text";
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils";
import { AdminNotificationContext } from "../../context/AdminNotificationContext";
import CustomizedPagination from "../../components/Pagination";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Notifications', href: '/admin/notifications' },
]

const AdminNotifications = () => {
    const isDark = useDarkmode();
    const { notifications, setPage, total } = useContext(AdminNotificationContext);

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
         <div className={cn("transition-colors duration-600 flex flex-col bg-gray-100 h-full p-5", isDark && 'text-white bg-[#121212]')}>
            <Title className="mb-4">Notifications</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="flex-grow min-h-0 flex flex-col mt-10 gap-5">
                <div className="flex justify-end">
                    <CustomizedPagination count={Math.ceil(total / 30)} onChange={handlePage} />
                </div>
                <CustomizedTable
                    cols={<NotificationsTableColumns />}
                    rows={notifications.map(n => <NotificationTableRow key={n._id} notification={n}/>)}
                />
            </Card>
        </div>
    )
}

export default AdminNotifications