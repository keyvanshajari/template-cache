import Link from "next/link"

export default function ProductNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Product not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        That product is not in the catalog.
      </p>
      <Link href="/products" prefetch={true} className="text-sm font-medium">
        ← All products
      </Link>
    </main>
  )
}
