import app from './app.ts';
import connectDB from './config/db.ts';
import { env } from './config/env.ts';

await connectDB();

app.listen(env.PORT, () => {
  console.log(`Product service running on port ${env.PORT}`);
});
