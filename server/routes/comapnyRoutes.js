import express from 'express'
import { changeJobApplicationsStatus, changeJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../middlewares/multer.js'
import protectCompany from '../middlewares/authMiddleware.js'

const comapnyRouter = express.Router()

comapnyRouter.post('/register', upload.single('image'), registerCompany)
comapnyRouter.post('/login', loginCompany)
comapnyRouter.get('/company', protectCompany, getCompanyData)
comapnyRouter.post('/post-job', protectCompany, postJob)
comapnyRouter.get('/list-jobs', protectCompany, getCompanyPostedJobs)
comapnyRouter.get('/applicants', protectCompany, getCompanyJobApplicants)
comapnyRouter.post('/change-status', protectCompany, changeJobApplicationsStatus)
comapnyRouter.post('/change-visibility', changeJobVisibility)

export default comapnyRouter;
