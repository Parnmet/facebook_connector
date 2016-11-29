import mongojs from 'mongojs'

let databaseUrl = 'SocialData'
let collections = ['FB_PAGE', 'FB_POST', 'FB_COMMENT']

export const db = mongojs(databaseUrl, collections)
