import { cn } from "../utils/utils";
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradeIcon from '@mui/icons-material/Grade';
import WarningIcon from '@mui/icons-material/Warning';
import React from "react";

type OrderStatusStepperProps = {
    order: Order | undefined
}

const OrderStatusStepper = ({ order } : OrderStatusStepperProps) => {
    if(!order) return null

    const status = order.status;
    const linearSteps = [
        { status: 'Pending', icon: <PendingActionsOutlinedIcon fontSize="large" />},
        { status: 'Accepted', icon: <CheckCircleIcon fontSize="large" />},
        { status: 'Shipped', icon: <LocalShippingIcon fontSize="large" />},
        { status: 'Delivered', icon: <AssignmentTurnedInIcon fontSize="large" />}
    ];

    if(order?.customer?.customer_id) linearSteps.push({
        status: 'Rated', icon: <GradeIcon fontSize="large" />
    });

    const terminalAlt = {
        Cancelled: { color: "bg-red-600", text: "text-red-600" },
        Rejected: { color: "bg-red-600", text: "text-red-600" },
        Refunded: { color: "bg-amber-500", text: "text-amber-500" },
        Failed: { color: 'bg-red-600', text: 'text-red-600'}
    };

    const allStatuses = [...linearSteps.map(step => step.status), ...Object.keys(terminalAlt)];
    const currentStep = allStatuses.indexOf(status);

    const isAltTerminal = status in terminalAlt;

    const altStyles = isAltTerminal
        ? terminalAlt[status as keyof typeof terminalAlt]
        : { color: "", text: "" };

    return (
        <div className="p-10 flex items-center gap-3">
        {linearSteps.map((step, i) => {
            const active = i <= currentStep;
            return (
                <React.Fragment key={i}>
                    {/* circle */}
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className={cn('w-15 h-15 rounded-full flex items-center justify-center', isAltTerminal && active ? altStyles.color + " text-white"
                                : active ? "bg-blue-600 text-white"
                                : "bg-gray-300 text-gray-600")}
                        >
                        {step.icon}
                        </div>
                        <span
                            className={cn(isAltTerminal && active
                                ? altStyles.text + " font-semibold"
                                : active
                                ? "text-blue-600 font-semibold"
                                : "text-gray-500")}
                        >
                        {step.status}
                        </span>
                    </div>

                    {/* connecting line */}
                    {i !== linearSteps.length - 1 && (
                    <div className={cn('flex-1 h-1', active ? (isAltTerminal ? altStyles.color : "bg-blue-600") : "bg-gray-300")}/>
                    )}
                </React.Fragment>
            );
        })}
        {isAltTerminal && (
            <>
                <div className={`flex-1 h-1 ${ altStyles.color}`} /> 
                <div className="flex flex-col items-center gap-3">
                <div className={`w-15 h-15 rounded-full flex items-center justify-center ${altStyles.color} text-white`}>
                    <WarningIcon fontSize="large"/>
                </div>
                <span className={`font-semibold ${altStyles.text}`}>{status}</span>
                </div>
            </>
        )}
        </div>
    );
};

export default OrderStatusStepper;
