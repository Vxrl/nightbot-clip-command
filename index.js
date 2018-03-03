const express = require("express");
const request = require("request");

const app = express();
const port = process.env.PORT || 5000;

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

app.get("/clip", (req, res) =>
{
    const user_access_token = req.query.user_access_token;
    const channel_id = req.query.channel_id;

    if (!user_access_token || !channel_id)
    {
        res.send("Error: User access token and channel ID not specified");
        return;
    }

    request.post(
    {
        url: "https://api.twitch.tv/helix/clips",
        form:
        {
            broadcaster_id: channel_id
        },
        headers:
        {
            "Authorization": "Bearer " + user_access_token
        }
    }, (err, httpResponse, body) =>
    {
        if (err)
        {
            res.send("Error: failed to reach Twitch clips API: " + err);
            return;
        }

        let response;
        try
        {
            response = JSON.parse(body);
        }
        catch (e)
        {
            res.send("Error: failed to parse response");
            return;
        }

        if (response.error)
        {
            res.send(data.message || "Error: " + data.error);
            return;
        }

        if (!response.data)
        {
            res.send("Error: no error message or data");
            return;
        }

        if (!response.data[0])
        {
            res.send("Error: not data but no data[0]");
            return;
        }

        if (!response.data[0].edit_url)
        {
            res.send("Error: got data but no edit url");
            return;
        }

        res.send(response.data[0].edit_url);
    });
});

app.listen(port, () =>
{
    console.log(`Listening on port ${port}`);
});
