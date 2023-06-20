/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

  const express = require("express");
  // const fs = require("fs");
  const app = express();
  
  const router = express.Router();
  app.use(express.json());
  app.use("/", router);
  
  
  
  // Read the initial todos from the data.json file
  let users = [];
  
  router.get("/users", (req, res) => {
    res.status(200).send({ users: users });
  });
  
  router.get("/todos/:id", (req, res) => {
    const id = +req.params.id;
    const todo = users.find((t) => t.id === id);
    if (todo) {
      res.status(200).send(todo);
    } else {
      res.status(404).send("Not found");
    }
  });
  
  router.post("/signup", (req, res) => {
    const user = req.body;
    const newUser = { ...user, id: Math.floor(Math.random() * 1000000) };
    const userIndex = users.findIndex(u => u.id === newUser.id)
    if(userIndex===-1){
      users.push(newUser);
      res.status(201).send("user added");
    }
    else{
      res.send("user already exists")
    }
    
    // writeDataToFile();
    
  });
  router.post("/login", (req, res) => {
    const usr = req.body
    // const newUser = { ...user, id: Math.floor(Math.random() * 1000000) };
    const userIndex = users.findIndex(u => u.password === usr.password)
    if(userIndex===-1){
      res.status(401).send("401 unauthorized");
    }
    else{
      const user = users[userIndex];
      const ansObj = {
        id : user.id,
        firstName : user.firstName,
        lastName : user.lastName
      }
      res.status(200).send(ansObj)
    }
  });
  
  router.put("/todos/:id", (req, res) => {
    const body = req.body;
    const id = +req.params.id;
    const todoIndex = users.findIndex((t) => t.id === id);
    const todo = users[todoIndex];
    if (todoIndex === -1) {
      res.status(404).send("Not found");
    } else {
      users.splice(todoIndex, 1, { ...body, id: id });
      writeDataToFile();
      res.status(200).send("Updated");
    }
  });
  app.get("/data", (req, res) => {
    let password = req.headers.password;
    const userIndex = users.findIndex(u => u.password === password)
    if(userIndex===-1){
      res.status(401).send("401 unauthorized");
    }
    else{
      // const user = users[userIndex];
      // const ansObj = {
      //   id : user.id,
      //   firstName : user.firstName,
      //   lastName : user.lastName
      // }
      res.status(200).send({users})
    }
  });
  
  router.delete("/todos/:id", (req, res) => {
    const id = +req.params.id;
    const todoIndex = users.findIndex((t) => t.id === id);
    const todo = users[todoIndex];
    if (todo) {
      users.splice(todoIndex, 1);
      writeDataToFile();
      res.status(200).send("Deleted");
    } else {
      res.status(404).send("Not found");
    }
  });
  
  app.listen(3000, () => {
    console.log("Server started");
  });
  
  app.use("*", (req, res) => {
    res.status(404).send("Route not found");
  });
  
  
  
  module.exports = app;
  