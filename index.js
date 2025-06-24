const express = require('express');
const fs=require('fs');
const users = require('./MOCK_DATA.json');


const app = express();
const port = 5000;



//midldleware -plugin
app.use(express.urlencoded({ extended: false }));


//routes
app.get("/users", (req, res) => {
    const html = `
    <h1>Users List</h1>
    <ul>
        ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>
    `;
    return res.send(html);
});

//Rest API route
app.get("/api/users", (req, res) => {
    return res.json(users);
});

app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        if (!user) {
            return res.send("User not found");
        } else {
            return res.json(user);
        }
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.send("User not found");
        }
        const updatedUser = { ...users[userIndex], ...req.body };
        users[userIndex] = updatedUser;
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            if (err) {
                return res.send("Error writing to file");
            } else {
                return res.json({ status: "success", data: updatedUser });
            }
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.send("User not found");
        }
        users.splice(userIndex, 1);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            if (err) {
                return res.send("Error deleting to file");
            } else {
                return res.json({ status: "success", message: "User deleted" });
            }
        });
    });

app.post("/api/users", (req, res) => {
    const body=req.body;
    users.push({ ...body, id: users.length + 1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data) => {
        if(err){
            return res.send("Error writing to file");
        }else{
            return res.status(201).json({ status: "success", data: body });
        }
    });
});

//host
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
