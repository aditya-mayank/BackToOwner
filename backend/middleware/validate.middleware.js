import { check, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations sequentially or in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors to { field: err.path, message: err.msg }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ field: err.path || err.param, message: err.msg }));

    return res.status(400).json({
      success: false,
      errors: extractedErrors
    });
  };
};

export const registerValidation = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('email', 'Only @student.nitw.ac.in emails are allowed to register.').custom((val) => {
    if (!val || typeof val !== 'string') return false;
    return val.endsWith('@student.nitw.ac.in') || val === 'admin123@nitw.ac.in';
  }),
  check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
];

export const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty()
];

const validCategories = ['Electronics', 'Stationery', 'Clothing', 'Accessories', 'ID Card', 'Keys', 'Books', 'Other'];

export const itemValidation = [
  check('title', 'Title is required').notEmpty().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  check('description', 'Description is required').notEmpty().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  check('category', 'Invalid category selected').isIn(validCategories),
  check('location', 'Location is required').notEmpty().trim().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
  check('visibility').optional().isIn(['public', 'private']).withMessage('Visibility must be public or private')
];

export const messageValidation = [
  check('text', 'Message text cannot be empty').notEmpty().trim().isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];
