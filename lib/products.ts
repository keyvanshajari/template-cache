export type Product = {
  slug: string
  name: string
  price: number
  description: string
  tags: string[]
}

export const products: Product[] = [
  {
    slug: "trail-runner",
    name: "Trail Runner",
    price: 128,
    description: "Cushioned trail shoe with a grippy outsole for mixed dirt and pavement.",
    tags: ["outdoor", "shoes", "sale"],
  },
  {
    slug: "merino-beanie",
    name: "Merino Beanie",
    price: 36,
    description: "Lightweight merino cap that stays warm without feeling bulky.",
    tags: ["apparel", "outdoor", "new"],
  },
  {
    slug: "ceramic-pour-over",
    name: "Ceramic Pour-Over",
    price: 42,
    description: "Single-serve dripper with a smooth ceramic body and a steady flow.",
    tags: ["home", "new"],
  },
  {
    slug: "canvas-tote",
    name: "Canvas Tote",
    price: 28,
    description: "Heavy canvas tote with an interior pocket for daily carry.",
    tags: ["apparel", "sale"],
  },
  {
    slug: "desk-lamp",
    name: "Desk Lamp",
    price: 89,
    description: "Adjustable aluminum lamp with a warm, even pool of light.",
    tags: ["home"],
  },
  {
    slug: "insulated-bottle",
    name: "Insulated Bottle",
    price: 34,
    description: "Vacuum bottle that keeps drinks cold on long days outside.",
    tags: ["outdoor", "home", "sale"],
  },
]

export function normalizeTags(
  tag: string | string[] | undefined | null,
): string[] {
  const values = tag == null ? [] : Array.isArray(tag) ? tag : [tag]

  return [
    ...new Set(
      values
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.length > 0),
    ),
  ].sort()
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}
