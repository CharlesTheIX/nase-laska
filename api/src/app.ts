import api from './api';
import dotenv from 'dotenv';
import connectToMongoDB from './library/utils/connectToMongoDB';

if (process.env.ENV !== 'production') dotenv.config({ path: './.env' });

const port = Number(process.env.PORT) || 5001;

connectToMongoDB();
api.listen(port, () => {
  console.log(`\nServer is running on port ${port} | ${process.env.ENV} mode.`);
});
