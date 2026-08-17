const PRODUCTION_ENVS = new Set(['production', 'staging']);

function requireValue(config: Record<string, unknown>, key: string): string {
  const value = config[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

export function validateEnvironment(config: Record<string, unknown>) {
  const configuredEnvironment = config.NODE_ENV;
  const environment =
    typeof configuredEnvironment === 'string'
      ? configuredEnvironment.toLowerCase()
      : 'development';

  if (!['development', 'test', 'staging', 'production'].includes(environment)) {
    throw new Error(`Unsupported NODE_ENV: ${environment}`);
  }

  if (PRODUCTION_ENVS.has(environment)) {
    const jwtSecret = requireValue(config, 'JWT_SECRET');
    if (jwtSecret.length < 32 || jwtSecret === 'default-secret') {
      throw new Error('JWT_SECRET must be at least 32 characters in staging/production');
    }
    requireValue(config, 'DATABASE_URL');
    requireValue(config, 'REDIS_HOST');
    requireValue(config, 'CORS_ORIGINS');
  }

  return { ...config, NODE_ENV: environment };
}
