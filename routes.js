
"use strict";
import express from 'express'
import bodyParser from 'body-parser'
import facebookRouter from './controller/FacebookController'
import cors from 'cors'
import swagger from 'swagger-node-express'
import { applicationUrl, swaggerPath } from './swagger'


const port = process.env.port || 6001
let app = express()

app.use(cors())
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//parent url
app.route('/').get((req, res) => {
  res.send('<h1>Social REST Api</h1><ul><li>/facebook</li></ul>')
})

app.use('/facebook', facebookRouter)

//Swagger
app.use('/swagger', swaggerPath)
swagger.setAppHandler(swaggerPath)
app.use(express.static(__dirname + '/dist'))
swagger.setApiInfo({
  title: "Facebook Connector API",
  description: "API connect to the Facebook",
  termsOfServiceUrl: "",
  contact: "yourname@something.com",
  license: "",
  licenseUrl: ""
})
swagger.configureSwaggerPaths('', 'api-docs', '')
swagger.configure(applicationUrl, '1.0.0')

//service start
app.listen(port, () => {
  console.log('Starting node.js on port ' + port)
});

