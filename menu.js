"use strict";

let globalState = "stopped"

function onError(error) {
  alert(error);
  console.error(`Error: ${error}`);
}

function sendCommand(tabs, command, state) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {
        command: command,
        state: state
      }
    ).catch(onError);
  }
}

function addCommandListener(command, state) {
  document.getElementById(command).addEventListener("click", (e) => {
    browser.tabs.query({
      currentWindow: true,
      active: true
    }).then((tabs) => {
      globalState = state;
      setStatus(globalState);
      sendCommand(tabs, command, state);
    }).catch(onError);
  });
}

function setStatus(state) {
  document.getElementById("status").innerText = state;
}

addCommandListener("run", "running");
addCommandListener("stop", "stopped");
addCommandListener("pause", "paused");
addCommandListener("resume", "running");
setStatus(globalState)
