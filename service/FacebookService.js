import graph from 'fbgraph'
import request from 'request'

let access_token = "139610759813141|f928e2e59299981a997116c967a20b1d"
graph.setAccessToken(access_token)

export function getFbDetail(userID) {
    var params = {fields: "name,picture"}    
    return new Promise((resolve) =>{
        graph.get(userID,params, (err, res) => {
            resolve(res)
        })
    })
     
}


export function getFbFeed(userID,since,until) {

    var params
    if(since){
        if(until){
            params = {fields: "message,created_time",since: since,until:until,limit: 100}
        }
        else{
            params = {fields: "message,created_time",since: since,limit: 100}
            
        }
    }
    else{
        params = {fields: "message,created_time",limit: 100}        
    }

    
    return new Promise((resolve,reject) => {

        graph.get(userID+"/feed",params,(err ,res) =>{
                resolve(res)
        })
       
    })
     
}

export function getFbComment(postID){

    let params = {summary : 1}
    return new Promise((resolve) => {
        graph.get(postID+"/comments",params,(err,res) => {
            resolve(res)
        })
    })

}
