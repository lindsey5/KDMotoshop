import { Button, Modal } from "@mui/material"
import { LineTextField } from "../../Textfield";
import { RedButton } from "../../Button";
import { useState } from "react";
import { postData } from "../../../services/api";
import { errorAlert } from "../../../utils/swal";

const CreateCategoryModal : React.FC<ModalProps> = ({ open, close }) => {
    const [category, setCategory] = useState<string>('');

    const CreateCategpry = async  () => {
        const response = await postData('/api/category', { category_name: category });
        if(response.success){
            window.location.reload();
        }else{
            errorAlert('Error', response.message);
        }
    }

    return <Modal open={open} onClose={close} sx={{ zIndex: 1 }}>
        <div className="z-50 w-[90%] max-w-[350px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Create new category</h1>
            <LineTextField 
                label="Category name" 
                fullWidth 
                onChange={(e) => setCategory(e.target.value)}
                value={category}
            />
            <div className="flex justify-end mt-6">
                <div className="flex gap-4">
                    <Button 
                        sx={{ color: 'black', borderColor: 'black' }}
                        variant="outlined"
                        onClick={close}
                    >Close</Button>
                    <RedButton onClick={CreateCategpry}>Create</RedButton>
                </div>
            </div>
        </div>
    </Modal>
}

export default CreateCategoryModal