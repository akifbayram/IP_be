# Individual Project - Backend

This repository contains the backend portion of the project.

## Prerequisites

Ensure that you have the following installed on your local machine:

- [Node.js and npm](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/)

## Setup

Clone the frontend and backend repositories to the same parent directory:

### Backend
```
git clone https://github.com/akifbayram/IP_be.git IP_be
```

### Frontend
```
git clone https://github.com/akifbayram/IP_fe.git IP_fe
```

Navigate to the backend folder and install the required Node.js packages:

```
cd IP_be
npm init
npm install express
```

## Usage

### Setting Up the Database

Before running the backend server, ensure you have MySQL installed and configured.

1. **Create a MySQL database named `sakila`.**
   
2. **Import the Sakila sample database**
   - Import the Sakila sample database. You can find instructions and the necessary files on the [official MySQL documentation page](https://dev.mysql.com/doc/sakila/en/).

3. **Update Database Credentials**
   - Open the `database.js` file located in the backend root directory.

4. **Configure with Your MySQL Database Credentials:**

   - host: Your MySQL server host (default is localhost).
   - user: Your MySQL user (default is root).
   - database: The name of your MySQL database (default is sakila).
   - password: The password for your MySQL user.

5. **Save the Changes**

   - Save the database.js file after updating the credentials.

### Starting the Server

To start the server, navigate to the backend folder and run:

```
node server.js
```

The server will start on port 3000. Open a web browser and navigate to:

```
http://localhost:3000
```