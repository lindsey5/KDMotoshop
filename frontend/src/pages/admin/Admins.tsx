
import PageContainer from "../../components/containers/admin/PageContainer";
import BreadCrumbs from "../../components/BreadCrumbs";
import { Title } from "../../components/text/Text";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Admins', href: '/admin/admins' },
]

const Admins = () => {

    return (
        <PageContainer className="">
            <Title className="mb-4">Admins</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </PageContainer>
    )
}

export default Admins;