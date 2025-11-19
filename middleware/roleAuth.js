/**
 * Role-Based Access Control Middleware
 * Protects routes based on user roles (student, teacher, admin)
 */

// Middleware to check if user has required role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    // Check if account is active
    if (!req.user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is deactivated. Please contact support.' 
      });
    }

    next();
  };
};

// Middleware to check if user is a student
export const requireStudent = requireRole('student');

// Middleware to check if user is a teacher
export const requireTeacher = requireRole('teacher');

// Middleware to check if user is an admin
export const requireAdmin = requireRole('admin');

// Middleware to check if user is teacher or admin
export const requireTeacherOrAdmin = requireRole('teacher', 'admin');

// Middleware to check if user is student or teacher
export const requireStudentOrTeacher = requireRole('student', 'teacher');

// Middleware to check specific admin permissions
export const requireAdminPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    // Check specific permission
    if (!req.user.adminProfile?.permissions?.[permission]) {
      return res.status(403).json({ 
        success: false, 
        message: `Admin permission required: ${permission}` 
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or is admin
export const requireOwnerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. You can only access your own resources.' 
    });
  };
};

// Middleware to attach user role info to request
export const attachRoleInfo = (req, res, next) => {
  if (req.user) {
    req.roleInfo = {
      isStudent: req.user.role === 'student',
      isTeacher: req.user.role === 'teacher',
      isAdmin: req.user.role === 'admin',
      canManageContent: req.user.role === 'teacher' || req.user.role === 'admin',
      canManageUsers: req.user.role === 'admin' && req.user.adminProfile?.permissions?.manageUsers
    };
  }
  next();
};

