import jwt from 'jsonwebtoken'
import User from '../models/User'
import dbConnect from './db'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24hr',
  })
}

export const isAuth = async (req, res, next) => {
  await dbConnect()
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
}

export const isSuperAdmin = async (req, res, next) => {
  if (req.user && req.user.group === 'super admin') {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as a super admin')
  }
}

export const isAdmin = async (req, res, next) => {
  if (
    req.user &&
    (req.user.group === 'admin' || req.user.group === 'super admin')
  ) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export const isExaminer = async (req, res, next) => {
  if (
    req.user &&
    (req.user.group === 'admin' ||
      req.user.group === 'super admin' ||
      req.user.group === 'examination')
  ) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}
