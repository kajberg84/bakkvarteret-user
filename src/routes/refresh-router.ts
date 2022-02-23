/**
 * Refresh Router.
 *
 * @author Kaj Berg
 * @version 0.0.1
 */

import express from 'express'
import { signJwt, verifyRefreshToken } from '../utils/jwtHandler'
import { SignOptions } from 'jsonwebtoken'
import createError from 'http-errors'

export const refreshRouter = express.Router()

// Refresh router.
refreshRouter.post('/', (req, res, next) => {
  try {
    const { email, refreshToken } = req.body

    if (!email || !refreshToken) {
      res.status(400).json('Missing email or refresh token')
    }

    const validRefreshToken = verifyRefreshToken(email, refreshToken)

    if (!validRefreshToken) {
      res.status(401).json('Invalid token, Try logging in again.')
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
  } catch (error) {
    next(createError(500, 'Something went wrong, please try again.'))
  }
})
