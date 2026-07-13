/**
 * Reusable wrapper to eliminate try-catch blocks in async controllers.
 * Passes errors automatically to the Express global error handling pipeline.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
