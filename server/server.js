const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
require("dotenv").config({ path: "./config/config.env" });
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')

/**
 * is_https ändern
 */

app.use(logger)
app.use(credentials)

// routes
const auth = require('./routes/auth.js')
const users = require('./routes/api/users.js')
const facilities = require('./routes/api/facilityGroups.js')
const transports = require('./routes/api/transports.js')
const notifications = require('./routes/api/notifications.js')

// connect database
connectDB()

// cors
app.use(cors(corsOptions))

// init middleware
app.use(express.json({ extended : false}));
app.use(cookieParser())

// public routes
app.use('/auth', auth)

// protected routes
app.use('/api/users', users)
app.use('/api/facilities', facilities)
app.use('/api/transports', transports)
app.use('/api/notifications', notifications)

app.use(errorHandler)
//app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});