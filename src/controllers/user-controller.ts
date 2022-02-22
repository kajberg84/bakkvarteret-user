// @ts-nocheck

/**
 * Module for the User Controller.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import createError from 'http-errors'
import UserModel from '../models/user-model'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import { hashThisPassword } from '../utils/passwordHandler'
import { createSearchString } from '../utils/urlHandler'
import HateoasLinks from '../utils/hateoasLinksUser'

const baseUrl = process.env.BASE_URL

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Create a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create(req: Request, res: Response, next: NextFunction) {

    try {
      const { firstname, lastname, email, password } = req.body
      const newUser = new UserModel({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashThisPassword(password),
        permissionLevel: 4
      })
      const createdUser = await newUser.save()
      console.log('created user: ', createdUser)
      res.status(201).json({ _id: createdUser._id })
    } catch (error) {
      console.log('error: ', error)
      next(createError(400, 'Create user Error'))
    }
  }

  /**
   * Get user by id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUser(req: Request, res: Response, next: NextFunction) {
    const urlFields = req.query.fields || ''
    const searchFields = createSearchString(urlFields)
    try {
      const dbUser = await UserModel.findOne({ _id: req.params.id }).select(searchFields).select('-password')

      if (!dbUser) {
        next(createError(404, 'User with id not found'))
        return
      }
      if (!mongoose.isValidObjectId(dbUser)) {
        next(createError(404, 'User with id not found'))
      }

      const hateoas = new HateoasLinks(baseUrl)
      const response = await hateoas.createLink(dbUser, 'user')

      res.status(200).json(response)
    } catch (error) {
      console.log('Error in get user by id')
      next(createError(409, 'User with id not found'))
    }
  }

  /**
   * Get all users.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    const query = req.query
    const skip = req.query.skip || 0
    const limit = req.query.limit || 0
    const urlFields = req.query.fields || ''

    const searchFields = createSearchString(urlFields)

    try {
      const result = await UserModel.find(query).skip(skip).limit(limit).select(searchFields).select('-password')
      console.log('result', result)

      const hateoas = new HateoasLinks(baseUrl)
      const response = hateoas.createCollectionResponse(result, 'user')

      res.status(200).json(response)
    } catch (error) {
      console.log('ERROR i get all')
      next(createError(409, 'Error in finding all users'))
    }
  }

  /**
   * Update user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    const filter = { _id: req.user._id }
    const update = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.user.email
    }
    const options = { new: true }
    try {
      await UserModel.findByIdAndUpdate(filter, update, options)
      res.status(204).send('User updated')
    } catch (error) {
      console.log('ERROR in update user')
      next(createError(404, 'Can not update user'))
    }
  }

  /**
   * Delete user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await UserModel.findByIdAndDelete({ _id: req.user._id })
      res.status(204).json('User deleted')
    } catch (error) {
      console.log('ERROR i User pastry')
      next(createError(409, 'Can not delete user'))
    }
  }
  /**
   * Add friend by id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const dbUser = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          $addToSet: {
            friends: {
              $each: [req.params.id]
            }
          }
        },
        {
          new: true
        }
      )

      if (!dbUser) {
        next(createError(404, 'User with id not found'))
        return
      }
      if (!mongoose.isValidObjectId(dbUser)) {
        next(createError(404, 'User with id not found'))
      }

      const hateoas = new HateoasLinks(baseUrl)
      const response = await hateoas.createLink(dbUser, 'user')

      res.status(200).json(response)
    } catch (error) {
      console.log('Error in get user by id')
      next(createError(409, 'User with id not found'))
    }
  }

  /**
   * Remove friend by id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const dbUser = await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: {
            friends: {
              $in: [req.params.id]
            }
          }
        },
        {
          new: true
        }
      )

      const hateoas = new HateoasLinks(baseUrl)
      const response = await hateoas.createLink(dbUser, 'user')

      res.status(200).json(response)
    } catch (error) {
      console.log('Error in get user by id')
      next(createError(409, 'User with id not found'))
    }
  }
}
