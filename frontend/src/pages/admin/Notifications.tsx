import { useContext } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import Card from "../../components/cards/Card";
import CustomizedTable from "../../components/Table";
import { NotificationsTableColumns, NotificationTableRow } from "../../components/tables/NotificationTable";
import { Title } from "../../components/text/Text";
import { AdminNotificationContext } from "../../context/AdminNotificationContext";
import CustomizedPagination from "../../components/Pagination";
import PageContainer from "../../components/containers/admin/PageContainer";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Notifications', href: '/admin/notifications' },
]

const AdminNotifications = () => {
    const { notifications, setPage, total } = useContext(AdminNotificationContext);

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <PageContainer className="h-full flex flex-col">
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
        </PageContainer>
    )
}

export default AdminNotifications