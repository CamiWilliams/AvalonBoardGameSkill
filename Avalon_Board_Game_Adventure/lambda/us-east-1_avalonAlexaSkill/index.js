// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require('ask-sdk');

const HELP_MESSAGE = "This skill pairs with the Avalon board game! To get started, say how many players you are playing with.";
const FALLBACK_MESSAGE = "Sorry, I am not sure what you mean. To get started with this skill, say how many players you are playing with.";
const EXIT_MESSAGE = "Thanks for using the Avalon board game adventure skill!";
const ERROR_MESSAGE = "Something is wrong on my end. Please try again soon, but continue playing your board game!";
const OPENING_ROLE_MESSAGE = "Everyone, close your eyes and extend your hand into a fist in front of you. ";
const CLOSING_ROLE_MESSAGE = "Everyone, put your thumbs down and close your eyes. Everyone, open your eyes. ";

const GOOD = ['merlin', 'percival', 'lancelot'];
const BAD = ['mordred', 'morgana', 'oberon', 'assassin', 'lancelot'];

let NUM_PLAYERS = 0;
let DEFINED_BAD = [];
let DEFINED_GOOD = [];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
  	const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  	let speechOutput = "<audio src='soundbank://soundlibrary/nature/amzn_sfx_wind_strong_gusting_01'/> Welcome to the Avalon Board Game Adventure skill! In order to use this skill, you need the Avalon Board game. Let's get started. ";
  	let reprompt = "To play avalon, you need five or more players. How many players are you playing with today?";

    return handlerInput.responseBuilder
      .speak(speechOutput + reprompt)
      .reprompt(reprompt)
      .getResponse();
  },
};

const HowManyPlayersIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'HowManyPlayersIntent';
  },
  handle(handlerInput) {
  	let speechOutput = "";
  	let reprompt = "What special minions of Mordred characters are you using?";

  	let numPlayers = handlerInput.requestEnvelope.request.intent.slots.numPlayer.value;

  	let numPlayersInt = Number(numPlayers);
  	if (numPlayersInt < 5) {
  		speechOutput = "To play avalon, you need five or more players. "
  		reprompt = "How many players are you playing with today?";
  	} else if (numPlayersInt == 5) {
  		speechOutput = "Great, " + numPlayers 
  		+ " players. You should have " + "2"
  		+ " Minions of Mordred and " + "3"
  		+ " Servants of Arthur. ";
  	} else if (numPlayersInt == 6) {
  		speechOutput = "Great, " + numPlayers
  		+ " players. You should have " + "2"
  		+ " Minions of Mordred and " + "4"
  		+ " Servants of Arthur. ";
  	} else if (numPlayersInt == 7) {
  		speechOutput = "Great, " + numPlayers 
  		+ " players. You should have " + "3"
  		+ " Minions of Mordred and " + "4"
  		+ " Servants of Arthur. ";
  		
  	} else if (numPlayersInt == 8) {
  		speechOutput = "Great, " + numPlayers 
  		+ " players. You should have " + "3"
  		+ " Minions of Mordred and " + "5"
  		+ " Servants of Arthur. ";
  		
  	} else if (numPlayersInt == 9) {
  		speechOutput = "Great, " + numPlayers
  		+ " players. You should have " + "3"
  		+ " Minions of Mordred and " + "6"
  		+ " Servants of Arthur. ";
  		
  	} else if (numPlayersInt == 10) {
  		speechOutput = "Great, " + numPlayers
  		+ " players. You should have " + "4"
  		+ " Minions of Mordred and " + "6"
  		+ " Servants of Arthur. ";
  	} else {
  		speechOutput = "To play avalon, you can have a maximum of 10 players. "
  		reprompt = "How many players are you playing with today?";
  	}

  	NUM_PLAYERS = numPlayersInt;

    return handlerInput.responseBuilder
      .speak(speechOutput + reprompt)
      .reprompt(reprompt)
      .getResponse();
  },
};

const SpecialBadCharacterIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'SpecialBadCharacterIntent';
  },
  handle(handlerInput) {
  	const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    // Determine if the customer has purchased the hint_pack
    return ms.getInSkillProducts(locale).then(function(res) {
      var product = res.inSkillProducts.filter(record => record.referenceName == 'lancelot_character');
      let speechOutput = "Okay, you are playing with ";
  	  let reprompt = " What special servants of arthur characters are you using?";
  	
	  let specialBads = handlerInput.requestEnvelope.request.intent.slots;
	  console.log("THIS IS BAD: " + JSON.stringify(specialBads));

	  if ((specialBads.badCharacterOne != undefined 
	  			&& specialBads.badCharacterOne.value.toLowerCase() == 'lancelot')
	  		|| (specialBads.badCharacterTwo != undefined 
	  			&& specialBads.badCharacterTwo.value.toLowerCase() == 'lancelot')
	  		|| (specialBads.badCharacterThree != undefined 
	  			&& specialBads.badCharacterThree.value.toLowerCase() == 'lancelot')
	  		|| (specialBads.badCharacterFour != undefined 
	  			&& specialBads.badCharacterFour.value.toLowerCase() == 'lancelot')) { 
		  if (isEntitled(product)) {
	        
	      } else {
	        const upsellMessage = "You don't currently own the ability to use Lancelot. Want to learn more about it?";
	                    
	        return handlerInput.responseBuilder
	          .addDirective({
	            'type': 'Connections.SendRequest',
	            'name': 'Upsell',
	            'payload': {
	              'InSkillProduct': {
	                'productId': product[0].productId
	              },
	              'upsellMessage': upsellMessage
	            },
	            'token': 'correlationToken'
	          })
	          .getResponse();
      		}
      	}


		if (specialBads.badCharacterOne != undefined && specialBads.badCharacterOne.value) {
			  if (BAD.includes(specialBads.badCharacterOne.value.toLowerCase())) {
			  	DEFINED_BAD.push(specialBads.badCharacterOne.value.toLowerCase());
			  	speechOutput += specialBads.badCharacterOne.value + " and ";
			  }
		 }
	  	if (specialBads.badCharacterTwo != undefined && specialBads.badCharacterTwo.value) {
		  if (BAD.includes(specialBads.badCharacterTwo.value.toLowerCase())) {
		  	DEFINED_BAD.push(specialBads.badCharacterTwo.value.toLowerCase());
		  	speechOutput += specialBads.badCharacterTwo.value + " and ";
		  }
	  	}
	  	if (specialBads.badCharacterThree != undefined && specialBads.badCharacterThree.value) {
		  if (BAD.includes(specialBads.badCharacterThree.value.toLowerCase())) {
		  	DEFINED_BAD.push(specialBads.badCharacterThree.value.toLowerCase());
		  	speechOutput += specialBads.badCharacterThree.value + " and ";
		  }
	  	}
	  	if (specialBads.badCharacterFour != undefined && specialBads.badCharacterFour.value) {
		  if (BAD.includes(specialBads.badCharacterFour.value.toLowerCase())) {
		  	DEFINED_BAD.push(specialBads.badCharacterFour.value.toLowerCase());
		  	speechOutput += specialBads.badCharacterFour.value + " and ";
		  }
	  	}


		if (DEFINED_BAD.length == 0 || DEFINED_BAD.length == undefined) {
			speechOutput += " no special minions of mordred. ";
		} else if (NUM_PLAYERS < 7 && DEFINED_BAD.length > 2) {
			DEFINED_BAD.length = 2;
		} else if (NUM_PLAYERS < 10 && DEFINED_BAD.length > 3) {
			DEFINED_BAD.length = 3;
		} else if (NUM_PLAYERS == 10 && DEFINED_BAD.length > 4) {
			DEFINED_BAD.length = 4;
		}

	    return handlerInput.responseBuilder
	      .speak(speechOutput + reprompt)
	      .reprompt(reprompt)
	      .getResponse();
    });
  },
};

const SpecialGoodCharacterIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'SpecialGoodCharacterIntent';
  },
  handle(handlerInput) {
	const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    // Determine if the customer has purchased the hint_pack
    return ms.getInSkillProducts(locale).then(function(res) {
      var product = res.inSkillProducts.filter(record => record.referenceName == 'lancelot_character');

	  	let speechOutput = "Okay, you are playing with ";
	  	
	  	let specialGoods = handlerInput.requestEnvelope.request.intent.slots;
	  	console.log("THIS IS GOOD: " + JSON.stringify(specialGoods));




	  if ((specialGoods.goodCharacterOne != undefined 
	  			&& specialGoods.goodCharacterOne.value.toLowerCase() == 'lancelot')
	  		|| (specialGoods.goodCharacterTwo != undefined 
	  			&& specialGoods.goodCharacterTwo.value.toLowerCase() == 'lancelot')
	  		|| (specialGoods.goodCharacterThree != undefined 
	  			&& specialGoods.goodCharacterThree.value.toLowerCase() == 'lancelot')) { 
		  if (isEntitled(product)) {
	        
	      } else {
	        const upsellMessage = "You don't currently own the ability to use Lancelot. Want to learn more about it?";
	                    
	        return handlerInput.responseBuilder
	          .addDirective({
	            'type': 'Connections.SendRequest',
	            'name': 'Upsell',
	            'payload': {
	              'InSkillProduct': {
	                'productId': product[0].productId
	              },
	              'upsellMessage': upsellMessage
	            },
	            'token': 'correlationToken'
	          })
	          .getResponse();
      		}
      	}





	  	if (specialGoods.goodCharacterOne != undefined && specialGoods.goodCharacterOne.value) { 
		  if (GOOD.includes(specialGoods.goodCharacterOne.value.toLowerCase())) {
		  	DEFINED_GOOD.push(specialGoods.goodCharacterOne.value.toLowerCase());
		  	speechOutput += specialGoods.goodCharacterOne.value + " and ";
		  }
	  	}
	  	if (specialGoods.goodCharacterTwo != undefined && specialGoods.goodCharacterTwo.value) { 
		  if (GOOD.includes(specialGoods.goodCharacterTwo.value.toLowerCase())) {
		  	DEFINED_GOOD.push(specialGoods.goodCharacterTwo.value.toLowerCase());
		  	speechOutput += specialGoods.goodCharacterTwo.value + " and ";
		  }
	  	}
	  	if (specialGoods.goodCharacterThree != undefined && specialGoods.goodCharacterThree.value) { 
		  if (GOOD.includes(specialGoods.goodCharacterThree.value.toLowerCase())) {
		  	DEFINED_GOOD.push(specialGoods.goodCharacterThree.value.toLowerCase());
		  	speechOutput += specialGoods.goodCharacterThree.value + " and ";
		  }
	  	}


		if (DEFINED_GOOD.length == 0 || DEFINED_GOOD.length == undefined) {
			speechOutput += " no special servants of arthur. ";
		}

		speechOutput += OPENING_ROLE_MESSAGE + " ";

		console.log("HELLO: " + DEFINED_BAD + " THERE " + DEFINED_GOOD);

		// Lancelot
		if (DEFINED_BAD.includes('lancelot') || DEFINED_GOOD.includes('lancelot')) {
			speechOutput += "Good and bad lancelot, open your eyes and acknowledge each other. Good lancelot close your eyes. ";
		} 

		// Bad guys
		if ((DEFINED_BAD.includes('lancelot') || DEFINED_GOOD.includes('lancelot')) && DEFINED_BAD.includes('oberon')) {
			speechOutput += "Minions of mordred, but not oberon, open your eyes and acknowledge each other. Bad Lancelot, put up your thumb so the minions of mordred can identify you. Minions of Mordred, close your eyes. ";
		} else if (DEFINED_BAD.includes('oberon')) {
			speechOutput += "Minions of mordred, but not oberon, open your eyes and acknowledge each other. Minions of Mordred, close your eyes. ";
		} else if (DEFINED_BAD.includes('lancelot') || DEFINED_GOOD.includes('lancelot')) {
			speechOutput += "Minions of mordred, open your eyes and acknowledge each other. Bad Lancelot, put up your thumb so the minions of mordred can identify you. Minions of Mordred, close your eyes. ";
		} else {
			speechOutput += "Minions of mordred, open your eyes and acknowledge each other. Minions of Mordred, close your eyes. ";
		}

		// if Merlin is included
		if (DEFINED_GOOD.includes('merlin') && DEFINED_BAD.includes('mordred')) {
			speechOutput += "Minions of Mordred, but not Mordred, put up your thumbs so Merlin can know of you. Merlin, open your eyes. Merlin close your eyes and minions of Mordred put your thumbs down. ";
		} else if (DEFINED_GOOD.includes('merlin')) {
			speechOutput += "Minions of Mordred, put up your thumbs so Merlin can know of you. Merlin, open your eyes. Merlin close your eyes and minions of Mordred put your thumbs down. ";
		}

		// if percival is included
		if (DEFINED_GOOD.includes('merlin') && DEFINED_GOOD.includes('percival') && DEFINED_BAD.includes('morgana')) {
			speechOutput += "Merlin and Morgana, put up your thumb. Percival, open your eyes to learn of Merlin and Morgana. Percival, close your eyes and Merlin and Morgana, put your thumb down. ";
		} else if (DEFINED_GOOD.includes('merlin') && DEFINED_GOOD.includes('percival')) {
			speechOutput += "Merlin, put up your thumb. Percival, open your eyes to learn of merlin. Percival, close your eyes and Merlin, put your thumb down. ";
		}

		speechOutput += CLOSING_ROLE_MESSAGE;

	    return handlerInput.responseBuilder
	      .speak(speechOutput)
	      .getResponse();
    });
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_MESSAGE)
      .getResponse();
  },
};

