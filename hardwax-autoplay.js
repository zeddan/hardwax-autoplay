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
  playFirstTrackOfRecord(records[currentRecordIdx]);
  runLoop();
}

function stop() {
  if (!currentUrl) { return; }
  document.querySelector(`[href='${currentUrl}']`).click();
  stopLoop();
  currentUrl = undefined;
}

function pause() {
  if (!currentUrl) { return; }
  paused = true;
  document.querySelector(`[href='${currentUrl}']`).click();
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
        currentRecordIdx = getRecordIdx(track);
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
        playFirstTrackOfRecord(records[currentRecordIdx]);
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

function playFirstTrackOfRecord(record) {
  if (record) {
    record.querySelectorAll("ul.tracklisting a")[0].click()
  };
}

function isPlaying(record) {
  return !!record.querySelector("ul.tracklisting li.playing");
}

function getRecordIdx(track) {
  return Array.from(records).indexOf(getRecordByTrack(track));
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

