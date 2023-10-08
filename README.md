# Individual Project - Backend

This repository contains the backend portion of the project.

## Prerequisites

Ensure that you have the following installed on your local machine:

- [Node.js and npm](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/)

## Setup

Clone the frontend and backend repositories to the same parent directory:

```
git clone https://github.com/akifbayram/IP_be.git IP_be
git clone https://github.com/akifbayram/IP_fe.git IP_fe
```

Navigate to the backend folder and install the required Node.js packages:

```
cd IP_be
npm install
```

## Starting the Server

To start the server, navigate to the backend folder and run:

```
node ./server.js
```

The server will start on port 3001.

## Setting Up the Database

Before running the backend server, ensure you have MySQL installed and configured.

1. Create a MySQL database named `sakila`.
   
2. Import the Sakila sample database. You can find instructions and the necessary files on the [official MySQL documentation page](https://dev.mysql.com/doc/sakila/en/).

3. Open the `database.js` file located in the backend root directory.

4. Configure with Your MySQL Database Credentials:

   - host: Your MySQL server host (default is localhost).
   - user: Your MySQL user (default is root).
   - database: The name of your MySQL database (default is sakila).
   - password: The password for your MySQL user.

5. Save the database.js file after updating the credentials.

## Individual Project Checklist

### Landing Page
- [x] View top 5 rented movies of all times.
- [x] Click on any of the top 5 movies and view its details.
- [x] View top 5 actors that are part of movies that I have in the store.
- [x] View the actor’s details and view their top 5 rented movies.

### Movies Page
- [x] Search a movie by name of film, name of actor, or genre of the film.
- [x] View details of the film.
- [ ] Rent out a film to a customer.

### Customers Page
- [x] View list of customers.
- [x] Filter/search customers by their customer ID, first name, or last name.
- [ ] Add new customers that enter the store.
- [x] Edit customers' details.
- [x] Delete a customer if they no longer wish to patron at store.
- [x] View customer details and see the movies they have rented out.
- [x] Indicate that a customer has returned a rented movie.

### Report Generator
- [x] Button to generate a PDF report of all customers who rented out movies from store.

## Completion Status
- [ ] 13/15 Completed

### Percent Complete: 66.67%