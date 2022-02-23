/**
 * Login Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express from 'express'
import { authenticateJWT, signJwt, verifyRefreshToken } from '../utils/jwtHandler'
import createError from 'http-errors'
import { SignOptions } from 'jsonwebtoken'

export const refreshRouter = express.Router()

// Refresh router.
refreshRouter.post('/', (req, res, next) => {
  console.log('refreshrouter')
  const { email, refreshToken } = req.body

  if (!email || !refreshToken) {
    throw createError(400, 'Missing email or refresh token')
  }

  const validRefreshToken = verifyRefreshToken(email, refreshToken)

  if (!validRefreshToken) {
    next(createError(401, 'Invalid token, Try logging in again.'))
  }

  // Creating payload for jwt
  const payload = {
    _id: validRefreshToken._id,
    email: validRefreshToken.email,
    permissionLevel: validRefreshToken.permissionLevel
  }
  const accSignOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '10min'
  }
  const accessToken = signJwt(payload, accSignOptions)

  res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken
  })
})
