import { v4 as uuidv4 } from 'uuid';

export function generateRandomString(length: number): string {
  const uuid = uuidv4();
  const alphanumeric = uuid.replace(/-/g, '').slice(0, length);
  return alphanumeric;
}