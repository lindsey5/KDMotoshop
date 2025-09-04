import { CircularProgress } from "@mui/material"
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradeIcon from '@mui/icons-material/Grade';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { formatDate } from "../utils/dateUtils";
import { useState, type JSX } from "react";
import useDarkmode from "../hooks/useDarkmode";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { notificationsNextPage, updateAllNotifications } from "../redux/notification-reducer";

const statusMap: Record<string, { icon: JSX.Element; color: string; bgColor: string }> = {
  'Pending': { 
    icon: <PendingActionsOutlinedIcon />, 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-500/10' 
  },
  'Confirmed': { 
    icon: <CheckCircleIcon />, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/10' 
  },
  'Shipped': { 
    icon: <LocalShippingIcon />, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/10' 
  },
  'Delivered': { 
    icon: <AssignmentTurnedInIcon />, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/10' 
  },
  'Rated': { 
    icon: <GradeIcon />, 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-500/10' 
  },
  'Cancelled': { 
    icon: <WarningIcon />, 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/10' 
  },
  'Failed': { 
    icon: <WarningIcon />, 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/10' 
  },
  'Rejected': { 
    icon: <CancelIcon />, 
    color: 'text-red-500', 
    bgColor: 'bg-red-500/10' 
  },
  'Refunded': { 
    icon: <WarningIcon />, 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-500/10' 
  },
  'Under Review': { 
    icon: <HourglassBottomIcon />, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/10' 
  },
  'Approved': { 
    icon: <CheckCircleIcon />, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/10' 
  },
  'Processing': { 
    icon: <AssignmentTurnedInIcon />, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/10' 
  },
  'Completed': { 
    icon: <DoneAllIcon />, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-500/10' 
  },
};

const extractStatus = (content: string): string | undefined => {
  return Object.keys(statusMap).find(status => content.includes(status));
};

export const NotificationsDrawerList = ({ close }: { close: () => void }) => {
  const { notifications, total, loading } = useSelector((state: RootState) => state.notification);
  const [page, setPage] = useState(1);
  const isDark = useDarkmode();
  const dispatch = useDispatch<AppDispatch>();

  const handleNextPage = () => {
    const next = page + 1;
    setPage(next);
    dispatch(notificationsNextPage({ page: next, user: "customer" }));
  };

  const navigateToOrder = (order_id: string) => {
    dispatch(updateAllNotifications("customer"));
    window.location.href = `/order/${order_id}`;
  };

  return (
    <div
      className={`w-full max-w-sm h-screen flex flex-col ${
        isDark 
          ? "bg-zinc-950 text-zinc-50 border-l border-zinc-800" 
          : "bg-white text-zinc-900 border-l border-zinc-200"
      }`}
    >
      {/* Ultra-Modern Header */}
      <div className={`relative px-6 py-6 border-b ${
        isDark ? "border-zinc-800/50" : "border-zinc-100"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isDark ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-100"
            }`}>
              <NotificationsOutlinedIcon className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Notifications</h1>
          </div>
          <button
            onClick={close}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDark 
                ? "hover:bg-zinc-800 active:bg-zinc-700" 
                : "hover:bg-zinc-100 active:bg-zinc-200"
            }`}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ultra-Modern Empty State */}
      {notifications.length < 1 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${
            isDark ? "bg-gradient-to-br from-zinc-800 to-zinc-900" : "bg-gradient-to-br from-zinc-50 to-zinc-100"
          }`}>
            <NotificationsOutlinedIcon className={`w-10 h-10 ${
              isDark ? "text-zinc-600" : "text-zinc-400"
            }`} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold">All caught up!</h3>
            <p className="text-xs sm:text-sm md:text-base text-zinc-500 max-w-xs leading-relaxed">
              We'll notify you when there are updates on your orders and deliveries.
            </p>
          </div>
        </div>
      )}

      {/* Ultra-Modern Notification List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {notifications.map((n) => {
            const status = extractStatus(n.content);
            const statusConfig = status ? statusMap[status] : {
              icon: <NotificationsOutlinedIcon />,
              color: 'text-zinc-500',
              bgColor: 'bg-zinc-500/10'
            };

            return (
              <button
                key={n._id}
                onClick={() => navigateToOrder(n.order_id)}
                className={`cursor-pointer group relative w-full flex items-start gap-4 p-5 rounded-2xl transition-all ${
                  !n.isViewed
                    ? isDark
                      ? "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                      : "bg-zinc-50 hover:bg-zinc-100 border border-zinc-200"
                    : isDark
                      ? "bg-zinc-950 hover:bg-zinc-900 border border-zinc-900"
                      : "bg-white hover:bg-zinc-50 border border-zinc-100"
                }`}
              >
                {/* Status Indicator */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig.bgColor}`}>
                  <div className={`w-5 h-5 ${statusConfig.color}`}>
                    {statusConfig.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-xs sm:text-sm md:text-base leading-relaxed mb-2 ${
                    !n.isViewed 
                      ? "font-semibold text-zinc-900 dark:text-zinc-100" 
                      : "font-medium text-zinc-600 dark:text-zinc-400"
                  }`}>
                    {n.content}
                  </p>
                  
                  <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                      {formatDate(n.createdAt)}
                    </span>
                    {status && (
                      <div className="flex gap-1 items-center mt-2">
                        <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
                        <span className={`text-xs sm:text-sm font-medium ${statusConfig.color}`}>
                          {status}
                        </span>
                      </div>
                    )}
                </div>

                {/* Unread Badge */}
                {!n.isViewed && (
                  <div className="flex-shrink-0 w-2.5 h-2.5 bg-red-500 rounded-full mt-2"></div>
                )}

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100 ${
                  isDark ? "bg-gradient-to-r from-red-500/5 to-transparent" : "bg-gradient-to-r from-red-500/5 to-transparent"
                }`}></div>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className={`p-4 rounded-2xl ${
              isDark ? "bg-zinc-900" : "bg-zinc-100"
            }`}>
              <CircularProgress 
                size={24} 
                thickness={4}
                style={{ color: isDark ? "#ef4444" : "#dc2626" }} 
              />
            </div>
          </div>
        )}

        {/* Load More Button */}
        {!loading && total !== notifications.length && (
          <div className="pt-6">
            <button
              onClick={handleNextPage}
              className={`cursor-pointer w-full py-4 px-6 rounded-2xl text-xs sm:text-sm md:text-base font-semibold transition-all ${
                isDark 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};