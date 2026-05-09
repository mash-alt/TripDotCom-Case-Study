import bcrypt from 'bcryptjs';

const hash = '$2b$10$OCYPHmBLIzm.G12efTbHuuqDTEZ1aXhpEJTgl9hZF4i09aBFmg5Ka';
const password = 'Password123!';

async function verify() {
  const result = await bcrypt.compare(password, hash);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log(`Match: ${result}`);
}

verify();
