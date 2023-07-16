import express from 'express'
import __dirname from './utils.js'
import { engine } from 'express-handlebars'
import {join} from 'path'
import {api, home} from './routes/index.js'

const app = express() // Initialize express app

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', join(__dirname, '/views'))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
// This line facilitates the server to read and manage long and complex urls.
app.use('/static', express.static(join(__dirname + '/public')))

app.get('/', ((req, res) => {
    res.render('index')
}))

app.use('/api', api)
app.use('/', home)

app.listen(8080, () => console.log(`Server up and listening in port 8080`))
// Starting the server