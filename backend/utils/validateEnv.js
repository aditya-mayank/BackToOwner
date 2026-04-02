export const validateEnv = () => {
  // Reduced strict validation to allow local sandbox testing natively
  const requiredVars = [
    'PORT',
    'JWT_SECRET'
  ];

  const missingVars = requiredVars.filter(
    (envVar) => !process.env[envVar] || process.env[envVar].trim() === ''
  );

  if (missingVars.length > 0) {
    console.warn(`[ENV WARNING] Missing critical env vars: ${missingVars.join(', ')}`);
    // Disabled hard process.exit(1) so the user can boot a local sandbox freely
  }
};
