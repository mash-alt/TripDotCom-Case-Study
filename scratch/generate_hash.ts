import bcrypt from 'bcryptjs';

const password = 'Password123!';

async function generate() {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Password: ${password}`);
  console.log(`New Hash: ${hash}`);
}

generate();
