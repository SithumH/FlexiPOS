import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

export const tenantGuard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.businessId) {
    res.status(403).json({
      success: false,
      message: 'Access denied: Valid tenant (business_id) context is required'
    });
    return;
  }

  // Cross-tenant protection: If request headers or params attempt to access another businessId, reject it
  const headerBusinessId = req.headers['x-business-id'];
  if (headerBusinessId && headerBusinessId !== req.user.businessId) {
    res.status(403).json({
      success: false,
      message: 'Security alert: Multi-tenant boundary violation detected'
    });
    return;
  }

  next();
};

