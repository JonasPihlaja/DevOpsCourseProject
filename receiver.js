const express = require('express');
const receiver = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const request = require('request')


let notificationsArr = [];

receiver.use(bodyParser.urlencoded({ extended: false }))
receiver.use(bodyParser.json())

receiver.use(express.json());
receiver.post('/notifications', (req, res) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    });

    req.on('end', () => {
        let payload = JSON.parse(body)
        //console.log(payload)
        setNotification(payload)
    });
    return res.end("ok");
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
        }
    } else{
        notificationsArr.push(notification);
    }
    console.log(notificationsArr);
}

function getNotification(){
    return notificationsArr;
}
module.exports.list = notificationsArr;
module.exports.getNotification = getNotification;
module.exports.listener = receiver;


/*
//THIS WAS USED TO ACCEPT A SUBSCRIPTION FOR AN AWS NOTIFICATION SERVICE
receiver.use(bodyParser.urlencoded({ extended: false }))
receiver.use(bodyParser.json())

receiver.post('/notifications', (req, res) => {
    console.log(req.body)
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })
  
    req.on('end', () => {
      let payload = JSON.parse(body)
  
      if (payload.Type === 'SubscriptionConfirmation') {
        const promise = new Promise((resolve, reject) => {
          const url = payload.SubscribeURL
  
          request(url, (error, response) => {
            if (!error && response.statusCode == 200) {
              console.log('Yess! We have accepted the confirmation from AWS')
              return resolve()
            } else {
              return reject()
            }
          })
        })
  
        promise.then(() => {
          res.end("ok")
        })
      }
    })
  });

  receiver.listen(3000, () => console.log(`Receiver listening on port 3000`));*/
