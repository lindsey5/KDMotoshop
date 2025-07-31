
export const refundPayment = async (payment_id : string, amount : number) : Promise<boolean> => {
    try{
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Basic ${process.env.PAYMONGO_SECRET}`
            },
            body: JSON.stringify({data: {attributes: {amount, payment_id, reason: 'requested_by_customer'}}})
        };

        const response = await fetch('https://api.paymongo.com/refunds', options)
        if(response.ok){
            return true
        }
        return false

    }catch(err : any){
        console.log(err.message);
        return false
    }

}