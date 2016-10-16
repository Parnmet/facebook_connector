"user strict"
import express from 'express'
import minimist from 'minimist'

export let swaggerPath = express()
let argv = minimist(process.argv.slice(2))

swaggerPath.get('/', (req, res) => {
  res.sendFile(__dirname +'/dist/index.html')
})

let domain = 'localhost'
if(argv.domain !== undefined)
    domain = argv.domain
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')
export let applicationUrl = 'http://' + domain + ':6001'
