// user-model.ts

import mongoose from 'mongoose'
import validator from 'validator'
import { Schema } from 'mongoose'

export interface IUser {
  _id: string
  firstname?: string
  lastname?: string
  password: string
  email?: string
  friends?: string[]
  favouritePastries?: string[]
  favouriteStores?: string[]
  permissionLevel?: Number
  avatar?: string
  dateOfEntry?: Date
  lastUpdated?: Date
}

// Schema
const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true, maxlength: [100, 'firstname to long'], trim: true },
  lastname: { type: String, required: true, maxlength: [100, 'lastname to long'], trim: true },
  password: { type: String, required: true, maxlength: 1000, minlength: [10, 'Password to short'], trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Not a valid email'
    }
  },
  friends: { type: [String], required: false },
  favouritePastries: { type: [String], required: false },
  favouriteStores: { type: [String], required: false },
  permissionLevel: Number,
  dateOfEntry: {
    type: Date,
    default: new Date()
  },
  lastUpdated: {
    type: Date,
    default: new Date()
  },
  avatar: String
})

const UserModel = mongoose.model('UserModel', userSchema)

export default UserModel

// age
