'use strict';

import SendModuleAndroid from './SendModuleAndroid';
import Module from './test';
import _ from 'lodash';

var React = require('react-native');
var {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  DeviceEventEmitter,
} = React;

var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');

var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}


var Messenger = React.createClass({

	componentWillMount() {
    var messenger = this;
		DeviceEventEmitter.addListener('message', function(e: Event) {
			var content = e['content'];
			messenger.handleSerial(content);
		});

    this.setState({
      uniqueId: _.uniqueId()
    })
	},

  handleSerial(data) {
    // var bytes = [];
    //
    // for (var i = 0; i < 2; ++i) {
    //     bytes.push(data.charCodeAt(i));
    // }
    //
    // var dest = bytes[0];
    // var from = bytes[1];

    this.handleReceive({
                 text: data.slice(1)/*.replace(/[^A-Za-z0-9]/g, '')*/,
                 name: 'Anonymous' + this.state.uniqueId,
                 image: {uri: 'http://i.imgur.com/ut1lOix.png'},
                 position: 'left', date: new Date()
                });
  },

  getMessages() {
    return [
      {text: 'Welcome to xBAND global chat', name: 'Bot', image: {uri: 'http://i.imgur.com/ut1lOix.png'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)},
    ];
  },

  handleSend(message = {}, rowID = null) {
    // Your logic here
    // Send message.text to your server
	  //
    // console.warn(message.name)
	  SendModuleAndroid.send("{"+message.text+"}");
    // libtest.test();

    // this._GiftedMessenger.setMessageStatus('Sent', rowID);
    // this._GiftedMessenger.setMessageStatus('Seen', rowID);
    // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
    if (this.isMounted()) {
      this._GiftedMessenger.setMessageStatus('Sent', rowID); // => In this case, you need also to set onErrorButtonPress
    }
  },

  // @oldestMessage is the oldest message already added to the list
  onLoadEarlierMessages(oldestMessage = {}, callback = () => {}) {

    // Your logic here
    // Eg: Retrieve old messages from your server

    // newest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'Project xBand to the Moon!',
        name: 'Project xBand Team',
        image: {uri: 'http://i.imgur.com/ut1lOix.png'},
        position: 'left',
        date: new Date(2014, 0, 1, 20, 0),
      }, {
        text: 'How far do you plan on taking this project?',
        name: 'Curious investor',
        image: null,
        position: 'right',
        date: new Date(2014, 0, 1, 12, 0),
      },
    ];

    setTimeout(() => {
      callback(earlierMessages, false); // when second parameter is true, the "Load earlier messages" button will be hidden
    }, 1000);
  },

  handleReceive(message = {}) {
    if (this.isMounted()) {
      this._GiftedMessenger.appendMessage(message);
    }
  },

  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server

  },

  // will be triggered when the Image of a row is touched
  onImagePress(rowData = {}, rowID = null) {
    // Your logic here
    // Eg: Navigate to the user profile
  },

  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}

        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}

        autoFocus={false}
        messages={this.getMessages()}
        handleSend={this.handleSend.bind(this)}
        onErrorButtonPress={this.onErrorButtonPress.bind(this)}
        maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}
        loadEarlierMessagesButton={true}
        onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

        senderName='1'
        senderImage={null}
        onImagePress={this.onImagePress.bind(this)}
        displayNames={true}

        parseText={true} // enable handlePhonePress and handleUrlPress
        handlePhonePress={this.handlePhonePress.bind(this)}
        handleUrlPress={this.handleUrlPress.bind(this)}
        handleEmailPress={this.handleEmailPress.bind(this)}

        inverted={true}
      />

    );
  },

  handleUrlPress(url) {
    if (Platform.OS !== 'android') {
      LinkingIOS.openURL(url);
    }
  },

  handlePhonePress(phone) {
    if (Platform.OS !== 'android') {
      var BUTTONS = [
        'Text message',
        'Call',
        'Cancel',
      ];
      var CANCEL_INDEX = 2;

      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
        }
      });
    }
  },

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  },
});

module.exports = Messenger;
