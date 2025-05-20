import { z } from "zod";

export const ProductTypeEnum = z.enum([
  "Bras",
  "Swimwear",
  "Sports Bras",
  "Sports Wear",
  "Nightwear",
  "Vest Tops",
  "lingerie",
]);

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  type: ProductTypeEnum,
  color: z.string().min(1, "Color is required"),
  price: z.coerce.number().min(0, "Price must be greater than 0"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  sizes: z.array(z.string()),
  bandSizes: z.array(z.coerce.number().min(0)),
  cupSizes: z.array(z.coerce.number().min(0)),
  images: z
    .array(
      z.union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? "" : value)),
      ])
    )
    .min(1, "At least one image is required."),
});

export type ProductValidator = z.infer<typeof ProductSchema>;
