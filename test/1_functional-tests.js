const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function() {
  const baseId = new Date().getTime()
  const projects = {
    first: {
      title: `test#${baseId}P01`,
      issues: {
        first: { title: `issue#${baseId}P01I01` },
        second: { title: `issue#${baseId}P01I02` },
        third: { title: `issue#${baseId}P01I03` },
      },
    },
    second: {
      title: `test#${baseId + 20}P02`,
      issues: {
        first: { title: `issue#${baseId + 20}P02I01` },
        second: { title: `issue#${baseId + 20}P02I02` },
        third: { title: `issue#${baseId + 20}P02I03` },
      },
    },
    third: {
      title: `test#${baseId + 30}P03`,
      issues: {
        first: { title: `issue#${baseId + 30}P03I01` },
        second: { title: `issue#${baseId + 30}P03I02` },
        third: { title: `issue#${baseId + 30}P03I03` },
      },
    },
  }

  suite('POST /api/issues/{project} => object with issue data', function() {
    test('Every field filled in, #1', function(done) {
      const issueTitle = projects.first.issues.first.title
      const projectTitle = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .post(`/api/issues/${projectTitle}`)
        .send({
          issue_title: `${issueTitle}`,
          issue_text: 'First Issue',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Raul',
          status_text: 'In QA',
        })
        .end(function(error, response) {
          assert.equal(response.status, 200)
          assert.exists(response.body)
          assert.isArray(response.body)
          assert.isObject(response.body[0])
          assert.ownInclude(response.body[0], {
            issue_title: `${issueTitle}`,
            issue_text: 'First Issue',
            created_by: 'Functional Test - Every field filled in',
            assigned_to: 'Raul',
            status_text: 'In QA',
          })
          assert.property(response.body[0], 'created_on')
          assert.exists(new Date(response.body[0].created_on).getTime())
          assert.isOk(new Date(response.body[0].created_on).getTime())
          assert.property(response.body[0], 'updated_on')
          assert.exists(new Date(response.body[0].created_on).getTime())
          assert.isOk(new Date(response.body[0].created_on).getTime())
          assert.property(response.body[0], 'open')
          assert.typeOf(response.body[0].open, 'boolean')
          assert.property(response.body[0], '_id')
          assert.typeOf(response.body[0]._id, 'string')
          projects.first.issues.first._id = response.body[0]._id
          done()
        })
    })

    test('Every field filled in, #2', function(done) {
      const issueTitle = projects.first.issues.second.title
      const projectTitle = encodeURIComponent(projects.first.title)
      chai
        .request(server)
        .post(`/api/issues/${projectTitle}`)
        .send({
          issue_title: `${issueTitle}`,
          issue_text: 'Second Issue',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Emma',
          status_text: 'Troubleshooting',
        })
        .end(function(error, response) {
          assert.equal(response.status, 200)
          assert.exists(response.body)
          assert.isArray(response.body)
          assert.isObject(response.body[0])
          assert.ownInclude(response.body[0], {
            issue_title: `${issueTitle}`,
            issue_text: 'Second Issue',
            created_by: 'Functional Test - Every field filled in',
            assigned_to: 'Emma',
            status_text: 'Troubleshooting',
          })
          assert.property(response.body[0], 'created_on')
          assert.exists(new Date(response.body[0].created_on).getTime())
          assert.isOk(new Date(response.body[0].created_on).getTime())
          assert.property(response.body[0], 'updated_on')
          assert.exists(new Date(response.body[0].created_on).getTime())
          assert.isOk(new Date(response.body[0].created_on).getTime())
          assert.property(response.body[0], 'open')
          assert.typeOf(response.body[0].open, 'boolean')
          assert.property(response.body[0], '_id')
          assert.typeOf(response.body[0]._id, 'string')
          projects.first.issues.second._id = response.body[0]._id
          done()
        })
    })

    test('Required fields filled in', function(done) {
      const issueTitle = projects.first.issues.third.title
      const projectTitle = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .post(`/api/issues/${projectTitle}`)
        .send({
          issue_title: `${issueTitle}`,
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
          assigned_to: '',
          status_text: '',
        })
        .end(function(error, response) {
          assert.equal(response.status, 200)
          assert.exists(response.body)
          assert.isArray(response.body)
          assert.isObject(response.body[0])
          assert.ownInclude(response.body[0], {
            issue_title: `${issueTitle}`,
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in',
            assigned_to: '',
            status_text: '',
          })
          assert.property(response.body[0], 'created_on')
          assert.exists(new Date(response.body[0].created_on).getTime())
          assert.isOk(new Date(response.body[0].created_on).getTime())
          assert.property(response.body[0], 'updated_on')
          assert.exists(new Date(response.body[0].created_on).getTime())
          assert.isOk(new Date(response.body[0].created_on).getTime())
          assert.property(response.body[0], 'open')
          assert.typeOf(response.body[0].open, 'boolean')
          assert.property(response.body[0], '_id')
          assert.typeOf(response.body[0]._id, 'string')
          projects.first.issues.third._id = response.body[0]._id
          done()
        })
    })

    test('Missing required fields', function(done) {
      const testId = new Date().getTime()
      chai
        .request(server)
        .post(`/api/issues/${projects.first.title}`)
        .send({
          issue_title: `${testId}`,
        })
        .end(function(error, response) {
          assert.equal(response.status, 400)
          done()
        })
    })
  })

  suite('PUT /api/issues/{project} => text', function() {
    test('Incorrect ID', function(done) {
      const testId = '5c8851572b00b54f7ce65187'
      const title = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .put(`/api/issues/${title}`)
        .send({
          _id: testId,
          issue_title: `${projects.second.issues.first.title}`,
        })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, `could not update ${testId}`)
          done()
        })
    })

    test('No project with this title', function(done) {
      const testId = projects.first.issues.first._id
      const projectTitle = encodeURIComponent(projects.second.title)

      chai
        .request(server)
        .put(`/api/issues/${projectTitle}`)
        .send({
          _id: testId,
          issue_title: `${projects.second.issues.first.title}`,
        })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(
            response.text,
            `no project found with title ${decodeURIComponent(projectTitle)}`
          )
          done()
        })
    })

    test('No body', function(done) {
      const testId = projects.first.issues.first._id
      const projectTitle = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .put(`/api/issues/${projectTitle}`)
        .send({ _id: testId })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, 'no updated field sent')
          done()
        })
    })

    test('One field to update', function(done) {
      const testId = projects.first.issues.first._id
      const projectTitle = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .put(`/api/issues/${projectTitle}`)
        .send({
          _id: testId,
          status_text: 'Testing possible fixes',
        })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, 'successfully updated')
          done()
        })
    })

    test('Multiple fields to update', function(done) {
      const testId = projects.first.issues.third._id
      const projectTitle = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .put(`/api/issues/${projectTitle}`)
        .send({
          _id: testId,
          status_text: 'In production pipeline',
          assigned_to: 'Nero',
        })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, 'successfully updated')
          done()
        })
    })
  })

  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
    test('No project with this title', function(done) {
      const title = encodeURIComponent(projects.second.title)

      chai
        .request(server)
        .get(`/api/issues/${title}`)
        .query({})
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, `could not find project named ${decodeURIComponent(title)}`)
          done()
        })
    })
    test('No filter', function(done) {
      const title = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .get(`/api/issues/${title}`)
        .query({})
        .end(function(error, response) {
          assert.equal(response.status, 200)
          assert.exists(response.body)
          assert.isArray(response.body)

          for (const issue of response.body) {
            assert.isObject(issue)
            assert.property(issue, 'issue_title')
            assert.typeOf(issue.issue_title, 'string')
            assert.property(issue, 'issue_text')
            assert.typeOf(issue.issue_text, 'string')
            assert.property(response.body[0], 'created_on')
            assert.exists(new Date(response.body[0].created_on).getTime())
            assert.isOk(new Date(response.body[0].created_on).getTime())
            assert.property(response.body[0], 'updated_on')
            assert.exists(new Date(response.body[0].created_on).getTime())
            assert.isOk(new Date(response.body[0].created_on).getTime())
            assert.property(issue, 'created_by')
            assert.typeOf(issue.created_by, 'string')
            assert.property(issue, 'assigned_to')
            assert.typeOf(issue.assigned_to, 'string')
            assert.property(issue, 'open')
            assert.typeOf(issue.open, 'boolean')
            assert.property(issue, 'status_text')
            assert.typeOf(issue.status_text, 'string')
            assert.property(issue, '_id')
            assert.typeOf(issue._id, 'string')
          }

          done()
        })
    })

    test('One filter', function(done) {
      const title = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .get(`/api/issues/${title}`)
        .query({ assigned_to: 'Emma' })
        .end(function(error, response) {
          assert.equal(response.status, 200)
          assert.exists(response.body)
          assert.isArray(response.body)

          for (const issue of response.body) {
            assert.isObject(issue)
            assert.property(issue, 'issue_title')
            assert.typeOf(issue.issue_title, 'string')
            assert.property(issue, 'issue_text')
            assert.typeOf(issue.issue_text, 'string')
            assert.property(response.body[0], 'created_on')
            assert.exists(new Date(response.body[0].created_on).getTime())
            assert.isOk(new Date(response.body[0].created_on).getTime())
            assert.property(response.body[0], 'updated_on')
            assert.exists(new Date(response.body[0].created_on).getTime())
            assert.isOk(new Date(response.body[0].created_on).getTime())
            assert.property(issue, 'created_by')
            assert.typeOf(issue.created_by, 'string')
            assert.property(issue, 'assigned_to')
            assert.typeOf(issue.assigned_to, 'string')
            assert.equal(issue.assigned_to, 'Emma')
            assert.property(issue, 'open')
            assert.typeOf(issue.open, 'boolean')
            assert.property(issue, 'status_text')
            assert.typeOf(issue.status_text, 'string')
            assert.property(issue, '_id')
            assert.typeOf(issue._id, 'string')
          }

          done()
        })
    })

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      const title = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .get(`/api/issues/${title}`)
        .query({ assigned_to: 'Raul', open: true })
        .end(function(error, response) {
          assert.equal(response.status, 200)
          assert.exists(response.body)
          assert.isArray(response.body)

          for (const issue of response.body) {
            assert.isObject(issue)
            assert.property(issue, 'issue_title')
            assert.typeOf(issue.issue_title, 'string')
            assert.property(issue, 'issue_text')
            assert.typeOf(issue.issue_text, 'string')
            assert.property(response.body[0], 'created_on')
            assert.exists(new Date(response.body[0].created_on).getTime())
            assert.isOk(new Date(response.body[0].created_on).getTime())
            assert.property(response.body[0], 'updated_on')
            assert.exists(new Date(response.body[0].created_on).getTime())
            assert.isOk(new Date(response.body[0].created_on).getTime())
            assert.property(issue, 'created_by')
            assert.typeOf(issue.created_by, 'string')
            assert.property(issue, 'assigned_to')
            assert.typeOf(issue.assigned_to, 'string')
            assert.equal(issue.assigned_to, 'Raul')
            assert.property(issue, 'open')
            assert.typeOf(issue.open, 'boolean')
            assert.isTrue(issue.open)
            assert.property(issue, 'status_text')
            assert.typeOf(issue.status_text, 'string')
            assert.property(issue, '_id')
            assert.typeOf(issue._id, 'string')
          }

          done()
        })
    })
  })

  suite('DELETE /api/issues/{project} => text', function() {
    test('No project with this title', function(done) {
      const title = encodeURIComponent(projects.second.title)

      chai
        .request(server)
        .delete(`/api/issues/${title}`)
        .send({ title })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, `could not find project named ${decodeURIComponent(title)}`)
          done()
        })
    })

    test('No _id', function(done) {
      const title = encodeURIComponent(projects.first.title)

      chai
        .request(server)
        .delete(`/api/issues/${title}`)
        .send({ title })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, '_id error')
          done()
        })
    })

    test('Invalid _id', function(done) {
      const title = encodeURIComponent(projects.first.title)
      const testId = '5c8851572b00b54f7ce65187'

      chai
        .request(server)
        .delete(`/api/issues/${title}`)
        .send({ _id: testId })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, '_id error')
          done()
        })
    })

    test('Valid _id, issue #1', function(done) {
      const title = encodeURIComponent(projects.first.title)
      const testId = projects.first.issues.first._id

      chai
        .request(server)
        .delete(`/api/issues/${title}`)
        .send({ _id: testId })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, `deleted ${testId}`)
          done()
        })
    })

    test('Valid _id, issue #2', function(done) {
      const title = encodeURIComponent(projects.first.title)
      const testId = projects.first.issues.second._id

      chai
        .request(server)
        .delete(`/api/issues/${title}`)
        .send({ _id: testId })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, `deleted ${testId}`)
          done()
        })
    })

    test('Valid _id, issue #3', function(done) {
      const title = encodeURIComponent(projects.first.title)
      const testId = projects.first.issues.third._id

      chai
        .request(server)
        .delete(`/api/issues/${title}`)
        .send({ _id: testId })
        .end(function(error, response) {
          assert.exists(response.text)
          assert.typeOf(response.text, 'string')
          assert.equal(response.text, `deleted ${testId}`)
          done()
        })
    })
  })
})
