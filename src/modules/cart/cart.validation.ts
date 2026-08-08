import {z} from "zod";
const numberParser = (field: string, isInt = false) =>
  z.preprocess((val) => {
    if(val === "" || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
  },
  isInt?z.number().int().min(0, `${field} cannot be negative`):z.number().min(0, `${field} cannot be negative`)
);
export const varientValidationSchema = z.object({
  variantId: numberParser("variantId",true),
  quantity: numberParser("quantity",true)
});