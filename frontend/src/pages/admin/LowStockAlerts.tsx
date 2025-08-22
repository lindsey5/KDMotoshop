import BreadCrumbs from "../../components/BreadCrumbs";
import PageContainer from "../../components/containers/admin/PageContainer";
import { Title } from "../../components/text/Text";
import useFetch from "../../hooks/useFetch";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Low Stock Alert', href: '/admin/low-stock-alerts' },
]

const LowStockAlerts = () => {
    const { data } = useFetch('/api/alerts');

    console.log(data)

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Title className="mb-4">Low Stock Alert</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </PageContainer>
    );
}

export default LowStockAlerts;