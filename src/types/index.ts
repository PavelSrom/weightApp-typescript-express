import { Request, Response, Router, NextFunction } from "express"

interface Req<T = {}> extends Request {
  userID?: string
  body: T
}
interface Res extends Response {}
interface Next extends NextFunction {}

export { Req, Res, Next, Router }
