import { getProduct } from "@/lib/catalog"

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/products/[slug]">,
) {
  const { slug } = await ctx.params
  const result = await getProduct(slug)

  if (!result.product) {
    return Response.json({ error: "Product not found" }, { status: 404 })
  }

  return Response.json(result)
}
