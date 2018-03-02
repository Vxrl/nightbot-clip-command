const express = require('express');

/*const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/


const app = express();

app.get("/", (req, res) => 
{
    res.send("Hello");
});

app.listen(5000, () =>
{
    console.log("Listening on port 5000");
});
