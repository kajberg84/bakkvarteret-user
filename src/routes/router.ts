/**
 * Main Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express, { Router } from 'express'
import createError from 'http-errors'
import { userRouter } from './user-router'
import { loginRouter } from './login-router'
import { usersRouter } from './users-router'

const router: Router = express.Router()

router.use('/user', userRouter)
router.use('/users', usersRouter)
router.use('/login', loginRouter)


// Catch 500 as last route
router.use('*', (req, res, next) => next(createError(500)))

export default router
