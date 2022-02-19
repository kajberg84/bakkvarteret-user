/**
 * User Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express, { Router } from 'express'
import { UserController } from '../controllers/user-controller'
import { authenticateJWT, hasPermission } from '../utils/jwtHandler'
import { authenticateUser } from '../utils/authenticateUser'

export const userRouter: Router = express.Router()
const controller = new UserController()

const PermissionLevels = Object.freeze({
  GUEST: 1,
  OWNER: 2,
  AUTH: 4,
  ADMIN: 8
})

// GET one user.
userRouter.get(
  '/:id',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.getUser(req, res, next)
)

// Add a friend.
userRouter.patch(
  '/:id/add-friend',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.addFriend(req, res, next)
)

// Remove a friend.
userRouter.patch(
  '/:id/remove-friend',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.removeFriend(req, res, next)
)

// GET all users.
userRouter.get(
  '/',
  authenticateJWT,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.getAll(req, res, next)
)

// POST, create user
userRouter.post('/', (req, res, next) => controller.create(req, res, next))

//PUT, Update user
userRouter.put(
  '/:id',
  authenticateJWT,
  authenticateUser,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.update(req, res, next)
)

// DELETE, delete user.
userRouter.delete(
  '/:id',
  authenticateJWT,
  authenticateUser,
  (req, res, next) => hasPermission(req, res, next, PermissionLevels.AUTH),
  (req, res, next) => controller.delete(req, res, next)
)