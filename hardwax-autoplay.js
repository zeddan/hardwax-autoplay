"use strict";

let records = [];
let currentRecordIdx = -1;
let currentUrl = undefined;
let runningId = undefined;
let paused = false;

function run() {
  currentRecordIdx = 0;
  records = document.querySelectorAll('*[id^="record"]');

  addClickListeners(records);
  playRecord(records[currentRecordIdx]);
  runLoop();
}

function stop() {
  let currentTrack = records[currentRecordIdx].querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing");

  if (currentTrack.length > 0) {
    currentTrack[0].getElementsByTagName("a")[0].click();
  }
  
  stopLoop();
  currentUrl = undefined;
}

function pause() {
  if (!currentUrl) { return; }
  paused = true;
  document.querySelector(`[href='${currentUrl}']`).click();
  clearInterval(runningId);
  runningId = undefined;
}

function resume() {
  if (!currentUrl) { return; }
  document.querySelector(`[href='${currentUrl}']`).click();
}


function addClickListeners(records) {
  let tracks = document.querySelectorAll(".download_listen");
  for (let track of tracks) {
    track.addEventListener("click", function() {
      if (track.href === currentUrl) {
        stopLoop();
        if (!paused) {
          currentUrl = undefined;
        }
      } else {
        currentUrl = track.href;
        currentRecordIdx = Array.from(records).indexOf(getRecordByTrack(track));
        runLoop();
      }
    });
  }
}

function runLoop() {
  if (runningId) { return; }
  paused = false;
  let retries = 0;
  runningId = setInterval(() => {
    if (currentRecordIdx < records.length || retries > 5) {
      if (!isPlaying(records[currentRecordIdx])) {
        currentRecordIdx += 1;
        retries += 1;
        playRecord(records[currentRecordIdx]);
      };
    } else {
      stopLoop();
    };
  }, 5000);
}

function stopLoop() {
  clearInterval(runningId);
  runningId = undefined;
}

function playRecord(record) {
  if (record) {
    record.querySelectorAll("ul.tracklisting")[0].children[0].getElementsByTagName("a")[0].click();
  };
}

function isPlaying(record) {
  return (record.querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing").length > 0);
}

function getRecordByTrack(child) {
  let parentElement = child.parentElement;
  while (parentElement.id !== "content") {
    if (parentElement.id.startsWith("record")) {
      return parentElement;
    } else {
      parentElement = parentElement.parentElement;
    }
  }
}

browser.runtime.onMessage.addListener(menu => {
  if      (menu.command === "run")    { run();    }
  else if (menu.command === "stop")   { stop();   }
  else if (menu.command === "pause")  { pause();  }
  else if (menu.command === "resume") { resume(); }
});

