import { createHash } from 'crypto';

export const jwtUnvalidatedKey = (value: string) => {
  return `jwt::unvalidated::${createHash('sha256')
    .update(value)
    .digest('hex')}`;
};
