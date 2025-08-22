import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socketContext";
import Card from "./cards/Card";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Alert {
    _id: string;
    product_name: string;
    product_image: string;
    sku: string;
    currentStock: number;
    prevStock: number;
}

const LowStockNotification = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        socket.on("lowStockNotification", (alert: Alert) => {
        console.log("Low stock notification received:", alert);
        setAlerts((prev) => [...prev, alert]);

        // Auto remove after 8s
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.sku !== alert.sku));
        }, 8000);
        });

        return () => {
        socket.off("lowStockNotification");
        };
    }, [socket]);

    const dismiss = (sku: string) => {
        setAlerts((prev) => prev.filter((a) => a.sku !== sku));
    };

    if (alerts.length === 0) return null;

    return (
        <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        {alerts.map((a) => (
            <Card
            key={a.sku}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-4 w-80 border border-red-200 animate-slide-up"
            >
            <div className="flex justify-between gap-3" onClick={() => navigate(`/admin/product?id=${a._id}`)}>
                <img
                src={a.product_image}
                alt={a.product_name}
                className="w-16 h-16 rounded-lg object-cover border"
                />
                <div className="flex-1">
                <h4 className="font-semibold text-red-600 text-base">
                    Low Stock Alert 🚨
                </h4>
                <p className="mb-3 text-sm text-gray-800">
                    {a.product_name} <span className="text-gray-500">({a.sku})</span>
                </p>
                <p className="text-sm text-gray-600">
                    Stock dropped from{" "}
                    <span className="font-medium">{a.prevStock}</span> →{" "}
                    <span className="font-medium text-red-600">{a.currentStock}</span>
                </p>
                </div>
                <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => dismiss(a.sku)}
                >
                <X size={16} />
                </button>
            </div>
            </Card>
        ))}
        </div>
    );
};

export default LowStockNotification;
