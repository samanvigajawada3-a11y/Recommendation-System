const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { syncMoviesFromArchive } = require("../controllers/movieController");

dotenv.config();

const run = async () => {
  await connectDB();
  const count = await syncMoviesFromArchive();
  console.log(`Synced ${count} movies from Internet Archive`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
