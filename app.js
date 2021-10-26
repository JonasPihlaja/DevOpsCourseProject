const { App, ExpressReceiver } = require("@slack/bolt");
const {Webclient} = require("@slack/web-api");
const { createEventAdapter } = require('@slack/events-api');
const { request } = require("express");
require("dotenv").config();

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

const bodyParser = require('body-parser');
let notificationsArr = [];

receiver.router.post('/notifications', (req, res) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  });
  req.on('end', () => {
      let payload = JSON.parse(body)
      setNotification(payload)
  });
  return res.end("ok");
});

receiver.router.post('/rockpaperscissor', async (req, res) => {
  let result = `To play, choose rock :facepunch:, paper:raised_hand_with_fingers_splayed: or scissor:v: 
  (Choose one of the emojis and send it back to me:smiley_cat:)`
  res.send(result);
});

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver
});

receiver.router.post('/checktopic', (req, res) => {
  let text = 'Notifications since last server restart: ';
  for(let i=0; i<notificationsArr.length; i++){
    text += `

    Sender: ${notificationsArr[i].name} 
    Subject: ${notificationsArr[i].subject} 
    Message: ${notificationsArr[i].message}
    
    `
  }
  res.send(text);
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);

})();

app.message(':facepunch:', async ({ message, say }) => {
  let result = rockPaperScissors('rock');
  await say(result);
});
app.message(':raised_hand_with_fingers_splayed:', async ({ message, say }) => {
  let result = rockPaperScissors('paper');
  await say(result);
});
app.message(':v:', async ({ message, say }) => {
  let result = rockPaperScissors('scissors');
  await say(result);
});

function setNotification(payload){
  let notification = {};
  notification.id = payload.MessageId;
  notification.message = payload.Message;
  if(payload.Subject){
      notification.subject = payload.Subject;
  }
  if(payload.MessageAttributes){
      notification.attributes = payload.MessageAttributes;
      notification.name = Object.keys(notification.attributes);
  }
  let idUnique = true;
  if(notificationsArr.length > 0){
      for(let i = 0; i>notificationsArr.length; i++){
          if (notificationsArr[i].id == notification.id) {
              idUnique = false;
          } 
      }
      if(idUnique == true){
          notificationsArr.push(notification);
          postNotification(notification);
      }
  } else{
      notificationsArr.push(notification);
      postNotification(notification);
  }
}

async function postNotification(notification){
  let text =`
  Sender: ${notification.name} 
  Subject: ${notification.subject} 
  Message: ${notification.message}
  `
  const result = await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: 'C02J5VBCSA0',
    text: text
  });
}

function rockPaperScissors(userInput){
  var randomHand = Math.floor(Math.random() * 3);
  var choices = ["rock", "paper", "scissors"];
  var botChoice = choices[randomHand];
  var outcome = "no change";

  

  if(userInput == "rock"){
      if(botChoice == "scissors"){outcome = "Bot lost"}
      else if(botChoice == "paper"){outcome = "Bot wins"}
      else if(botChoice == "rock"){outcome = "Tie"}
  } 
  else if(userInput == "scissors"){
      if(botChoice == "paper"){outcome = "Bot lost"}
      else if(botChoice == "rock"){outcome = "Bot wins"}
      else if(botChoice == "scissors"){outcome = "Tie"}
  }
  else if(userInput == "paper"){
      if(botChoice == "rock"){outcome = "Bot lost"}
      else if(botChoice == "scissors"){outcome = "Bot wins"}
      else if(botChoice == "paper"){outcome = "Tie"}
  }
  let result = `
  Bot chose: ${botChoice}
  Result: ${outcome}`
  return result;
}