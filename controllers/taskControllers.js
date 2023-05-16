const Users   = require("../models/user.js");
const jwt = require("jsonwebtoken");
const Tasks   = require("../models/task.js");
const bcrypt  = require('bcrypt');
const { valid } = require("joi");
const JWT_SECRET = "newtonSchool";

/*

request.body = {
    heading: heading,
    description: description,
    token: token
}

1. Create new task from request body .
2. From JWT token payload get creator_id of this task. (userId in payload will be creator_id).
3. Save heading, description, creator_id for every task.

Response :

1. Success

200 StatusCode

json = 
{
    "message": 'Task added successfully',
    "task_id": task._id, //id of task that is created.
    "status": 'success'
}

2. Unabel to verify token (Invalid Token)
404 Status Code
json = 
{
    "status": 'fail',
    "message": 'Invalid token'
}

3. Fail to do

404 Status Code
json = 
{
    "status": 'fail',
    "message": error message
}

*/

const createTask = async (req, res) => {
    const { heading, description, token } = req.body;

    try {
        // verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const creator_id = decoded.userId;

        // create new task
        const task = new Tasks({
            heading,
            description,
            creator_id
        });

        // save task
        await task.save();

        // send response
        res.status(200).json({
            message: 'Task added successfully',
            task_id: task._id,
            status: 'success'
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(404).json({
                status: 'fail',
                message: 'Invalid token'
            });
        } else {
            res.status(404).json({
                status: 'fail',
                message: error.message
            });
        }
    }
}

/*

getdetailTask Controller

req.body = {
    "task_id" : task_id,
    "token" : token
}

1. Return the detail of the task with given task_id.
2. For this task you will be only test with valid (Existing) task_id.

Response --> 

1. Success

200 Status code

json = {
  status: 'success',
  data: {
    Status: 'pending',
    _id: 'mxcnbxzcn-khscc',
    heading: 'Study Doglapan',
    description: 'Need to study atleast 10 Pages',
    creator_id: 'kdjhgsdjgmsbmbs'
  }
}

2. Fail

404 Status Code
json = {
    "status": 'fail',
    "message": error message
}

*/

const getdetailTask = async (req, res) => {
    const { task_id, token } = req.body;

    try {
        // verify the token
        jwt.verify(token, JWT_SECRET);

        // get task
        const task = await Tasks.findById(task_id);
        if (!task) throw new Error('Task not found');

        // send response
        res.status(200).json({
            status: 'success',
            data: task
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
}

module.exports = { createTask, getdetailTask };
