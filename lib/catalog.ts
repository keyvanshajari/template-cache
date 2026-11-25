import { cacheLife, cacheTag } from "next/cache"
import { normalizeTags, products, type Product } from "@/lib/products"

export type ProductList = {
  tags: string[]
  cachedAt: string
  revalidate: number
  products: Product[]
}

export type ProductResult = {
  cachedAt: string
  revalidate: number
  product: Product | null
}

export type TagList = {
  tags: string[]
  cachedAt: string
  revalidate: number
}

const REVALIDATE_SECONDS = 300

export async function getProducts(tags: string[] = []): Promise<ProductList> {
  "use cache"
  cacheLife("catalog")
  cacheTag("products")

  const selected = normalizeTags(tags)
  const list = products.filter((product) =>
    selected.every((tag) => product.tags.includes(tag)),
  )

  return {
    tags: selected,
    cachedAt: new Date().toISOString(),
    revalidate: REVALIDATE_SECONDS,
    products: list,
  }
}

export async function getProduct(slug: string): Promise<ProductResult> {
  "use cache"
  cacheLife("catalog")
  cacheTag("products", `product:${slug}`)

  return {
    cachedAt: new Date().toISOString(),
    revalidate: REVALIDATE_SECONDS,
    product: products.find((product) => product.slug === slug) ?? null,
  }
}

export async function getTags(): Promise<TagList> {
  "use cache"
  cacheLife("catalog")
  cacheTag("products", "tags")

  const tags = new Set<string>()
  for (const product of products) {
    for (const tag of product.tags) tags.add(tag)
  }

  return {
    tags: [...tags].sort(),
    cachedAt: new Date().toISOString(),
    revalidate: REVALIDATE_SECONDS,
  }
}
