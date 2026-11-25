import { getTags } from "@/lib/catalog"

export async function GET() {
  const tags = await getTags()

  return Response.json(tags)
}
