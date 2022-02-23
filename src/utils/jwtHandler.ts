// @ts-nocheck

// jwtHandler.js

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { getKey } from './keyHandler'
dotenv.config()

export const signJwt = (payload: any, options: any) => {
  const privateKey = getKey('private-key.pem')
  return jwt.sign(payload, privateKey, options)
}

/**
 * Authenticates requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization?.split(' ')
  if (authorization?.[0] !== 'Bearer') {
    next(createError(401, 'Invalid token'))
    return
  }
  try {
    const publicKey = getKey('public-key.pem')

    // Verify the JWT
    const payload: any = jwt.verify(authorization[1], publicKey)

    // Add the user to the request
    req.user = {
      _id: payload._id,
      email: payload.email,
      permissionLevel: payload.permissionLevel
    }

    next()
  } catch (error) {
    console.log('ERROR i authJWT', error)
    next(createError(403, 'Invalid token'))
  }
}

/**
 * Authorize requests.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {number} permissionLevel - ...
 */
export const hasPermission = (req: Request, res: Response, next: NextFunction, permissionLevel: number) => {
  req.user.permissionLevel >= permissionLevel
    ? next()
    : next(createError(403, 'You are not authorized to access this resource'))
}
/**
 * Verifying refreshToken
 *
 * @param {*} email
 * @param {*} token
 * @return {*} *
 */
export const verifyRefreshToken = (email: string, token: string): any => {
  try {
    const publicKey = getKey('public-key.pem')
    const payload: any = jwt.verify(token, publicKey)
    console.log('inne i verifyRefreshToken', payload)
    if (payload.email === email) {
      return payload
    }
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
