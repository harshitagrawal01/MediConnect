import express from 'express';
import { generateToken } from '../controllers/videoController.js';

const videoRouter = express.Router();

videoRouter.post('/get-token',generateToken);

export default videoRouter;