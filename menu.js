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

document.getElementById("run").addEventListener("click", (e) => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then((tabs) => sendCommand(tabs, "run")).catch(onError);
});

document.getElementById("stop").addEventListener("click", (e) => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then((tabs) => sendCommand(tabs, "stop")).catch(onError);
});

document.getElementById("pause").addEventListener("click", (e) => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then((tabs) => sendCommand(tabs, "pause")).catch(onError);
});

document.getElementById("resume").addEventListener("click", (e) => {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then((tabs) => sendCommand(tabs, "resume")).catch(onError);
});

