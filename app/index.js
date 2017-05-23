const {
    RtmClient,
    RTM_EVENTS,
    CLIENT_EVENTS
} = require('slack-client');

function start () {
    rtmClient.start();
}

module.exports = start;

// Create a new RTM Client
const rtmClient = new RtmClient(process.env.SLACK_BOT_TOKEN);

// Listen on authenticate event
rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// Wait until client is connected
rtmClient.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    // We are connected!
    console.log('Connected');
})

let list = []
// REAL channel is C5E58C28J
// This is where the magic happens
rtmClient.on(RTM_EVENTS.MESSAGE, (message) => {
    const { channel, text } = message;
    // rtmClient.sendMessage(text, channel)
    console.log(message);

    // clean the message

    // extract the text part
    let messageDirty = message.text;
    // make all lowercase
    let messageClean = messageDirty.toLowerCase();



    if (messageClean.substring(0, 3) === 'add' && messageClean.length > 4) {
        // from after 'add' to end of string
        // create message object
        let msgObj = {
            user: message.user,
            text: messageClean.substring(4)
        };
        // push object to list
        list.push(msgObj)
        rtmClient.sendMessage('"' +messageClean.substring(4) + '"' + ' added to list!', 'C5EUSKTDL')
    }

    if (messageClean.substring(0,1) === '+') {
      // same thing as "add" but with the + sign
      let msgObj = {
          user: message.user,
          text: messageClean.substring(2)
      };
      list.push(msgObj);
      rtmClient.sendMessage('"' +messageClean.substring(2) + '"' + ' added to list!', 'C5EUSKTDL');

    }

// function to show the list for "user"
// primitive? Yeah. Works? Yeah.
    function showList(user) {
      let count = 0;
      let index = 1;
      // check if the user has stuff in the list
      for (var i = 0; i < list.length; i++) {
        if (list[i].user === user) {
          count++;
        }

      }
      // if the user has stuff in the list, show it
      if (count > 0) {
          let index = 1;
          // text to be printed as a list
          var listText = '';
          for (var i = 0; i < list.length; i++) {
              if (list[i].user === user) {
                  // add index number and a colon to make it fancaaay
                  listText += index + ': ' + list[i].text + '\n'
                  index++;
              }

          }
          rtmClient.sendMessage(listText, 'C5EUSKTDL');
      }
      else {
          rtmClient.sendMessage('List is empty, try adding something first!', 'C5EUSKTDL');
      }


    }

    // do I really need to explain?
    if (messageClean === 'show list') {
        showList(message.user);

    }

    // remove item from list, using fake indexes
    if (messageClean.substring(0,6) === 'remove' && messageClean.length > 7) {
        let toRemove = Number(messageClean.substring(7));

        let count = 0

        for (var i = 0; i < list.length; i++) {
          // only do stuff for this user
          if (list[i].user === message.user) {
            // check if "index" aka count + 1 is the same as the one to remove
            if (Number(count + 1) === toRemove) {

              // "remove" item, or just make it not show up
              // screw memory!
              list[i].user = "";
              rtmClient.sendMessage('Item removed!', 'C5EUSKTDL');
              // escape for loop
              break;
            }

            count++;

          }


        }



    }

    // clear the list for each user
    if (messageClean === 'clear list') {
        for (var i = 0; i < list.length; i++) {
            if (list[i].user === message.user) {
                list.splice(i, 1);
                i--;
            }
        }
        rtmClient.sendMessage('List cleared!', 'C5EUSKTDL');

    }

    // HELP! I need somebody
    // HELP! Not just anybody, but from MEEEE!
    if (messageClean === 'help') {
        rtmClient.sendMessage(
            'Im your personal todo-list bot! Keep everything organized with me!\nList of commmands: ```\n * add <item to add> \n * + <item to add> \n * remove <index> \n * show list \n * clear list \n * help ```', 'C5EUSKTDL')
    }

})
