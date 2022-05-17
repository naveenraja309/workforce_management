const express = require("express")
const router = express.Router()
const admin_Authorize = require("../_middleware/admin_authorize")
const userService = require("./admin.service")
const resmodel = require("../_middleware/responseModel")
const mysql = require("mysql")
const config = require("../config.json")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcryptjs")

var email = require("emailjs")
var server = email.server.connect({
  user: "naveenraja.sr@gmail.com",
  password: "ejuxfgjotwfgsqff",
  host: "smtp.gmail.com",
  ssl: true
})

//mysql Connection - JWT admin_Authorized apis
const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
})

connection.connect((error) => {
  if (error) throw error
  connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database.database}\`;`,
    function (err_A, rows_A) {}
  )
  module.exports = connection
  console.log("Successfully connected to the database.")
})
// Connection End

// routes
router.post("/api/email-verification", emailVerify)
router.post("/api/verify-otp", VerifyOtp)
router.post("/api/resend-otp", ResendOtp)
router.post("/api/setup-application", setupApplication)
router.post("/api/personal-Password", personalPassword)
router.post("/api/login", authenticate)

router.post("/api/getAnnouncements", admin_Authorize(), getAnnouncements)
router.post("/api/announcement-add", admin_Authorize(), AnnouncementAdd)
router.post("/api/getComments", admin_Authorize(), getComments)
router.post("/api/commentsAdd", admin_Authorize(), commentsAdd)

////////////////////////////////////////// ROUTES END  /////////////////////////////////////////////

//Email Verification//
function emailVerify(req, res) {
  const { email } = req.body
  var otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false
  })
  server.send(
    {
      text: `your otp is ${otp}`,
      from: "workspace management",
      to: email,
      subject: "verification code"
    },
    function (err, message) {
      if (message) {
        var queryString_A = "INSERT INTO users (email,otp) VALUES(?,?) "
        connection.query(queryString_A, [email, otp], function (err_A, rows_A) {
          if (rows_A) {
            var data1 = [rows_A]
            res_arr = resmodel.sendResponse(data1, `Otp sent to ${email}`)
            res.send(res_arr)
          } else {
            res_arr = resmodel.sendError(err_A)
            res.send(res_arr)
          }
        })
      } else {
        res_arr = resmodel.sendError(err)
        res.send(res_arr)
      }
    }
  )
}

//Verify Otp//
function VerifyOtp(req, res) {
  const { otp, id } = req.body
  var queryString_A = "SELECT * FROM users WHERE id = ? AND deleted= 0"
  var queryString_B = "UPDATE users SET otp=0 WHERE id= ? AND deleted =0 "
  connection.query(queryString_A, [id], function (err_A, rows_A) {
    if (rows_A) {
      var entryOtp = rows_A[0].otp
      if (otp === entryOtp) {
        connection.query(queryString_B, [id], function (err_B, rows_B) {
          if (rows_B) {
            var data1 = [rows_B]
            res_arr = resmodel.sendResponse(
              data1,
              `Email verification successfull`
            )
            res.send(res_arr)
          } else {
            res_arr = resmodel.sendError(
              "Something went wrong, please try again."
            )
            res.send(res_arr)
          }
        })
      } else {
        res_arr = resmodel.sendError("Please Enter Valid OTP")
        res.send(res_arr)
      }
    } else {
      res_arr = resmodel.sendError("Please Enter Valid OTP")
      res.send(res_arr)
    }
  })
}

//resend OTP//
function ResendOtp(req, res) {
  const { id } = req.body
  var queryString_A = "SELECT otp,email FROM users WHERE id=? AND deleted=0"
  connection.query(queryString_A, [id], function (err_A, rows_A) {
    if (rows_A) {
      var otp = rows_A[0].otp
      var email = rows_A[0].email
      server.send(
        {
          text: `your otp is ${otp}`,
          from: "workspace management",
          to: email,
          subject: "verification code"
        },
        function (err, message) {
          if (message) {
            var data1 = [rows_A]
            res_arr = resmodel.sendResponse(
              data1,
              `please check your ${email} otp resent successful`
            )
            res.send(res_arr)
          } else {
            res_arr = resmodel.sendError(
              "Something went wrong, please try again."
            )
            res.send(res_arr)
          }
        }
      )
    } else {
      res_arr = resmodel.sendError("Something went wrong, please try again.")
      res.send(res_arr)
    }
  })
}

