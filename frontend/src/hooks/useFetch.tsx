import { useEffect, useState } from "react"
import { fetchData } from "../services/api"

const useFetch = (endpoint : string, allowCredentials : boolean = true) => {
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const response = await fetchData(endpoint, allowCredentials);
            if(response.success) setData(response);
            setLoading(false)
        }

        getData()
    }, [endpoint])

    return { data, loading }
}

export default useFetch;