import Card from "../../../../components/Card";
import { useMemo } from "react";
import AreaChart from "../../../../components/AreaChart";
import { CircularProgress } from "@mui/material";
import useFetch from "../../../../hooks/useFetch";
import { cn } from "../../../../utils/utils";
import useDarkmode from "../../../../hooks/useDarkmode";

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const channels: Record<string, { border: string; bg: string }> = {
  Store: {
    border: "rgb(255, 99, 132)",
    bg: "rgba(255, 99, 132, 0.2)"
  },
  Website: {
    border: "rgb(54, 162, 235)",
    bg: "rgba(54, 162, 235, 0.2)"
  },
  Facebook: {
    border: "rgb(75, 192, 192)",
    bg: "rgba(75, 192, 192, 0.2)"
  },
  Shopee: {
    border: "rgb(255, 159, 64)",
    bg: "rgba(255, 159, 64, 0.2)"
  },
  Lazada: {
    border: "rgb(153, 102, 255)",
    bg: "rgba(153, 102, 255, 0.2)"
  },
  Tiktok: {
    border: "rgb(255, 206, 86)",
    bg: "rgba(255, 206, 86, 0.2)"
  }
};

const ChannelSalesChart = () => {
    const { data: salesRes, loading } = useFetch(`/api/sales/channels`);
    const isDark = useDarkmode();

    const sales = useMemo(() => {
    if (!salesRes?.channels) return [];

    return salesRes.channels.map((channel: any) => {
        const color = channels[channel.channel] || { border: "gray", bg: "rgba(128,128,128,0.2)" };
        return {
        label: channel.channel,
        data: channel.sales ?? 0,
        borderColor: color.border,
        backgroundColor: color.bg
        };
    });
    }, [salesRes]);

    return (
        <Card className={cn("h-[500px] xl:flex-3 flex flex-col gap-3 border-t-4 border-t-red-500", isDark && "bg-gradient-to-br from-red-950/40 to-[#2A2A2A] shadow-red-900/20 text-white")}>
            <h1 className="font-bold text-xl">Sales per Channel</h1>

            {loading ? (
                <div className="w-full h-[300px] flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red' }} />
                </div>
            ) : (
                <>
                    <div className="flex-1">
                        <AreaChart
                            labels={labels}
                            datasets={sales}
                        />
                    </div>
                </>
            )}
        </Card>
    );
};

export default ChannelSalesChart;
