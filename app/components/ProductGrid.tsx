import { products } from "../data/products";
import ProductCard from "./ProductCard";

export function ProductGrid() {
  return (
    <section id="products" className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-3xl md:text-4xl text-deepgreen mb-3">منتجاتنا</h2>
          <div className="section-divider">
            <span className="text-gold text-xl">✦</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
