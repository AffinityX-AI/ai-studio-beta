export async function POST(request: Request) {
  const params = await request.json()
  console.log(params)
  return new Response(JSON.stringify(params))
}
