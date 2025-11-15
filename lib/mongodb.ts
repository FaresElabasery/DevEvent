import mongoose, { ConnectOptions, Mongoose } from "mongoose";

// Read MongoDB connection string from environment variables.
// Throw early with a clear message if it's missing so callers fail fast.
const MONGODB_URI = process.env.MONGODB_URI ?? "";
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your environment"
  );
}

// Typed cache used to store Mongoose connection and connection promise.
// Stored on Node's global object to survive module reloads in development.
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // Add a single well-named property to the global object to avoid
  // conflicting with the `mongoose` import name.
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Access the global cache in a fully typed manner without using `any`.
const globalWithCache = global as unknown as { _mongooseCache?: MongooseCache };
if (!globalWithCache._mongooseCache) {
  globalWithCache._mongooseCache = { conn: null, promise: null };
}
const cache = globalWithCache._mongooseCache as MongooseCache;

/**
 * Connect to MongoDB using Mongoose with a cached connection.
 *
 * - Reuses an existing connection when available (prevents multiple connections during HMR).
 * - Uses a connection promise to ensure concurrent callers share the same in-flight request.
 * - Returns the resolved `Mongoose` instance.
 */
export async function dbConnect(): Promise<Mongoose> {
  // If there's an existing, ready connection, return it immediately.
  if (cache.conn) {
    return cache.conn;
  }

  // If a connection is already being established, reuse its promise.
  if (!cache.promise) {
    const opts: ConnectOptions = {
      // Recommended: disable buffering to fail fast when the server is unreachable.
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    };

    // Store the promise so parallel calls share the same connection attempt.
    cache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m)
      .catch((err) => {
        cache.promise = null;
        // On next call, dbConnect() will retry with exponential backoff or caller implements it
        throw err;
      });
  }

  // Await the connection promise and cache the resolved Mongoose instance.
  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;
