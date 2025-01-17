"use strict"

// Background page
// https://developer.chrome.com/extensions/event_pages

// Our background page isn't persistent.
chrome.runtime.onStartup.addListener(()=> { init(); });
// onInstalled when user uses chrome://extensions page to reload
chrome.runtime.onInstalled.addListener(() => { init(); });

let portNMH = null;

function nmhSend(oMsg) {
/*
When a messaging port is created using runtime.connectNative Chrome starts native messaging host process and keeps it running until the port 
is destroyed. On the other hand, when a message is sent using runtime.sendNativeMessage, without creating a messaging port, Chrome starts a 
new native messaging host process for each message. In that case the first message generated by the host process is handled as a response to 
the original request, i.e. Chrome will pass it to the response callback specified when runtime.sendNativeMessage is called. All other messages 
generated by the native messaging host in that case are ignored.
*/
  console.log('About to send ' + JSON.stringify(oMsg));
  if (!portNMH) {
    console.log('Port not listening'); return; 
  }
  try {
    portNMH.postMessage( oMsg );
  } catch (e) {
    console.log('! postMessage failed! ' + e.message);
  }
}

function init()
{
  // Spin up the NativeMessaging listener
  console.log('init(): Attempting to attach NativeMessaging Host!');
  try {
    portNMH = chrome.runtime.connectNative('com.bayden.nmf.demo');
    portNMH.onDisconnect.addListener( () => {
      console.log("!!!NativeMessagingHost.onDisconnect(); " + chrome.runtime.lastError.message);
    });
    portNMH.onMessage.addListener( (msg) => {
      console.log("@@@ Got Message from NMH: ");
      console.dir(msg);
    });
  }
  catch (e) {
    console.log('!!!Failed to connect to nativeMessagingHost! ' + e.message + " " + chrome.runtime.lastError.message);
  }
  console.log('init(): completed');
}

chrome.webNavigation.onBeforeNavigate.addListener(function (data) {
  const oEvent = {
    'event': 'navigation',
    'destination': data.url,
    'tabId': data.tabId,
    'frameId': data.frameId
  };
  nmhSend(oEvent);
});

chrome.browserAction.onClicked.addListener (
  (t)=>{
    chrome.tabs.create({ url: "/monitor.html" });
  }
)