//setupApplication//
function setupApplication(req, res) {
  const { companyName, Location, Employees, Domain, id } = req.body
  var queryString_A =
    "UPDATE users set company_name=?,location=?,no_of_employees=?,domain_name=? WHERE id=? "
  connection.query(
    queryString_A,
    [companyName, Location, Employees, Domain, id],
    function (err_A, rows_A) {
      if (rows_A) {
        var data1 = [rows_A]
        res_arr = resmodel.sendResponse(data1, `Application setup successfully`)
        res.send(res_arr)
      } else {
        res_arr = resmodel.sendError("Please Enter Valid OTP")
        res.send(res_arr)
      }
    }
  )
}

//personalPassword//
function personalPassword(req, res) {
  const { firstName, lastName, password, id } = req.body
  const name = `${firstName}${lastName}`
  const saltRounds = 10
  var passwordHash = bcrypt.hashSync(password, saltRounds)
  var queryString_A = "UPDATE users set user_name=?,password=? WHERE id=? "
  connection.query(
    queryString_A,
    [name, passwordHash, id],
    function (err_A, rows_A) {
      if (rows_A) {
        var data1 = [rows_A]
        res_arr = resmodel.sendResponse(
          data1,
          `Personal details added successfully ${firstName}${lastName}`
        )
        res.send(res_arr)
      } else {
        res_arr = resmodel.sendError("Please Enter Valid OTP")
        res.send(res_arr)
      }
    }
  )
}

//get Announcements//
function getAnnouncements(req, res) {
  const { userId } = req.body
  var queryString_A = "SELECT * FROM announcements WHERE deleted =0"
  connection.query(queryString_A, [], function (err_A, rows_A) {
    if (rows_A) {
      var data1 = { announcementList: rows_A }
      res_arr = resmodel.sendResponse(data1, "Data retrieved successfully")
      res.send(res_arr)
    } else {
      res_arr = resmodel.sendError(
        "Something went wrong, please try again later"
      )
      res.send(res_arr)
    }
  })
}

//AnnouncementAdd//
function AnnouncementAdd(req, res) {
  const {
    userId,
    subject,
    category,
    eventDate,
    eventTime,
    location,
    notify,
    reminder,
    description,
    today
  } = req.body
  var queryString_A = "SELECT user_name FROM users WHERE id=? AND deleted =0"
  var queryString_B =
    "INSERT INTO announcements (userId,userName,subject,category,event_date,event_time,location,notify_to,reminder_expiry_date,description,announcement_add_date) VALUES(?,?,?,?,?,?,?,?,?,?,?)"
  connection.query(queryString_A, [userId], function (err_A, rows_A) {
    if (rows_A) {
      var userName = rows_A[0].user_name
      connection.query(
        queryString_B,
        [
          userId,
          userName,
          subject,
          category,
          eventDate,
          eventTime,
          location,
          notify,
          reminder,
          description,
          today
        ],
        function (err_B, rows_B) {
          if (rows_B) {
            var data1 = [rows_B]
            res_arr = resmodel.sendResponse(
              data1,
              `Announcement Added succesfully`
            )
            res.send(res_arr)
          } else {
            res_arr = resmodel.sendError(
              "Something went wrong, please try again later"
            )
            res.send(res_arr)
          }
        }
      )
    } else {
      res_arr = resmodel.sendError(
        "Something went wrong, please try again later"
      )
      res.send(res_arr)
    }
  })
}

//get Comments//
function getComments(req, res) {
  const { announcementId } = req.body
  var queryString_A = "SELECT * FROM comments WHERE event_id=? AND deleted =0"
  connection.query(queryString_A, [announcementId], function (err_A, rows_A) {
    if (rows_A) {
      console.log(rows_A)
      var data1 = { commentsList: rows_A }
      res_arr = resmodel.sendResponse(data1, "Data retrieved successfully")
      res.send(res_arr)
    } else {
      res_arr = resmodel.sendError(
        "Something went wrong, please try again later"
      )
      res.send(res_arr)
    }
  })
}

//comments Add//
function commentsAdd(req, res) {
  console.log("hello")
  const { comment, eventId, userName, today } = req.body
  var queryString_A =
    "INSERT INTO comments (event_user_name,event_id,comment,time) VALUES(?,?,?,?)"
  connection.query(
    queryString_A,
    [userName, eventId, comment, today],
    function (err_A, rows_A) {
      console.log(err_A)
      if (rows_A) {
        var data1 = [rows_A]
        res_arr = resmodel.sendResponse(data1, `comments Added succesfully`)
        res.send(res_arr)
      } else {
        res_arr = resmodel.sendError(
          "Something went wrong, please try again later"
        )
        res.send(res_arr)
      }
    }
  )
}

function authenticate(req, res, next) {
  const { userName, password } = req.body
  var user_name = userName
  var data1
  userService
    .authenticate(user_name, password)
    .then((user) => {
      delete user["password"]
      ;(data1 = resmodel.sendResponse(user, "Login successfully")),
        res.send(data1)
    })
    .catch(next)
}

module.exports = router