const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_MESSAGE)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(EXIT_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    return handlerInput.responseBuilder
      .speak(ERROR_MESSAGE)
      .reprompt(ERROR_MESSAGE)
      .getResponse();
  },
};


//----------------------------------------------------------------------
//----------------------------ISP HANDLERS------------------------------
//----------------------------------------------------------------------

const BuyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
  },
  handle(handlerInput) {  
    // Inform the user about what products are available for purchase
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    return ms.getInSkillProducts(locale).then(function(res) {
      let product = res.inSkillProducts.filter(record => record.referenceName == "lancelot_character");

      return handlerInput.responseBuilder
        .addDirective({
          'type': 'Connections.SendRequest',
          'name': 'Buy',
          'payload': {
            'InSkillProduct': {
              'productId': product[0].productId
            }
          },
          'token': 'correlationToken'
        })
        .getResponse();
    });
  }
};

const UpsellResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "Connections.Response" &&
        handlerInput.requestEnvelope.request.name === "Upsell";
  },
  handle(handlerInput) {
    if (handlerInput.requestEnvelope.request.status.code == 200) {
      let speechOutput = "";
      let reprompt = "";

      if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'ACCEPTED') {
        speechOutput = "You can now use the Lancelot character in your game! ";
  		reprompt = "To play avalon, you need five or more players. How many players are you playing with today?";
      } else if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'DECLINED') {
        speechOutput = "Okay. I can't offer you the Lancelot character at this time. ";
  		reprompt = "To play avalon, you need five or more players. How many players are you playing with today?";
      }

      return handlerInput.responseBuilder
        .speak(speechOutput + reprompt)
        .reprompt(reprompt)
        .getResponse();
    } else {
      // Something has failed with the connection.
      console.log('Connections.Response indicated failure. error:' + handlerInput.requestEnvelope.request.status.message); 
      return handlerInput.responseBuilder
        .speak("There was an error handling your purchase request. Please try again or contact us for help.")
        .getResponse();
    }
  }
};

const BuyResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "Connections.Response" &&
        handlerInput.requestEnvelope.request.name === "Buy";
  },
  handle(handlerInput) {
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const productId = handlerInput.requestEnvelope.request.payload.productId;

    return ms.getInSkillProducts(locale).then(function(res) {
      let product = res.inSkillProducts.filter(record => record.productId == productId);
      let speechOutput = "";
      let reprompt = "";

      if (handlerInput.requestEnvelope.request.status.code == 200) {
        if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'ACCEPTED') {
          speechOutput = "You can now use the Lancelot character in your game! ";
  		  reprompt = "To play avalon, you need five or more players. How many players are you playing with today?";
        } else if (handlerInput.requestEnvelope.request.payload.purchaseResult == 'DECLINED') {
          speechOutput = "Thanks for your interest in the " + product[0].name + ". ";
  		  reprompt = "To play avalon, you need five or more players. How many players are you playing with today?";
        }

        return handlerInput.responseBuilder
          .speak(speechOutput + reprompt)
          .reprompt(reprompt)
          .getResponse();
      } else {
        // Something has failed with the connection.
        console.log('Connections.Response indicated failure. error:' + handlerInput.requestEnvelope.request.status.message);
        return handlerInput.responseBuilder
          .speak("There was an error handling your purchase request. Please try again or contact us for help.")
          .getResponse();
      }
    });
  }
};

function isProduct(product) {
  return product && product.length > 0;
}

function isEntitled(product) {
  return isProduct(product) && product[0].entitled == 'ENTITLED';
}




const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
  	LaunchRequestHandler,
  	HowManyPlayersIntentHandler,
  	SpecialBadCharacterIntentHandler,
  	SpecialGoodCharacterIntentHandler,
  	BuyIntentHandler,
  	BuyResponseHandler,
  	UpsellResponseHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();


