import clientPromise from "@/app/lib/mongodb";

export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = await client.db("test");

  const updates = req.body.updates;

  const operations = updates.map((update: any) => {
    const { user, progress } = update;
    const updateObject = {};
    for (const courseId in progress) {
      console.log(courseId);
      for (const lessonId in progress[courseId]) {
        console.log(lessonId);
        for (const chapterId in progress[courseId][lessonId]) {
          console.log(chapterId);
          updateObject[`progress.${courseId}.${lessonId}.${chapterId}`] =
            progress[courseId][lessonId][chapterId];
        }
      }
    }
    console.log("updateObject", JSON.stringify(updateObject, null, 2));
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
