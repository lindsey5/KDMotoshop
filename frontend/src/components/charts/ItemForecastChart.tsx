import React, { useMemo, useState } from 'react';
import Card from '../cards/Card';
import useDarkmode from '../../hooks/useDarkmode';
import CustomizedPagination from '../Pagination';
import { url } from '../../constants/url';
import { CircularProgress } from '@mui/material';
import useFetch from '../../hooks/useFetch';
import { BarChart } from '@mui/x-charts';

interface Prediction {
    item: string;
    predicted_qty: number;
}

const ITEMS_PER_PAGE = 10;

const ItemForecastChart = () => {
    const isDark = useDarkmode();
    const [page, setPage] = useState<number>(1);
    const { data, loading } = useFetch(`${url}api/predict/items`)

    const { forecast, month } = useMemo<{forecast: Prediction[], month: string}>(() => {
        if(!data){
            return { forecast: [], month: ''}
        }

        const forecast = data?.forecast
            .map((item : any)=> ({...item, predicted_qty: Math.round(item.predicted_qty) }))
            .sort((a : any, b : any) => b.predicted_qty - a.predicted_qty)
        const month = data.month
        return { forecast, month }
    }, [data])

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return forecast.slice(start, start + ITEMS_PER_PAGE);
    }, [page, forecast]);

     const labels = paginatedData.map((d) => d.item);
    const values = paginatedData.map((d) => d.predicted_qty);

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    return (
        <Card className="mt-10">
            <h2 className='mb-4 font-bold'>Product Demand ({month})</h2>
            {loading ? <div className="w-full h-[300px] flex justify-center items-center">
                <CircularProgress sx={{ color: 'red'}}/> 
            </div> :
            paginatedData.length === 0 ? <div className="w-full h-[300px] flex justify-center items-center">
                <p className="text-gray-500">No data available</p>
            </div> :
            <>
                <BarChart
                    height={300}
                    series={[
                        { data: values, label: 'Forecast', id: 'forecast' },
                    ]}
                    xAxis={[{ data: labels }]}
                    yAxis={[{ width: 50 }]}
                />
                <CustomizedPagination 
                    count={Math.ceil(forecast.length / ITEMS_PER_PAGE)} 
                    onChange={handlePage} 
                />
                </>}
        </Card>
    );
};

export default ItemForecastChart;
