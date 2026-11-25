import { cacheLife, cacheTag } from "next/cache"
import { cookies } from "next/headers"
import { connection } from "next/server"
import Link from "next/link"
import { Suspense } from "react"
import { getProducts } from "@/lib/catalog"
import { formatPrice } from "@/lib/products"

export const metadata = {
  title: "Partial Prerendering",
  description: "Static shell, cached catalog content, and a per-request stream",
}

export default function PartialPrerenderPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-500">Partial Prerendering</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
          The shell arrives first. This request fills in the rest.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Static markup and the cached catalog are prerendered into the shell.
          The last panel waits for the request, so its fallback ships first and
          the fresh value streams in afterward.
        </p>
      </header>

      <div className="grid gap-4">
        <StaticShell />
        <CachedShell />
        <Suspense fallback={<StreamFallback />}>
          <RequestStream />
        </Suspense>
      </div>
    </main>
  )
}

function StaticShell() {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
      <Region label="Static shell" />
      <h2 className="mt-3 text-lg font-semibold">Prerendered with the page</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        This section only renders markup. It does not read cookies, the clock,
        or the catalog, so it is part of the shell on every visit.{" "}
        <Link href="/products" prefetch={true} className="font-medium text-zinc-950 dark:text-zinc-50">
          Browse the product list
        </Link>
        .
      </p>
    </section>
  )
}

async function CachedShell() {
  "use cache"
  cacheLife("catalog")
  cacheTag("products")

  const { products, cachedAt } = await getProducts()

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
      <Region label="Cached · in the shell" />
      <h2 className="mt-3 text-lg font-semibold">Catalog, shared for 300 seconds</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        <code className="font-mono text-[0.9em]">use cache</code> with the{" "}
        <code className="font-mono text-[0.9em]">catalog</code> profile keeps
        this in the shell. Cached at {cachedAt}.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <li
            key={product.slug}
            className="rounded-xl border border-black/10 px-4 py-3 dark:border-white/10"
          >
            <p className="text-sm text-zinc-500">{formatPrice(product.price)}</p>
            <p className="mt-1 font-medium">{product.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function StreamFallback() {
  return (
    <section className="rounded-2xl border border-dashed border-black/20 bg-zinc-100 p-5 dark:border-white/20 dark:bg-zinc-900">
      <Region label="Dynamic · streaming" />
      <h2 className="mt-3 text-lg font-semibold">Waiting for this request</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        This fallback is in the shell. The request id replaces it when the
        server finishes this request.
      </p>
    </section>
  )
}

async function RequestStream() {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const theme = (await cookies()).get("theme")?.value ?? "not set"
  const renderedAt = new Date().toISOString()
  const requestId = crypto.randomUUID()

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
      <Region label="Dynamic · this request" />
      <h2 className="mt-3 text-lg font-semibold">Filled in after the shell</h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Rendered at</dt>
          <dd className="mt-1 font-mono text-[0.85em]">{renderedAt}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Request id</dt>
          <dd className="mt-1 font-mono text-[0.85em]">{requestId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Theme cookie</dt>
          <dd className="mt-1 font-mono text-[0.85em]">{theme}</dd>
        </div>
      </dl>
    </section>
  )
}

function Region({ label }: { label: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
      {label}
    </p>
  )
}
