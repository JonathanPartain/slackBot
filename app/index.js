const {
    RtmClient,
    RTM_EVENTS,
    CLIENT_EVENTS
} = require('slack-client')

function start () {
    rtmClient.start()
}

module.exports = start

// Create a new RTM Client
const rtmClient = new RtmClient(process.env.SLACK_BOT_TOKEN)

// Listen on authenticate event
rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
})

// Wait until client is connected
rtmClient.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
    // We are connected!
    console.log('Connected');
})

let list = []

// This is where the magic happens
rtmClient.on(RTM_EVENTS.MESSAGE, (message) => {
    const { channel, text } = message
    // rtmClient.sendMessage(text, channel)
    console.log(message)

    // clean the message

    // extract the text part
    let messageDirty = message.text;
    // make all lowercase
    let messageClean = messageDirty.toLowerCase();



    if (messageClean.substring(0, 3) === 'add') {
        // from after 'add' to end of string
        let msgObj = {
            user: message.user,
            text: messageClean.substring(4)
        };
        list.push(msgObj)
        rtmClient.sendMessage('"' +messageClean.substring(4) + '"' + ' added to list!', 'C5E58C28J')
    }

    if (messageClean.substring(0,1) === '+') {
      // same thing as "add" but with the + sign
      let msgObj = {
          user: message.user,
          text: messageClean.substring(2)
      };
      list.push(msgObj)
      rtmClient.sendMessage('"' +messageClean.substring(2) + '"' + ' added to list!', 'C5E58C28J')

    }


    if (messageClean === 'show list') {
        let count = 0;
        for (var i = 0; i < list.length; i++) {

            if (list[i].user === message.user) {
                count ++;
            }
        }

        if (count > 0) {
            var listText = '';
            for (var i = 0; i < list.length; i++) {
                if (list[i].user === message.user) {
                    listText += list[i].text + '\n'
                }


            }
            rtmClient.sendMessage(listText, 'C5E58C28J')
        }
        else {
            rtmClient.sendMessage('List is empty, try adding something first!', 'C5E58C28J')
        }

    }

    if (messageClean === 'clear list') {
        for (var i = 0; i < list.length; i++) {
            if (list[i].user === message.user) {
                list.splice(i, 1)
                i--;
            }
        }
        rtmClient.sendMessage('List cleared!', 'C5E58C28J')

    }

    if (messageClean === 'help') {
        rtmClient.sendMessage(
            'Im your personal todo-list bot! Keep everything organized with me!\nList of commmands: ```\n * add <item to add> \n * + <item to add> \n * show list \n * clear list \n * help ```', 'C5E58C28J')
    }

})
