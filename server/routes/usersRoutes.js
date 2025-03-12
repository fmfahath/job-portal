import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/usersController.js'
import upload from '../middlewares/multer.js'

const usersRouter = express.Router()

usersRouter.get('/user', getUserData)
usersRouter.post('/apply', applyForJob)
usersRouter.get('/applications', getUserJobApplications)
usersRouter.post('/update-resume', upload.single('resume'), updateUserResume)

export default usersRouter;