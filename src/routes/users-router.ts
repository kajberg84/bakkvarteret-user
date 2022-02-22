/**
 * User Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express, { Router } from 'express'
import { UserController } from '../controllers/user-controller'
import { authenticateJWT, hasPermission } from '../utils/jwtHandler'

export const usersRouter: Router = express.Router()
const controller = new UserController()

const PermissionLevels = Object.freeze({
  GUEST: 1,
  OWNER: 2,
  AUTH: 4,
  ADMIN: 8
})

// GET all users.
usersRouter.get(
  '/',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.getAll(req, res, next)
)
