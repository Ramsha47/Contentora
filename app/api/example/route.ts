// app/api/example/route.ts

import { connectToDatabase } from "../../../lib/db"; // Correct path to your db.ts file

export async function GET() {
  try {
    await connectToDatabase();
    return new Response(JSON.stringify({ message: "Database connected successfully!" }), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: "Database connection failed", error: error.message }), { status: 500 });
    } else {
      return new Response(JSON.stringify({ message: "Unknown error occurred", error: String(error) }), { status: 500 });
    }
  }
}
