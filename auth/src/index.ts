import app from './app.ts';
import connectDB from './config/db.ts';

await connectDB();

app.listen(3000, () => {
  console.log('Authentication service running on port 3000');
});
