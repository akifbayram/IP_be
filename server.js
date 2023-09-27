const express = require("express");
const db = require("./database");
const app = express();
const PORT = 3001;
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Endpoint: Health check
app.get("/health-check", (req, res) => {
  res.send("Hello World");
  console.log("Health check endpoint was hit");
});

// Endpoint: Database connection check
app.get("/checkDatabaseConnection", (req, res) => {
  db.query("SELECT 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Database is connected" });
  });
});

// Endpoint: Fetch the top movies based on rental count
app.get("/movies/top", (req, res) => {
  db.query(
    `
    SELECT film.film_id, film.title, COUNT(rental.rental_id) AS rental_count 
    FROM rental 
    JOIN inventory ON rental.inventory_id = inventory.inventory_id 
    JOIN film ON inventory.film_id = film.film_id 
    GROUP BY film.film_id 
    ORDER BY rental_count DESC 
    LIMIT 5
  `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Endpoint: Fetch top actors based on the number of films they've acted in
app.get("/actors/top", (req, res) => {
  db.query(
    `
    SELECT actor.actor_id, actor.first_name, actor.last_name, COUNT(film_actor.film_id) AS film_count 
    FROM actor 
    JOIN film_actor ON actor.actor_id = film_actor.actor_id 
    GROUP BY film_actor.actor_id 
    ORDER BY film_count DESC 
    LIMIT 5
  `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Endpoint: Fetch detailed information of a specific movie_id
app.get("/movies/details/:id", (req, res) => {
  const movieId = req.params.id;
  db.query(
    `SELECT film.title, film.release_year, film.length, film.rating, 
            group_concat(CONCAT(actor.first_name, ' ', actor.last_name)) AS actors,
            MAX(category.name) AS category
    FROM film 
    LEFT JOIN film_actor ON film.film_id = film_actor.film_id 
    LEFT JOIN actor ON film_actor.actor_id = actor.actor_id 
    LEFT JOIN film_category ON film.film_id = film_category.film_id 
    LEFT JOIN category ON film_category.category_id = category.category_id
    WHERE film.film_id = ? 
    GROUP BY film.film_id`,
    [movieId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0]);
    }
  );
});

// Endpoint: Fetch detailed information of a specific actor identified by their ID
app.get("/actors/details/:id", (req, res) => {
  const actorId = req.params.id;

  db.query(
    `SELECT actor.first_name, actor.last_name, film.title, COUNT(rental.rental_id) AS rental_count 
     FROM actor 
     JOIN film_actor ON actor.actor_id = film_actor.actor_id 
     JOIN film ON film_actor.film_id = film.film_id 
     JOIN inventory ON film.film_id = inventory.film_id
     JOIN rental ON inventory.inventory_id = rental.inventory_id
     WHERE actor.actor_id = ?
     GROUP BY film.film_id
     ORDER BY rental_count DESC 
     LIMIT 5`,
    [actorId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const actorDetails = {
        first_name: results[0]?.first_name,
        last_name: results[0]?.last_name,
        top_movies: results.map((movie) => ({
          title: movie.title,
          rental_count: movie.rental_count,
        })),
      };

      res.json(actorDetails);
    }
  );
});

// Endpoint: Fetch all movie categories
app.get("/movies/genres", (req, res) => {
  db.query("SELECT name FROM category", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint: Fetch all movies
app.get("/movies/all", (req, res) => {
  db.query("SELECT film.film_id, film.title FROM film", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint: Fetch all actors
app.get("/actors/all", (req, res) => {
  db.query("SELECT actor.actor_id, actor.first_name, actor.last_name FROM actor", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint: Fetch list of actors that match whole words in first or last name or actor_id. If no query is provided, fetch all actors
app.get("/actors/search", (req, res) => {
  const query = req.query.q;
  let sql = "";

  if (query === "") {
    sql = "SELECT actor_id, first_name, last_name FROM actor";
  } else {
    sql = `SELECT actor_id, first_name, last_name FROM actor WHERE first_name LIKE ? OR last_name LIKE ? OR actor_id LIKE ?`;
  }
  db.query(sql, [`%${query}%`, `%${query}%`, query], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint: Fetch movies by name, category, or actor based on query
app.get("/movies/search", (req, res) => {
  const query = req.query.q;
  const type = req.query.type;

  let sql = "";
  let sqlParams = [];

  if (type === "movie_name") {
    sql = "SELECT film.film_id, film.title FROM film WHERE film.title LIKE ?";
    sqlParams = [`%${query}%`];
  } else if (type === "movie_genre") {
    sql = `SELECT film.film_id, film.title 
           FROM film 
           JOIN film_category ON film.film_id = film_category.film_id
           JOIN category ON film_category.category_id = category.category_id
           WHERE category.name = ?`;
    sqlParams = [query];
  } else if (type === "actor_name") {
    sql = `SELECT film.film_id, film.title 
           FROM film 
           JOIN film_actor ON film.film_id = film_actor.film_id
           JOIN actor ON film_actor.actor_id = actor.actor_id
           WHERE actor.first_name LIKE ? AND actor.last_name LIKE ?`;
    const [firstName, lastName] = query.split(" ");
    sqlParams = [`%${firstName || ""}%`, `%${lastName || ""}%`];
  }

  db.query(sql, sqlParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint: Fetch list of all customers
app.get("/customers", (req, res) => {
  db.query(
    "SELECT customer_id, first_name, last_name FROM customer",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Endpoint: Fetch all customer information along with their rentals
app.get("/customers/rentals", (req, res) => {
  db.query(
    `SELECT customer.customer_id, customer.first_name, customer.last_name,
            rental.rental_id, rental.rental_date, rental.return_date, film.title
     FROM customer
     LEFT JOIN rental ON customer.customer_id = rental.customer_id
     LEFT JOIN inventory ON rental.inventory_id = inventory.inventory_id
     LEFT JOIN film ON inventory.film_id = film.film_id`,
    [],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Endpoint: Fetch list of customers that match whole words in first or last name or customer_id. If no query is provided, fetch all customers
app.get("/customers/search", (req, res) => {
  const query = req.query.q;
  let sql = "";
  let params = [];

  if (query === "") {
    sql = "SELECT customer_id, first_name, last_name FROM customer";
  } else {
    sql = `SELECT customer_id, first_name, last_name FROM customer WHERE first_name LIKE ? OR last_name LIKE ? OR customer_id LIKE ? OR CONCAT(first_name, ' ', last_name) LIKE ?`;
    params = [`%${query}%`, `%${query}%`, query, `%${query}%`];
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint: Fetch all customer details including current rentals
app.get("/customers/details/:id", (req, res) => {
  const customerId = req.params.id;
  db.query(
    `SELECT customer_id, first_name, last_name, email, address.address, address.district, address.city_id, address.postal_code, address.phone, city.city, country.country
       FROM customer
       JOIN address ON customer.address_id = address.address_id
       JOIN city ON address.city_id = city.city_id
       JOIN country ON city.country_id = country.country_id
       WHERE customer_id = ?`,
    [customerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const customerDetails = {
        customer_id: results[0]?.customer_id,
        first_name: results[0]?.first_name,
        last_name: results[0]?.last_name,
        email: results[0]?.email,
        address: results[0]?.address,
        district: results[0]?.district,
        city: results[0]?.city,
        country: results[0]?.country,
        postal_code: results[0]?.postal_code,
        phone: results[0]?.phone,
      };

      db.query(
        `SELECT film.title, rental.rental_date, rental.return_date
           FROM customer
           JOIN rental ON customer.customer_id = rental.customer_id
           JOIN inventory ON rental.inventory_id = inventory.inventory_id
           JOIN film ON inventory.film_id = film.film_id
           WHERE customer.customer_id = ?`,
        [customerId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          customerDetails.rentals = results.map((rental) => ({
            title: rental.title,
            rental_date: rental.rental_date,
            return_date: rental.return_date,
          }));

          res.json(customerDetails);
        }
      );
    }
  );
});

// Endpoint: Fetch customer rentals
app.get("/customers/:id/rentals", (req, res) => {
  const customerId = req.params.id;
  db.query(
    "SELECT * FROM rental WHERE customer_id = ?",
    [customerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Starting server, listen to port
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});