/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)

let projects = {
	first: {
		title: `test#${new Date('2016-02-01').getTime()}`,
		issues: {
			first: { title: `issue#${new Date('2006-02-01').getTime()}` },
			second: { title: `issue#${new Date('1996-02-01').getTime()}` },
			third: { title: `issue#${new Date('1986-02-01').getTime()}` },
		},
	},
	second: {
		title: `test#${new Date('2017-02-01').getTime()}`,
		issues: {
			first: { title: `issue#${new Date('2007-02-01').getTime()}` },
			second: { title: `issue#${new Date('1997-02-01').getTime()}` },
			third: { title: `issue#${new Date('1987-02-01').getTime()}` },
		},
	},
	third: {
		title: `test#${new Date('2018-02-01').getTime()}`,
		issues: {
			first: { title: `issue#${new Date('2008-02-01').getTime()}` },
			second: { title: `issue#${new Date('1998-02-01').getTime()}` },
			third: { title: `issue#${new Date('1988-02-01').getTime()}` },
		},
	},
}

suite('Functional Tests', function() {
	suite('POST /api/issues/{project} => object with issue data', function() {
		test('Every field filled in, #1', function(done) {
			const issueTitle = projects.first.issues.first.title
			const projectTitle = projects.first.title

			chai.request(server)
				.post(`/api/issues/${projectTitle}`)
				.send({
					issue_title: `${issueTitle}`,
					issue_text: 'First Issue',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Raul',
					status_text: 'In QA',
				})
				.end(function(err, res) {
					assert.equal(res.status, 200)
					assert.exists(res.body)
					assert.isArray(res.body)
					assert.isObject(res.body[0])
					assert.ownInclude(res.body[0], {
						issue_title: `${issueTitle}`,
						issue_text: 'First Issue',
						created_by: 'Functional Test - Every field filled in',
						assigned_to: 'Raul',
						status_text: 'In QA',
					})
					assert.property(res.body[0], 'created_on')
					assert.instanceOf(res.body[0].created_on, Date)
					assert.property(res.body[0], 'updated_on')
					assert.instanceOf(res.body[0].updated_on, Date)
					assert.property(res.body[0], 'open')
					assert.typeOf(res.body[0].open, 'boolean')
					assert.property(res.body[0], '_id')
					assert.typeOf(res.body[0]._id, 'string')
					projects.first.issues.first._id = res.body[0]._id
					done()
				})
		})

		test('Every field filled in, #2', function(done) {
			const issueTitle = projects.first.issues.second.title
			const projectTitle = projects.first.title
			chai.request(server)
				.post(`/api/issues/${projectTitle}`)
				.send({
					issue_title: `${issueTitle}`,
					issue_text: 'Second Issue',
					created_by: 'Functional Test - Every field filled in',
					assigned_to: 'Emma',
					status_text: 'Troubleshooting',
				})
				.end(function(err, res) {
					assert.equal(res.status, 200)
					assert.exists(res.body)
					assert.isArray(res.body)
					assert.isObject(res.body[0])
					assert.ownInclude(res.body[0], {
						issue_title: `${issueTitle}`,
						issue_text: 'Second Issue',
						created_by: 'Functional Test - Every field filled in',
						assigned_to: 'Emma',
						status_text: 'Troubleshooting',
					})
					assert.property(res.body[0], 'created_on')
					assert.instanceOf(res.body[0].created_on, Date)
					assert.property(res.body[0], 'updated_on')
					assert.instanceOf(res.body[0].updated_on, Date)
					assert.property(res.body[0], 'open')
					assert.typeOf(res.body[0].open, 'boolean')
					assert.property(res.body[0], '_id')
					assert.typeOf(res.body[0]._id, 'string')
					projects.first.issues.second._id = res.body[0]._id
					done()
				})
		})

		test('Required fields filled in', function(done) {
			const issueTitle = projects.first.issues.third.title
			const projectTitle = projects.first.title
			chai.request(server)
				.post(`/api/issues/${projectTitle}`)
				.send({
					issue_title: `${issueTitle}`,
					issue_text: 'text',
					created_by: 'Functional Test - Required fields filled in',
				})
				.end(function(error, response) {
					assert.equal(response.status, 200)
					assert.exists(response.body)
					assert.isArray(response.body)
					assert.isObject(response.body[0])
					assert.ownInclude(response.body[0], {
						issue_title: `${title}`,
						issue_text: 'text',
						created_by:
							'Functional Test - Required fields filled in',
						assigned_to: '',
						status_text: '',
					})
					assert.property(response.body[0], 'created_on')
					assert.instanceOf(response.body[0].created_on, Date)
					assert.property(response.body[0], 'updated_on')
					assert.instanceOf(response.body[0].updated_on, Date)
					assert.property(response.body[0], 'open')
					assert.typeOf(response.body[0].open, 'boolean')
					assert.property(response.body[0], '_id')
					assert.typeOf(response.body[0]._id, 'string')
					projects.first.issues.third._id = res.body[0]._id
					done()
				})
		})

		test('Missing required fields', function(done) {
			const testId = new Date().getTime()
			chai.request(server)
				.post(`/api/issues/test${testId}`)
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
			const testId =
				'4a502846d070e2088b7025abe80629830bf03d7ab5624d5e91f332bc9d049d3f'
			const title = projects.first.title

			chai.request(server)
				.put(`/api/issues/${title}`)
				.send({
					_id: testId,
					title: projects.first.issues.first.title,
				})
				.end(function(err, res) {
					assert.exists(res.text)
					assert.typeOf(res.text, 'string')
					assert.equal(res.text, `could not update ${testId}`)
					done()
				})
		})

		test('No body', function(done) {
			const testId = projects.first.issues.first._id
			const projectTitle = projects.first.title

			chai.request(server)
				.put(`/api/issues/${projectTitle}`)
				.send({ _id: testId })
				.end(function(err, res) {
					assert.exists(res.text)
					assert.typeOf(res.text, 'string')
					assert.equal(res.text, 'no updated field sent')
					done()
				})
		})

		test('One field to update', function(done) {
			const testId = projects.first.issues.first._id
			const projectTitle = projects.first.title

			chai.request(server)
				.put(`/api/issues/${projectTitle}`)
				.send({
					_id: testId,
					status_text: 'Testing possible fixes',
				})
				.end(function(err, res) {
					assert.exists(res.text)
					assert.typeOf(res.text, 'string')
					assert.equal(res.text, 'successfully updated')
					done()
				})
		})

		test('Multiple fields to update', async function(done) {
			const testId = projects.first.issues.third._id
			const projectTitle = projects.first.title

			chai.request(server)
				.put(`/api/issues/${projectTitle}`)
				.send({
					_id: testId,
					status_text: 'In production pipeline',
					assigned_to: 'Nero',
				})
				.end(function(err, res) {
					assert.exists(res.text)
					assert.typeOf(res.text, 'string')
					assert.equal(res.text, 'successfully updated')
					done()
				})
		})
	})

	suite(
		'GET /api/issues/{project} => Array of objects with issue data',
		function() {
			test('No filter', function(done) {
				const title = projects.first.issues.second.title

				chai.request(server)
					.get(`/api/issues/${title}`)
					.query({})
					.end(function(err, res) {
						assert.equal(res.status, 200)
						assert.exists(res.body)
						assert.isArray(res.body)

						for (const issue of res.body) {
							assert.isObject(issue)
							assert.property(issue, 'issue_title')
							assert.typeOf(issue.issue_title, 'string')
							assert.property(issue, 'issue_text')
							assert.typeOf(issue.issue_text, 'string')
							assert.property(issue, 'created_on')
							assert.instanceOf(issue.created_on, Date)
							assert.property(issue, 'updated_on')
							assert.instanceOf(issue.updated_on, Date)
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
				const title = projects.first.issues.second.title

				chai.request(server)
					.get(`/api/issues/${title}`)
					.query({ open: true })
					.end(function(err, res) {
						assert.equal(res.status, 200)
						assert.exists(res.body)
						assert.isArray(res.body)

						for (const issue of res.body) {
							assert.isObject(issue)
							assert.property(issue, 'issue_title')
							assert.typeOf(issue.issue_title, 'string')
							assert.property(issue, 'issue_text')
							assert.typeOf(issue.issue_text, 'string')
							assert.property(issue, 'created_on')
							assert.instanceOf(issue.created_on, Date)
							assert.property(issue, 'updated_on')
							assert.instanceOf(issue.updated_on, Date)
							assert.property(issue, 'created_by')
							assert.typeOf(issue.created_by, 'string')
							assert.property(issue, 'assigned_to')
							assert.typeOf(issue.assigned_to, 'string')
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

			test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
				const title = projects.first.issues.second.title

				chai.request(server)
					.get(`/api/issues/${title}`)
					.query({ open: true, assigned_to: 'Raul' })
					.end(function(err, res) {
						assert.equal(res.status, 200)
						assert.exists(res.body)
						assert.isArray(res.body)

						for (const issue of res.body) {
							assert.isObject(issue)
							assert.property(issue, 'issue_title')
							assert.typeOf(issue.issue_title, 'string')
							assert.property(issue, 'issue_text')
							assert.typeOf(issue.issue_text, 'string')
							assert.property(issue, 'created_on')
							assert.instanceOf(issue.created_on, Date)
							assert.property(issue, 'updated_on')
							assert.instanceOf(issue.updated_on, Date)
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
		}
	)

	suite('DELETE /api/issues/{project} => text', function() {
		test('No _id', function(done) {
			const title = projects.first.title

			chai.request(server)
				.delete(`api/issues/${title}`)
				.send({ title })
				.end(function(err, res) {
					assert.exists(res.text)
					assert.typeOf(res.text, 'string')
					assert.equal(res.text, '_id error')
					done()
				})
		})

		test('Invalid _id', function(done) {
			const title = projects.first.title
			const testId =
				'4a502846d070e2088b7025abe80629830bf03d7ab5624d5e91f332bc9d049d3f'

			chai.request(server)
				.delete(`api/issues/${title}`)
				.send({ _id: testId })
				.end(function(err, res) {
					assert.exists(res.text)
					assert.typeOf(res.text, 'string')
					assert.equal(res.text, '_id error')
					done()
				})
		})

		suite('Valid _id', function() {
			test('Issue #1', function(done) {
				const title = projects.first.title
				const testId = projects.first.issues.first._id

				chai.request(server)
					.delete(`api/issues/${title}`)
					.send({ _id: testId })
					.end(function(err, res) {
						assert.exists(res.text)
						assert.typeOf(res.text, 'string')
						assert.equal(res.text, `deleted ${testId}`)
						done()
					})
			})

			test('Issue #2', function(done) {
				const title = projects.first.title
				const testId = projects.first.issues.second._id

				chai.request(server)
					.delete(`api/issues/${title}`)
					.send({ _id: testId })
					.end(function(err, res) {
						assert.exists(res.text)
						assert.typeOf(res.text, 'string')
						assert.equal(res.text, `deleted ${testId}`)
						done()
					})
			})

			test('Issue #3', function(done) {
				const title = projects.first.title
				const testId = projects.first.issues.third._id

				chai.request(server)
					.delete(`api/issues/${title}`)
					.send({ _id: testId })
					.end(function(err, res) {
						assert.exists(res.text)
						assert.typeOf(res.text, 'string')
						assert.equal(res.text, `deleted ${testId}`)
						done()
					})
			})
		})
	})
})

suite('Extra Tests', function() {
	test('Extra test #1', function(done) {
		assert.fail()
		done()
	})
})
