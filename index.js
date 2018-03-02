const express = require('express');

const app = express();
const port = process.env.PORT || 5000;



/*const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/




app.get("/", (req, res) => 
{
    res.send("Hello");
});

app.listen(port, () =>
{
    console.log("Listening on port ${port}");
});
