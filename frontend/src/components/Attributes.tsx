import { Button } from "@mui/material";
import { useContext } from "react";
import { DarkmodeContext } from "../context/DarkmodeContext";

type AttributesProps = {
    product: Product | undefined;
    selectedAttributes: Record<string, string>;
    handleSelect: (attribute: string, value: string) => void;
}

const Attributes = ({ product, selectedAttributes, handleSelect} : AttributesProps) => {
    const context = useContext(DarkmodeContext);

    return ( 
        <div className="flex flex-col gap-5">
        {product?.attributes.map(attribute => {
            const values = [
                ...new Set(
                product?.variants?.flatMap((variant) =>
                    Object.entries(variant.attributes)
                    .filter(([key]) => key === attribute)
                    .map(([, value]) => value)
                ) ?? []
                ),
            ];

            return (
                <div key={attribute}>
                    <h1 className="mb-2">{attribute}</h1>
                    <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                            <Button
                                sx={{
                                    ...selectedAttributes[attribute] === value ? 
                                    { 'backgroundColor' : 'red' } : 
                                    { 
                                        color: context?.theme === 'dark' ? 'white' : 'black', 
                                        borderColor: context?.theme === 'dark' ? 'white' : 'black'
                                    }
                                }}
                                key={value}
                                variant={
                                selectedAttributes[attribute] === value
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() => handleSelect(attribute, value)}
                            >
                                {value}
                            </Button>
                        ))}
                    </div>
                </div>
            );
        })}
        </div>
    )
}

export default Attributes