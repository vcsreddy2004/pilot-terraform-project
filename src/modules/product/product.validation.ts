import { z } from "zod";
const SIZES = ["XS", "S", "M", "L", "XL","XXL","XXXL"] as const;
const numberParser = (field: string, isInt = false) =>
  z.preprocess((val) => {
    if(val === "" || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
  },
  isInt?z.number().int().min(0, `${field} cannot be negative`):z.number().min(0, `${field} cannot be negative`)
);

// Variant Schema
export const variantSchema = z.object({
  size: z.string().transform((val) => val.toUpperCase()).refine((val) => SIZES.includes(val as any), {message: "Invalid size",}),
  stock: numberParser("Stock", true).refine((val) => val >= 0,"Stock cannot be negative"),
  price: numberParser("Price").optional().refine((val) => val === undefined || val >= 0, {message: "Price cannot be negative",}),
});

// Product Schema
export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  basePrice: numberParser("Base price"),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional().transform((val) => val || null),
  variants: z.array(variantSchema).min(1, "At least one variant is required").max(10),
}).refine(
  (data) => {
    const sizes = data.variants.map(v => v.size.toLowerCase());
    return new Set(sizes).size === sizes.length;
  },
  {
    message: "Duplicate variant sizes not allowed",
    path: ["variants"],
  }
);
export const updateStockSchema = z.object({
  slug:z.string().optional(),
  variant: z.string(),
  action: z.enum(["add", "remove", "delete"]),
  quantity: z.number().positive().optional()
});
export type ProductDTO = z.infer<typeof productSchema>;
export type UpdateStockDTO = z.infer<typeof updateStockSchema>;
export type VarientDTO = z.infer<typeof variantSchema>;