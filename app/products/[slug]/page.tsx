import { cacheLife, cacheTag } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProduct, getProducts } from "@/lib/catalog"
import { formatPrice } from "@/lib/products"

export async function generateStaticParams() {
  const { products } = await getProducts()
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params
  const { product } = await getProduct(slug)

  return {
    title: product?.name ?? "Product",
    description: product?.description,
  }
}

export default function ProductPage(props: PageProps<"/products/[slug]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
      <Suspense fallback={<div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />}>
        <ProductDetails params={props.params} />
      </Suspense>
    </main>
  )
}

async function ProductDetails({
  params,
}: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params
  const { product } = await getProduct(slug)
  if (!product) notFound()
  return <ProductArticle slug={slug} />
}

async function ProductArticle({ slug }: { slug: string }) {
  "use cache"
  cacheLife("catalog")
  cacheTag("products", `product:${slug}`)

  const { product, cachedAt } = await getProduct(slug)
  if (!product) return null

  return (
    <article className="flex flex-col gap-6">
      <Link
        href="/products"
        prefetch={true}
        className="text-sm font-medium text-zinc-500"
      >
        ← All products
      </Link>
      <header className="flex flex-col gap-3">
        <p className="text-sm text-zinc-500">{formatPrice(product.price)}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{product.name}</h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <Link
            key={tag}
            href={`/products?tag=${tag}`}
            prefetch={true}
            className="inline-flex h-9 items-center rounded-full border border-black/10 px-4 text-sm font-medium dark:border-white/15"
          >
            {tag}
          </Link>
        ))}
      </div>
      <p className="text-sm text-zinc-500">
        Cached at {cachedAt} · revalidates every 300s
      </p>
    </article>
  )
}
