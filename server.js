'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const helmet = require('helmet')
const mongoose = require('mongoose')

const aux = require('./helpers')
const apiRoutes = require('./routes/api.js')

const app = express()

dotenv.config()

const CONNECTION_STRING = process.env.MONGO_URI

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })

app.use(helmet())
app.use('/public', express.static(process.cwd() + '/public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Sample front-end
app.route('/:project/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/issue.html')
})

//Index page (static HTML)
app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// Mongoose schema

const Schema = mongoose.Schema

const issueSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean,
})

const projectSchema = new Schema({
  title: String,
  issues: [issueSchema],
})

const Project = mongoose.model('Project', projectSchema)

const Issue = mongoose.model('Issue', issueSchema)
// Routing for API
app
  .route('/api/issues/:project')
  .post(async (req, res) => {
    const project = req.params.project

    // console.log(`\n${req.method} request to ${req.url} has been successfully received!`)
    // console.log(`The body of the request to ${req.url} is ${JSON.stringify(req.body)}`)

    if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
      const creationTime = new Date()
      const result = await Project.find({ title: project })

      let issue = req.body
      issue.created_on = creationTime
      issue.updated_on = creationTime
      issue.open = true

      // console.log(issue)

      let data

      if (!result.length) {
        const newProject = new Project({ title: project })
        newProject.issues.push(issue)
        data = await newProject.save()
        // console.log(`New project with name ${project} has been created.`)
        // console.log(data)
      } else {
        // console.log(result)
        result[0].issues.push(issue)
        data = await result[0].save()
      }

      res.json([data.issues[data.issues.length - 1]])
    } else {
      res.status(400).end()
    }
  })
  .put(async (req, res) => {
    const project = req.params.project

    // console.log(`\n${req.method} request to ${req.url} has been successfully received!`)
    // console.log(`The body of the request to ${req.url} is ${JSON.stringify(req.body)}`)

    let fieldsToUpdate = {}

    for (const entry in req.body) {
      if (entry !== '_id') {
        fieldsToUpdate[entry] = req.body[entry]
      }
    }

    const result = await Project.find({ title: project })

    if (!req.body._id) {
      res.status(400).end()
    } else if (aux.isEmpty(fieldsToUpdate)) {
      res.send(`no updated field sent`)
    } else if (!result.length) {
      res.send(`no project found with title ${project}`)
    } else {
      const issueIndex = aux.findIndexById(result[0].issues, req.body._id)
      if (issueIndex >= 0) {
        let issue = result[0].issues[issueIndex]
        for (const entry in fieldsToUpdate) {
          issue[entry] = fieldsToUpdate[entry]
        }
        issue.updated_on = new Date()
        let data = await result[0].save()
        if (data.title) {
          res.send(`successfully updated`)
        } else {
          res.send(`could not update ${req.body._id}`)
        }
      } else {
        res.send(`could not update ${req.body._id}`)
      }
    }
  })
  .get(async function(req, res) {
    const project = req.params.project

    const result = await Project.find({ title: project })

    if (result.length) {
      let issues = aux.normalizeArray(result[0].issues)

      for (const item in req.query) {
        if (req.query[item] === 'true' || req.query[item] === 'false') {
          req.query[item] = req.query[item] === 'true'
        }
        issues = issues.filter(value => value[item] == req.query[item])
      }

      res.json(issues)
    } else {
      res.send(`could not find project named ${project}`)
    }
  })
  .delete(async function(req, res) {
    const project = req.params.project

    const result = await Project.find({ title: project })

    if (!result.length) {
      res.send(`could not find project named ${project}`)
    } else if (!req.body._id) {
      res.send('_id error')
    } else {
      if (aux.findIndexById(result[0].issues, req.body._id) < 0) {
        res.send('_id error')
      } else {
        result[0].issues = result[0].issues.filter(value => value._id != req.body._id)
        const data = await result[0].save()
        if (data.title) {
          res.send(`deleted ${req.body._id}`)
        } else {
          res.send(`could not delete ${req.body._id}`)
        }
      }
    }
  })

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found')
})

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function() {
  console.log(`Listening on port ${listener.address().port}`)
})

module.exports = app //for testing
