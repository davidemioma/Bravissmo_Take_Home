"use client";

import React from "react";
import { toast } from "sonner";
import ListInput from "./ListInput";
import { colors } from "@/lib/utils";
import FilesUpload from "./FilesUpload";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductSchema,
  ProductTypeEnum,
  ProductValidator,
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
  initialProduct?: {
    id: string;
  };
};

const ProductForm = ({ initialProduct }: Props) => {
  const form = useForm<ProductValidator>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      images: [],
      type: "Bras",
      color: "",
      quantity: 0,
      price: 0,
      sizes: [],
      bandSizes: [],
      cupSizes: [],
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
          const files = value as string[] | File[];

          files.forEach((file: string | File) => {
            if (file !== "" || file !== null || file !== undefined) {
              formData.append("images", file);
            }
          });
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Create Product
    },
    onSuccess: () => {
      toast.success("New product created");

      form.reset();
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
                      disabled={isPending}
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
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={isPending}>
                        <SelectValue placeholder="Select a product type..." />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.values(ProductTypeEnum.enum).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={isPending}>
                        <SelectValue placeholder="Select color..." />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                          key={color.label}
                          value={color.value}
                          disabled={isPending}
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
                    <Input type="number" {...field} disabled={isPending} />
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
                    <Input type="number" {...field} disabled={isPending} />
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" disabled={isPending}>
              {initialProduct
                ? `${isPending ? "Saving..." : "Save"}`
                : `${isPending ? "Creating..." : "Create"}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
