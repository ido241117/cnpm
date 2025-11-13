import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function hashPasswords() {
  try {
    // Read users.json
    const filePath = path.join(__dirname, '../data/users.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const usersData = JSON.parse(data);
    
    // Hash passwords
    const studentPassword = await bcrypt.hash('student123', 10);
    const tutorPassword = await bcrypt.hash('tutor123', 10);
    
    console.log('🔐 Hashed passwords:');
    console.log('Student password (student123):', studentPassword);
    console.log('Tutor password (tutor123):', tutorPassword);
    
    // Update users
    usersData.users = usersData.users.map(user => {
      if (user.role === 'STUDENT') {
        user.password = studentPassword;
      } else if (user.role === 'TUTOR') {
        user.password = tutorPassword;
      }
      return user;
    });
    
    // Write back
    await fs.writeFile(filePath, JSON.stringify(usersData, null, 2));
    console.log('✅ Updated users.json with hashed passwords');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

hashPasswords();



