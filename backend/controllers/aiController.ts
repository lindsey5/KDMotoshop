import { Request, Response } from "express";

export const get_predicted_sales = async (req : Request, res : Response) => {
    try{
        const today = new Date();
        const month = req.query.month || today.getMonth() + 1;
        const year = req.query.year || today.getFullYear(); 

        const response = await fetch(`${process.env.VITE_AI_URL}/api/predict?month=${month}&year=${year}`)
        if(!response.ok){
            res.status(400).json({ success: false, message: 'Failed to fetch predicted sales'});
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false,  message: err.message || 'Server error.'})
    }
}

export const get_predicted_items = async (req : Request, res : Response) => {
    try{
        const today = new Date();
        const month = req.query.month || today.getMonth() + 1;
        const year = req.query.year || today.getFullYear(); 

        const response = await fetch(`${process.env.VITE_AI_URL}/api/predict/items?month=${month}&year=${year}`)
        if(!response.ok){
            res.status(400).json({ success: false, message: 'Failed to fetch predicted items'});
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false,  message: err.message || 'Server error.'})
    }
}
