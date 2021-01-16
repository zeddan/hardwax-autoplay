"use strict";

function onError(error) {
  alert(error);
  console.error(`Error: ${error}`);
}

function sendCommand(tabs, command) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {command: command}
    ).catch(onError);
  }
}

function addCommandListener(command) {
  document.getElementById(command).addEventListener("click", (e) => {
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then((tabs) => sendCommand(tabs, command)).catch(onError);
  });
}

addCommandListener("run");
addCommandListener("stop");
addCommandListener("pause");
addCommandListener("resume");

