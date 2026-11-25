import { cacheLife, cacheTag } from "next/cache"
import Link from "next/link"
import { Suspense } from "react"
import { getProducts, getTags } from "@/lib/catalog"
import { formatPrice, normalizeTags } from "@/lib/products"

export const metadata = {
  title: "Products",
  description: "Filter products by tag",
}

export default function ProductsPage(props: PageProps<"/products">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Choose one or more tags. A product is shown when it has every selected
          tag.
        </p>
      </header>
      <Suspense fallback={<CatalogFallback />}>
        <FilteredCatalog searchParams={props.searchParams} />
      </Suspense>
    </main>
  )
}

async function FilteredCatalog({
  searchParams,
}: Pick<PageProps<"/products">, "searchParams">) {
  const { tag } = await searchParams
  return <ProductCatalog tags={normalizeTags(tag)} />
}

async function ProductCatalog({ tags }: { tags: string[] }) {
  "use cache"
  cacheLife("catalog")
  cacheTag("products")

  const [{ products, cachedAt }, { tags: allTags }] = await Promise.all([
    getProducts(tags),
    getTags(),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Link
            href={catalogHref([])}
            prefetch={true}
            className={chipClass(tags.length === 0)}
          >
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={catalogHref(toggleTag(tags, tag))}
              prefetch={true}
              className={chipClass(tags.includes(tag))}
            >
              {tag}
            </Link>
          ))}
        </div>
        <p className="text-sm text-zinc-500">
          {products.length} {products.length === 1 ? "product" : "products"} ·
          cached at {cachedAt} · revalidates every 300s
        </p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/15 px-5 py-10 text-center text-zinc-500 dark:border-white/15">
          No products match these tags.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                prefetch={true}
                className="flex h-full flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-black/30 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-white/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm font-medium">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {product.description}
                </p>
                <p className="mt-auto text-xs uppercase tracking-wide text-zinc-500">
                  {product.tags.join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CatalogFallback() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-9 w-72 rounded-full bg-zinc-200 dark:bg-zinc-900" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-36 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="h-36 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
      </div>
    </div>
  )
}

function catalogHref(tags: string[]) {
  if (tags.length === 0) return "/products"
  const params = new URLSearchParams()
  for (const tag of tags) params.append("tag", tag)
  return `/products?${params.toString()}`
}

function toggleTag(active: string[], tag: string) {
  return active.includes(tag)
    ? active.filter((item) => item !== tag)
    : [...active, tag].sort()
}

function chipClass(active: boolean) {
  return active
    ? "inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background"
    : "inline-flex h-9 items-center rounded-full border border-black/10 px-4 text-sm font-medium dark:border-white/15"
}
