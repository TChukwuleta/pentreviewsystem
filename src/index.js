const express = require("express")
const app = express()
const logger = require("./helpers/logger")
require("dotenv").config()
const port = process.env.PORT
const fileUpload = require("express-fileupload")
require("./config/mongoose")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())

// Home page
app.get("/", (req, res) => {
    res.status(200).send({ 
        message: "Welcome to Pent. Your go to application regarding home/house reviews. Everything you need to know, all in one click"
    })
})

// Routes 
app.use("/api", require("./routes/index"))

// Other routes
app.get("*", (req, res) => {
    res.status(404).send({
        message: "Oops... You are in the wrong neigborhood. Kindly return to home pagee"
    })
})

app.listen(port, () => {
    logger.info(`Server started at ${port}`)
})