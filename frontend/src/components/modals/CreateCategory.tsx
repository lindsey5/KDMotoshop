import { Button, Modal } from "@mui/material"
import { LineTextField } from "../Textfield";
import { RedButton } from "../buttons/Button";
import { useState } from "react";
import { postData } from "../../services/api";
import { errorAlert } from "../../utils/swal";
import Card from "../cards/Card";
import useDarkmode from "../../hooks/useDarkmode";

const CreateCategoryModal = ({ open, close } : ModalProps) => {
    const [category, setCategory] = useState<string>('');
    const isDark = useDarkmode();

    const CreateCategpry = async  () => {
        const response = await postData('/api/categories', { category_name: category });
        if(response.success){
            window.location.reload();
        }else{
            errorAlert('Error', response.message);
        }
    }

    return <Modal open={open} onClose={close} sx={{ zIndex: 1 }}>
        <Card className="w-[90%] max-w-[350px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-2xl font-bold mb-4">Create new category</h1>
            <LineTextField 
                label="Category name" 
                fullWidth 
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                sx={{ color: 'white'}}
            />
            <div className="flex justify-end mt-6">
                <div className="flex gap-4">
                    <Button 
                        variant="outlined" 
                        sx={{ border: 1, borderColor: 'gray', color: isDark ? 'white' : ''}}
                        onClick={close}
                    >Close</Button>
                    <RedButton onClick={CreateCategpry}>Create</RedButton>
                </div>
            </div>
        </Card>
    </Modal>
}

export default CreateCategoryModal