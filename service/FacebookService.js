import graph from 'fbgraph'
import request from 'request'
import cron from 'cron'
import { db } from '../db'

let access_token = "139610759813141|f928e2e59299981a997116c967a20b1d"
graph.setAccessToken(access_token)


const pageIDs = ['157556534255462', '137096719666941', '158324029747']

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

export function getFbUser(userID) {
  let params = {
    fields: "id, name, picture"
  }
  return new Promise((resolve, reject) => {
    graph.get(userID, params, (err, res) => {
      if(!err) {
        resolve(res)
      }
      else {
        reject(err)
      }
    })
  })
}

function saveFbUser(userID) {
  db.FB_USER.findOne({id: userID}, (err, document) => {
    if(!document) {
      getFbUser(userID).then(user => {
        user.picture = user.picture.url
        db.FB_USER.insert(user, err => {
          if(err) {
            console.log(err)
          }
        })
      })
    }
  })
}

function saveFbPage(pageID) {
  db.FB_PAGE.findOne({id: pageID}, (err, document) => {
    if(!document) {
      getFbPageDetail(pageID).then(page => {
        db.FB_PAGE.insert(page, err => {
          if(err) {
            console.log(err)
          }
        })
      })
    }
  })
}

function saveFbPost(pageID) {
  let until = new Date()
  let since = new Date()
  since.setDate(until.getDate() - 5)
  let untilStr = until.getFullYear() + '-' + (until.getMonth() + 1) + '-' + until.getDate()
  let sinceStr = since.getFullYear() + '-' + (since.getMonth() + 1) + '-' + since.getDate()
  getFbFeed(pageID, sinceStr, untilStr).then(feeds => {
    feeds.data.forEach(feed => {
      db.FB_POST.findOne({id: feed.id}, (err, document) => {
        if(!document) {
          let feedTemp = {}
          feedTemp.id = feed.id
          feedTemp.created_time = new Date(feed.created_time)
          feedTemp.msg = feed.message
          feedTemp.page_id = pageID
          db.FB_POST.insert(feedTemp, err => {
            if(err) {
              console.log(err)
            }
          })
        }
      })
    })
  })
}

function saveFbComment(postID) {
  getFbComment(postID).then(comments => {
    comments.data.forEach(comment => {
      db.FB_COMMENT.findOne({id: comment.id}, (err, document) => {
        if(!document) {
          comment.post_id = postID
          comment.created_time = new Date(comment.created_time)
          db.FB_COMMENT.insert(comment, err=> {
            if(err) {
              console.log(err)
            }
          })
        }
      })
    })
  })
}

//cron for user
const cronSaveFbUser = new cronJob('*/30 * * * * *', () => {
  db.FB_COMMENT.find((err, document) => {
    document.forEach(comment => {
      saveFbUser(comment.from.id)
    })
  })
},
() => {
  console.log('cronSaveFbUser has stopped')
},
true
)

//cron for comment
const cronSaveFbComment = new cronJob('*/30 * * * * *', () => {
  db.FB_POST.find((err, document) => {
    if(!err) {
      document.forEach(feed => {
        saveFbComment(feed.id)
      })
    }
    else {
      console.log(err)
    }
  })
},
() => {
  console.log('cronSaveFbComment has stopped')
},
true
)

// cron for post
const cronSaveFbPost = new cronJob('*/30 * * * * *', () => {
  pageIDs.forEach(pageID => {
    saveFbPost(pageID)
  })
},
() => {
  console.log('cronSaveFbPost has stopped.')
},
true
)

//cron for page
const cronSaveFbPage = new cronJob('*/30 * * * * *', () => {
  pageIDs.forEach(pageID => {
    saveFbPage(pageID)
  })
},
() => {
  console.log('cronSaveFbPage has stopped.')
},
true
)
