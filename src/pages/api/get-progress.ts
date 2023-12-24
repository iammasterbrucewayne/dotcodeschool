import clientPromise from "@/app/lib/mongodb";

export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = await client.db("test");

  const { user } = req.body;

  const result = await db.collection("users").findOne({ user });

  res.status(200).json({ result });
}
