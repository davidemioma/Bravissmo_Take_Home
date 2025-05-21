"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import DeleteBtn from "./DeleteBtn";
import ListInput from "./ListInput";
import { ProductType } from "@/types";
import FilesUpload from "./FilesUpload";
import { ArrowLeft } from "lucide-react";
import { cn, colors } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProductById,
  updateProduct,
} from "@/lib/actions/products";
import {
  ProductSchema,
  ProductTypeEnum,
  ProductValidator,
  ProductCustomType,
} from "@/lib/validators/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  initialProduct?: ProductType;
};

const ProductForm = ({ initialProduct }: Props) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<ProductValidator>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: initialProduct?.name || "",
      images: initialProduct?.images || [],
      type: (initialProduct?.type as ProductCustomType) || "Bras",
      color: initialProduct?.color || "",
      quantity: initialProduct?.quantity || 0,
      price: initialProduct?.price || 0,
      sizes: initialProduct?.sizes || [],
      bandSizes: initialProduct?.bandSizes || [],
      cupSizes: initialProduct?.cupSizes || [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: initialProduct
      ? ["update-product", initialProduct.id]
      : ["create-product"],
    mutationFn: async (values: ProductValidator) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "images") {
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Handle images:
      const existingImages: string[] = []; // Already uploaded URLs

      const newFiles: File[] = []; // Files to upload

      values.images?.forEach((file) => {
        if (typeof file === "string") {
          existingImages.push(file);
        } else if (file instanceof File) {
          newFiles.push(file);
        }
      });

      formData.append("existingImages", JSON.stringify(existingImages));

      newFiles.forEach((file) => {
        formData.append("newFiles", file);
      });

      // Create or Update Product
      if (initialProduct) {
        return await updateProduct({
          id: initialProduct.id,
          values: formData,
        });
      }

      return await createProduct(formData);
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(
          `Unable to ${initialProduct ? "update" : "create"} product!`
        );

        return;
      }

      toast.success(res.message);

      if (initialProduct) {
        queryClient.invalidateQueries({
          queryKey: ["get-product", initialProduct.id],
        });
      }

      if (!initialProduct) {
        form.reset();

        router.push("/");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-product"],
    mutationFn: async (id: string) => {
      const res = await deleteProductById(id);

      return res;
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(`Unable to delete product!`);

        return;
      }

      toast.success(res.message);

      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (values: ProductValidator) => {
    mutate(values);
  };

  return (
    <div>
      {initialProduct && (
        <div className="mb-5">
          <Link
            href={`/products/${initialProduct.id}`}
            className={cn(
              buttonVariants({
                variant: "secondary",
                className: "border",
              })
            )}
          >
            <ArrowLeft />
            Back
          </Link>
        </div>
      )}

      <h2
        className="text-xl sm:text-2xl md:text-3xl mb-1 font-bold tracking-tight"
        aria-label={"Add/Update Product"}
      >
        {initialProduct ? "Update Product" : "Add Product"}
      </h2>

      <p className="text-sm text-black font-light">
        {initialProduct
          ? "Modify the details of your existing product. All changes will be saved automatically."
          : "Create a new product listing. Fill in all required fields to add your product to the catalog."}
      </p>

      <Separator className="my-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <div className="grid md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Bra..."
                      {...field}
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending || isDeleting}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        disabled={isPending || isDeleting}
                      >
                        <SelectValue placeholder="Select a product type..." />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.values(ProductTypeEnum.enum).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          disabled={isPending || isDeleting}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>

                <FormControl>
                  <FilesUpload
                    values={field.value}
                    setValues={field.onChange}
                    disabled={isPending || isDeleting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending || isDeleting}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="w-full"
                        disabled={isPending || isDeleting}
                      >
                        <SelectValue placeholder="Select color..." />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                          key={color.label}
                          value={color.value}
                          disabled={isPending || isDeleting}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full border"
                              style={{
                                backgroundColor: color.value,
                              }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (£)</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 items-start gap-5">
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>

                  <FormControl>
                    <ListInput
                      values={field.value}
                      setValues={field.onChange}
                      placeholder="Add size..."
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bandSizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Band Sizes</FormLabel>
                  <FormControl>
                    <ListInput
                      values={field.value.map(String)}
                      setValues={(values) => field.onChange(values.map(Number))}
                      placeholder="Add band size..."
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cupSizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cup Sizes</FormLabel>
                  <FormControl>
                    <ListInput
                      values={field.value.map(String)}
                      setValues={(values) => field.onChange(values.map(Number))}
                      placeholder="Add cup size..."
                      disabled={isPending || isDeleting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 flex gap-4 justify-end">
            <Button type="submit" size="lg" disabled={isPending || isDeleting}>
              {initialProduct
                ? `${isPending ? "Saving..." : "Save"}`
                : `${isPending ? "Creating..." : "Create"}`}
            </Button>

            {initialProduct && (
              <DeleteBtn
                disabled={isPending || isDeleting}
                onContinue={() => {
                  if (!initialProduct) return;

                  deleteProduct(initialProduct.id);
                }}
              />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
