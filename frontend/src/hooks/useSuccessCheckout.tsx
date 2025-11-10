import { useContext, useEffect } from "react"
import { SocketContext } from "../context/socketContext"

const useSuccessCheckout = () => {
    
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if(!socket) return;

        socket.on('successCheckout', () => window.close());

        return () => {
            socket.off('successCheckout')
        }
    }, [socket])

}

export default useSuccessCheckout