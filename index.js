const express = require("express");
const request = require("request");

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


app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) =>
{
    res.render("pages/index",
    {
        base_url: "https://api.twitch.tv/kraken/oauth2/authorize",
        client_id: process.env.TWITCH_CLIENT_ID,
        redirect_uri: process.env.TWITCH_REDIRECT_URI,
        response_type: "token",
        scope: process.env.TWITCH_SCOPE,
        force_verify: process.env.TWITCH_FORCE_VERIFY
    });
});

app.get("/auth", (req, res) =>
{
    if (req.query.hasOwnProperty("channel"))
    {
        const channel = req.query.channel;

        if (channel)
        {
            res.redirect("https://api.twitch.tv/kraken/oauth2/authorize" +
                "?client_id=" + encodeURIComponent(process.env.TWITCH_CLIENT_ID) +
                "&redirect_uri=" + encodeURIComponent(process.env.TWITCH_REDIRECT_URI) +
                "&response_type=token" +
                "&scope=" + encodeURIComponent(process.env.TWITCH_SCOPE) +
                "&force_verify=" + encodeURIComponent(process.env.TWITCH_FORCE_VERIFY) +
                "&state=" + encodeURIComponent(JSON.stringify(
                {
                    channel: channel
                }))
            );
        }
        else
        {
            res.render("pages/error",
            {
                message: "Channel not specified"
            });
        }
    }
    /*else if (req.query.hasOwnProperty("code") && req.query.hasOwnProperty("state"))
    {
        const code = req.query.code;
        const state = JSON.parse(req.query.state);

        if (code && state)
            request.post(
            {
                url: "https://id.twitch.tv/oauth2/token" +
                     "?client_id=" + encodeURIComponent(process.env.TWITCH_CLIENT_ID) +
                     "&client_secret=" + encodeURIComponent(process.env.TWITCH_CLIENT_SECRET) +
                     "&code=" + encodeURIComponent(code) +
                     "&grant_type=authorization_code" +
                     "&redirect_uri=" + encodeURIComponent(process.env.TWITCH_REDIRECT_URI)
            }, (err, httpResponse, body) =>
            {
                if (err)
                {
                    res.send("Auth failure: " + err);
                    return;
                }

                const response = JSON.parse(body);

                request.get(
                {
                    url: "https://api.twitch.tv/helix/users" +
                         "?login=" + encodeURIComponent(state.channel),
                    headers:
                    {
                        "Client-ID": process.env.TWITCH_CLIENT_ID,
                        "Authorization": "Bearer " + response.access_token
                    }
                }, (err2, httpResponse2, body2) =>
                {
                    if (err2)
                    {
                        res.send("Auth failure: " + err);
                        return;
                    }

                    res.send(body + "\n" + body2);
                })
            });
        else
            res.render("pages/error",
            {
               message: "Authorization code and state not found"
            });
    }*/
    else
    {
        res.redirect("/");
    }
});

app.listen(port, () =>
{
    console.log(`Listening on port ${port}`);
});
