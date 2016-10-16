"use strict";
import express from 'express'
import * as FacebookService from '../service/FacebookService'

let facebookRouter = express.Router()



facebookRouter.route('/').get((req, res) => {
  res.send('<h1>Facebook Connector</h1>')
})

facebookRouter.route('/getPageDetail').get((req, res) => {
     FacebookService.getFbDetail(req.query.pageID)
     .then( (feeds) =>{
        res.send(feeds)
    })
})

facebookRouter.route('/getFeedByPageID').get((req, res) => {
     FacebookService.getFbFeed(req.query.pageID,req.query.since,req.query.until)
     .then( (feeds) =>{
        res.send(feeds)
    })
})

facebookRouter.route('/getCommentByPostID').get((req, res) => {
    FacebookService.getFbComment(req.query.postID).then((page) =>{
        res.send(page)
    })
})

facebookRouter.route('/getUserDetail').get((req, res) => {
     FacebookService.getFbDetail(req.query.userID)
     .then( (feeds) =>{
        res.send(feeds)
    })
})

export default facebookRouter