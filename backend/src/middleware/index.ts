import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export interface JwtPayloadOptions extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayloadOptions;
}

const auth = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
  const authHeader = request.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as unknown as JwtPayloadOptions;

    request.user = decoded;
    next();
  } catch (err) {
    return response.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
