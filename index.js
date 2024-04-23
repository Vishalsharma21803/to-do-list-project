const express = require("express");
const app = express();


const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

//connection to db
// mongoose.set("useFindAndModify", false);

// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
// console.log("Connected to db!");
// app.listen(3000, () => console.log("Server Up and running at port 3000"));
// });

mongoose.connect('mongodb://localhost:27017/');

app.set("view engine", "ejs");

// GET METHOD
app.get("/", async (req, res) => {
    try {
        const tasks = await TodoTask.find({});
        res.render("todo.ejs", { todoTasks: tasks });
    } catch (err) {
        console.error("Error retrieving tasks:", err);
        res.status(500).send("Error retrieving tasks");
    }
});


// app.get('/',(req, res) => {
//     res.render('todo.ejs');
//     });
// app.post('/',(req, res) => {
//         console.log(req.body);
//         });

//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

    //update

    app.route("/edit/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            const tasks = await TodoTask.find({});
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        } catch (err) {
            console.error("Error retrieving tasks for editing:", err);
            res.status(500).send("Error retrieving tasks for editing");
        }
    })
    .post(async (req, res) => {
        try {
            const id = req.params.id;
            await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
            res.redirect("/");
        } catch (err) {
            console.error("Error updating task:", err);
            res.status(500).send("Error updating task");
        }
    });
    

    //DELETE    
    app.route("/remove/:id").get(async (req, res) => {
        try {
            const id = req.params.id;
            await TodoTask.findByIdAndDelete(id);
            res.redirect("/");
        } catch (err) {
            console.error("Error removing task:", err);
            res.status(500).send("Error removing task");
        }
    });
    
    

app.listen(3000, () => console.log("Server Up and running  on port 3000"));

   
