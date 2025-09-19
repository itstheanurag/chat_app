import cors, { CorsOptions } from "cors";

export const allowedOrigins: string[] = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

export const allowedMethods: string[] = (process.env.CORS_METHODS ?? "")
  .split(",")
  .map((m) => m.trim())
  .filter((m) => m.length > 0);

export const allowedHeaders: string[] = (process.env.CORS_HEADERS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter((h) => h.length > 0);

if (
  !allowedOrigins.length ||
  !allowedMethods.length ||
  !allowedHeaders.length
) {
  console.error("❌ Missing or invalid CORS configuration in .env");
  process.exit(1);
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log("origin", origin);
    if (allowedOrigins.includes(origin!)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: allowedMethods,
  allowedHeaders,
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
