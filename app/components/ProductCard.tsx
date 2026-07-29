import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice, discountPercent } from "../data/products";

export function ProductCard({ product }: { product: Product }) {
  const disc = discountPercent(product);
  return (
    <div className="group bg-ivory rounded-arch overflow-hidden border border-gold/10 shadow-soft hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="absolute top-3 right-3 bg-deepgreen/90 text-gold text-xs font-tajawal font-bold px-3 py-1 rounded-full">
          صناعة يدوية
        </span>
        <span className="absolute top-3 left-3 bg-terracotta text-white text-xs font-tajawal font-bold px-3 py-1 rounded-full">
          -{disc}%
        </span>
      </div>

      <div className="p-5 text-center">
        <h3 className="font-amiri text-xl text-deepgreen mb-1 leading-tight">
          {product.name}
        </h3>
        <p className="font-tajawal text-sm text-gold mb-3">{product.hook}</p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="font-amiri text-2xl font-bold text-deepgreen">
            {formatPrice(product.price)}
          </span>
          <span className="font-tajawal text-sm text-muted line-through">
            {formatPrice(product.oldPrice)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`/p/${product.slug}?cta=order`}
            className="w-full bg-gold text-deepgreen font-tajawal font-bold py-3 rounded-xl hover:bg-gold/90 transition-colors"
          >
            اطلب الآن — الدفع عند الاستلام
          </a>
          <Link
            href={`/p/${product.slug}`}
            className="w-full border border-gold/40 text-deepgreen font-tajawal font-medium py-2.5 rounded-xl hover:bg-gold/10 transition-colors"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
