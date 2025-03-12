import express from 'express'
import { getJobbyId, getJobs } from '../controllers/jobsController.js';

const jobsRouter = express.Router()

jobsRouter.get('/', getJobs)
jobsRouter.get('/:id', getJobbyId)

export default jobsRouter;