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
    let testOk = false;
    if(outcome !== 'no change'){
        testOk = true
    }
    return testOk;
  }
module.exports=rockPaperScissors