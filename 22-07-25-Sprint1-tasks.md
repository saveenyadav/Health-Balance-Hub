1. Initialize Node.js Project
    - npm init -y
2. Install Required Packages
    - npm install express mongoose bcryptjs jsonwebtoken joi dotenv
    - npm install --save-dev nodemon
3. Create Folder Structure
backend/
├── config/
│   └── db.js
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── .env
├── index.js

4.  Set Up .env and Config Files
5.  Set Up Database Connection
    - Create `config/db.js` to connect to MongoDB using Mongoose

    - Generate a random 64-byte hexadecimal string for the JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"