//import { useEffect, useState } from "react";
import Card from "../../../components/cards/Card";
import { Title } from "../../../components/text/Text"
import useDarkmode from "../../../hooks/useDarkmode"
import { cn } from "../../../utils/utils";
//import { useParams } from "react-router-dom";
//import { fetchData } from "../../../services/api";


const RequestRefundPage = () => {
    const isDark = useDarkmode();
    //const { id } = useParams();
    //const [items, setItems] = useState([]);
    //const [selectedItem, setSelectedItem] = useState([]);

    /* useEffect(() => {
        const getItemsToRefund = async () => {
            const response = await fetchData(`/api/refund/${id}/items-to-refund`);
            if(response.success){
                setItems(response.itemsCanBeRefunded)
            }
        }

        getItemsToRefund();
    }, [])*/

    return (
        <div className={cn("pt-30 px-5 md:px-10 pb-10 transition-colors duration-600 flex bg-gray-100 min-h-screen", isDark && 'bg-[#121212] text-white')}>
           <Card className="flex-2">
            <Title className="text-2xl md:text-3xl">Select items to refund</Title>
            {/* <div className="flex flex-col gap-5">
                {items.map(item => (
                <div className="">

                </div>
                ))}
            </div>*/}
           </Card>
        </div>
    )
}

export default RequestRefundPage