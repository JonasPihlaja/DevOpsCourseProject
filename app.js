const { App } = require("@slack/bolt");
const {Webclient} = require("@slack/web-api")
require("dotenv").config();
const receiver = require('./receiver');
const listener = receiver.listener;
const getNotifications = receiver.getNotification;
const list = receiver.list;


let notificationArr;
listener.use((req, resp, next) => {
  notificationArr = list;
  console.log("getNotifications")
  console.log(list)
  next();
});
listener.listen(3030, () => console.log(`Receiver listening on port 3030`));




// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  //app.action()
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);

})();


/*const express = require('express');
const serv = express();
const PORT = process.env.PORT || 3030;

serv.use(express.json());
serv.post('/notifications', (req, res) => res.json(req.body));
serv.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

receiver.router.post("/notifications", (_req, res) => {
  console.log(_req);
  res.send("You can access this page without x-slack- headers!");
});

receiver.router.get("/", (_req, res) => {
  res.send("You can access this page without x-slack- headers!");
});
*/