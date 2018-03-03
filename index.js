const express = require("express");
const request = require("request");

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");

app.get("/", (req, res) =>
{
    res.render("pages/index",
    {
        twitch_base_url: "https://api.twitch.tv/kraken/oauth2/authorize",
        twitch_client_id: process.env.TWITCH_CLIENT_ID,
        twitch_redirect_uri: process.env.TWITCH_REDIRECT_URI,
        twitch_response_type: "token",
        twitch_scope: process.env.TWITCH_SCOPE,
        twitch_force_verify: process.env.TWITCH_FORCE_VERIFY,

        nightbot_base_url: "https://api.nightbot.tv/oauth2/authorize",
        nightbot_client_id: process.env.NIGHTBOT_CLIENT_ID,
        nightbot_redirect_uri: process.env.NIGHTBOT_REDIRECT_URI,
        nightbot_response_type: "token",
        nightbot_scope: process.env.NIGHTBOT_SCOPE
    });
});

app.get("/nightbot", (req, res) =>
{
    res.render("pages/nightbot");
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
            res.send("Error: Failed to reach Twitch clips API: " + err);
            return;
        }

        let response;
        try
        {
            response = JSON.parse(body);
        }
        catch (e)
        {
            res.send("Error: Failed to parse response");
            return;
        }

        if (response.error)
        {
            if (!response.message)
            {
                res.send("Error: " + response.error);
                return;
            }

            let messageContainer;
            try
            {
                messageContainer = JSON.parse(response.message);
            }
            catch (e)
            {
                res.send(response.message);
                return;
            }

            if (!messageContainer.message)
            {
                res.send("Error: " + response.error);
                return;
            }

            res.send(messageContainer.message);
            return;
        }

        if (!response.data)
        {
            res.send("Error: No error message or data");
            return;
        }

        if (!response.data[0])
        {
            res.send("Error: Got data but no data[0]");
            return;
        }

        if (!response.data[0].edit_url)
        {
            res.send("Error: Got data but no edit_url");
            return;
        }

        res.send(response.data[0].edit_url);
    });
});

app.listen(port, () =>
{
    console.log(`Listening on port ${port}`);
});
