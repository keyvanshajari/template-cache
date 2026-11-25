import { getProducts } from "@/lib/catalog"
import { normalizeTags } from "@/lib/products"

export async function GET(request: Request) {
  const tags = normalizeTags(new URL(request.url).searchParams.getAll("tag"))
  const catalog = await getProducts(tags)

  return Response.json(catalog)
}
