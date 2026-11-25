import { cacheLife, cacheTag } from "next/cache"
import Link from "next/link"
import { getProducts } from "@/lib/catalog"
import { formatPrice } from "@/lib/products"

export default async function Home() {
  "use cache"
  cacheLife("catalog")
  cacheTag("products")

  const { products, cachedAt } = await getProducts()

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
      <section className="flex flex-col gap-4">
        <p className="text-sm font-medium text-zinc-500">Cache Components</p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
          A product catalog that revalidates every 300 seconds.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          The list, tag filters, product page, and GET handlers share the{" "}
          <code className="font-mono text-[0.9em]">catalog</code> cache profile.
          Cached at {cachedAt}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            prefetch={true}
            className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Browse products
          </Link>
          <Link
            href="/ppr"
            prefetch={true}
            className="inline-flex h-11 items-center rounded-full border border-black/10 px-5 text-sm font-medium dark:border-white/15"
          >
            Partial Prerendering
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            prefetch={true}
            className="rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-black/30 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-white/30"
          >
            <p className="text-sm text-zinc-500">{formatPrice(product.price)}</p>
            <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  )
}
