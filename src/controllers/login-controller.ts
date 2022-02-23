// @ts-nocheck

/**
 * Module for the Login Controller.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import UserModel from '../models/user-model'
import createError from 'http-errors'
import jwt, { SignOptions } from 'jsonwebtoken'
import { checkUserPassword } from '../utils/passwordHandler'
import { Request, Response, NextFunction } from 'express'
import { getKey } from '../utils/keyHandler'
import dotenv from 'dotenv'
import { signJwt } from '../utils/jwtHandler'

dotenv.config()

/**
 * Encapsulates a controller.
 */
export class LoginController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
        throw createError(401, 'Invalid credentials')
      }

      // Check password
      const checkPassword = await checkUserPassword(req.body.password, user.password)
      if (!checkPassword) {
        throw createError(401, 'Invalid credentials')
      }
      // Creating payload for jwt
      const payload = {
        _id: user._id,
        email: user.email,
        permissionLevel: user.permissionLevel
      }
      const accSignOptions: SignOptions = {
        algorithm: 'RS256',
        expiresIn: '10min'
      }

      const refSignOptions: SignOptions = {
        algorithm: 'RS256',
        expiresIn: '1000min'
      }

      const accessToken = signJwt(payload, accSignOptions)
      const refreshToken = signJwt(payload, refSignOptions)

      res.status(200).json({
        access_token: accessToken,
        refresh_token: refreshToken
      })
    } catch (error) {
      console.log('ERROR i login')
      next(createError(401, 'Invalid credentials'))
    }
  }
}
