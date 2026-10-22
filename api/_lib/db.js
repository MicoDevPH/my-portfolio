import { MongoClient, ObjectId } from 'mongodb'

// One client per warm serverless instance; reset on failure so the next request retries
let clientPromise

export async function getDb() {
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI).connect().catch((err) => {
      clientPromise = undefined
      throw err
    })
  }
  return (await clientPromise).db()
}

export { ObjectId }
