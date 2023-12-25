import clientPromise from "@/app/lib/mongodb";

export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = await client.db("test");

  const updates = req.body.updates;

  const operations = updates.map((update: any) => {
    const { user, progress } = update;
    const updateObject: any = {};
    for (const courseId in progress) {
      for (const lessonId in progress[courseId]) {
        for (const chapterId in progress[courseId][lessonId]) {
          const path = `progress.${courseId}.${lessonId}.${chapterId}`;
          updateObject[path] = progress[courseId][lessonId][chapterId];
        }
      }
    }
    return {
      updateOne: {
        filter: { email: user.email },
        update: { $set: updateObject },
      },
    };
  });

  const result = await db.collection("users").bulkWrite(operations);

  res.status(200).json({ result });
}
