import { useParams } from "react-router-dom";
import BreadCrumbs from "../../../components/BreadCrumbs"
import { Title } from "../../../components/text/Text"
import PageContainer from "../ui/PageContainer"

const PurchaseOrder = () => {
    const { id } = useParams();
    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Purchase Orders', href: '/admin/purchase-orders' },
        { label: `${id ? 'Edit' : 'Create'} Purchase Order`, href: `/admin/purchase-order/${id ? id : ''}` },
    ]

    return (
        <PageContainer className="flex flex-col gap-5">
            <Title>{id ? 'Edit' : 'Create'} Purchase Order</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </PageContainer>
    )
}

export default PurchaseOrder