
const crypto = require('crypto')

const accessSecret = crypto.randomBytes(32).toString('hex');

const refreshSecret = crypto.randomBytes(64).toString('hex');

console.log("=== JWT Secrets Generator ===\n");
console.log(`JWT_ACCESS_SECRET=${accessSecret}`);
console.log(`JWT_REFRESH_SECRET=${refreshSecret}`);
console.log("\nCopy these values into your .env file!");
