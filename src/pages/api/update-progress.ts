import clientPromise from "@/app/lib/mongodb";

export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = await client.db("test");

  const updates = req.body.updates;

  const operations = updates.map((update: any) => {
    const { user, progress } = update;
    return {
      updateOne: {
        filter: { email: user.email },
        update: { $set: { progress } },
      },
    };
  });

  const result = await db.collection("users").bulkWrite(operations);

  res.status(200).json({ result });
}
