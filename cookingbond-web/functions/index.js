// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('messages/{conversationId}/{messageId}')
    .onWrite(event => {
        // If message already exists, exit the function
        if (event.data.previous.exists()) {
            return;
        }

        const conversationId = event.params.conversationId;
        const messageId = event.params.messageId;
        const message = event.data.val();
        const sendFrom = message.from;
        const sendTo = message.to;

        if (sendFrom == sendTo) {
            return;
        }

        // Get the list of device notification tokens
        const getDeviceTokenPromise = admin.database().ref(`users/${sendTo}/notificationTokens`).once('value');
        // Get the sender profile
        const getSenderProfilePromise = admin.auth().getUser(sendFrom);
        // Get the sender name from database
        const getSenderNamePromise = admin.database().ref(`users/${sendFrom}/name`).once('value');

        return Promise.all([getDeviceTokenPromise, getSenderProfilePromise, getSenderNamePromise]).then(results => {
            const tokenSnapshot = results[0];
            const sender = results[1];
            const name = results[2].val();

            if (!tokenSnapshot.hasChildren()) {
                return console.log('There are no notification tokens to send to!');
            }

            console.log('There are ', tokenSnapshot.numChildren(), 'tokens to send notifications to.');
            console.log('Fetched sender profile', sender);
            console.log('The sender name', name)

            // Notification detials.
            const payload = {
                notification: {
                    title: name,
                    body: message.message
                }
            };

            // Get all tokens
            const tokens = Object.keys(tokenSnapshot.val());

            // Send notifications to all tokens
            return admin.messaging().sendToDevice(tokens, payload).then(response => {
                // For each message check if there was an error
                const tokensToRemove = [];
                response.results.forEach((result, index) => {
                    const error = result.error;
                    if (error) {
                        console.log('Failure sending notification to ', tokens[index], error);
                        if (error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered') {
                            tokensToRemove.push(tokenSnapshot.ref.child(tokens[index]).remove());
                        }
                    }
                });
                return Promise.all(tokensToRemove);
            });
        });
    });