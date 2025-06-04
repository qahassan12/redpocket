import path from 'path';

export function getStorageStatePath(name: string): string {
  const paths: { [key: string]: string } = {
    admin: path.resolve(__dirname, '../../../src/cookies/admin.json'), 
    
  };

  const filePath = paths[name];
  if (!filePath) {
    throw new Error(`No storage state path found for: ${name}`);
  }
  return filePath;
}
