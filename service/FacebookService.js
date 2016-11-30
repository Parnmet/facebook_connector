import graph from 'fbgraph'
import request from 'request'
import cron from 'cron'
import { db } from '../db'

let access_token = "139610759813141|f928e2e59299981a997116c967a20b1d"
graph.setAccessToken(access_token)


const pageIDs = ['157556534255462']

const cronJob = cron.CronJob

export function getFbPageDetail(pageID) {
  var params = {fields: "name,picture"}
  return new Promise((resolve) => {
    graph.get(pageID,params, (err, res) => {
      resolve(res)
      if(err != null) {
        console.log(err)
      }
    })
  })
}


export function getFbFeed(pageID,since,until) {
  var params
  if(since) {
    if(until) {
      params = {fields: "message,created_time",since: since,until:until,limit: 100}
    }
    else {
      params = {fields: "message,created_time",since: since,limit: 100}
    }
  }
  else {
    params = {fields: "message,created_time",limit: 100}
  }

  return new Promise((resolve,reject) => {
    graph.get(pageID+"/feed",params,(err ,res) =>{
      resolve(res)
    })
  })
}

export function getFbComment(postID) {
  let params = {summary : 1}
  return new Promise((resolve) => {
    graph.get(postID+"/comments",params,(err,res) => {
      resolve(res)
    })
  })

}

function saveFBpage(pageID) {
  db.FB_PAGE.findOne({id: pageID}, (err, document) => {
    if(!document) {
      getFbPageDetail(pageID).then(page => {
        db.FB_PAGE.insert(page, err => {
          console.log(err)
        })
      })
    }
  })
}

function saveFBpost() {
  let currentDate = new Date()
  let passedDate = new Date()
  passedDate.setDate(currentDate.getDate() - 2)
}

//cron for post
const cronSaveFBpost = new cronJob('*/5 * * * * *', () => {
  saveFBpost()
},
() => {
  console.log('cronSaveFBpost has stopped.');
},
true
)

//cron for page
const cronSaveFBpage = new cronJob('*/30 * * * * *', () => {
  pageIDs.forEach(pageID => {
    saveFBpage(pageID)
  })
},
() => {
  console.log('cronSaveFBpage has stopped.')
},
true
)
