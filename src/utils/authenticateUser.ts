import createHttpError from 'http-errors'
import { Request, Response, NextFunction } from 'express'

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user._id === req.params.id) {
      next()
    } else {
      next(createHttpError(403, 'You are not authorized to access this resource'))
    }
  } catch (error) {
    console.log('Error in authUser: ', error)
    next(createHttpError(500, 'Internal server error'))
  }
}
