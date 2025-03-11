import express from 'express'
import { changeJobApplicationsStatus, changeJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'

const comapnyRouter = express.Router()

comapnyRouter.post('/register', registerCompany)
comapnyRouter.post('/login', loginCompany)
comapnyRouter.get('/company', getCompanyData)
comapnyRouter.post('/post-job', postJob)
comapnyRouter.get('/list-jobs', getCompanyPostedJobs)
comapnyRouter.get('/applicants', getCompanyJobApplicants)
comapnyRouter.post('/change-status', changeJobApplicationsStatus)
comapnyRouter.post('/change-visibility', changeJobVisibility)

export default comapnyRouter;
