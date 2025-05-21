import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@/types";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: ProductType;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link key={product.id} href={`/products/${product.id}`}>
      <div className="bg-white border border-gray-300 rounded-b-lg cursor-pointer shadow-sm transition">
        <div className="relative w-full aspect-video md:aspect-square overflow-hidden">
          <Image
            className="object-cover"
            loading="lazy"
            fill
            src={product.images[0]}
            alt={product.name}
          />
        </div>

        <div className="px-2 py-3">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-5 h-5 rounded-full border"
              style={{ backgroundColor: product.color }}
            />
          </div>

          <h2
            className="w-full text-lg font-bold truncate"
            aria-label={product.name}
          >
            {product.name}
          </h2>

          <p className="text-sm text-muted-foreground">{product.type}</p>

          <span>
            {formatPrice(product.price || 0, {
              currency: "GBP",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
