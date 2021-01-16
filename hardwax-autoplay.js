"use strict";

let runningId = -1;
let currentRecordIdx = -1;
let records = [];
let currentUrl = undefined;

function run() {
  currentRecordIdx = 0
  records = document.querySelectorAll('*[id^="record"]');
  let retries = 0;

  playRecord(records[currentRecordIdx]);

  runningId = setInterval(() => {
    if (currentRecordIdx < records.length || retries > 5) {
      if (!isPlaying(records[currentRecordIdx])) {
        currentRecordIdx += 1;
        retries += 1;
        playRecord(records[currentRecordIdx]);
      };
    } else {
      clearInterval(runningId);
    };
  }, 5000);
}

function stop() {
  let currentTrack = records[currentRecordIdx].querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing");

  if (currentTrack.length > 0) {
    currentTrack[0].getElementsByTagName("a")[0].click();
  }

  clearInterval(runningId);
}

function pause() {
  let currentTrack = records[currentRecordIdx].querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing");

  if (currentTrack.length > 0) {
    currentUrl = currentTrack[0].children[0].href;
  }

  stop();
}

function resume() {
  records[currentRecordIdx].querySelectorAll(`[href='${currentUrl}']`)[0].click();
}

function playRecord(record) {
  if (record) {
    record.querySelectorAll("ul.tracklisting")[0].children[0].getElementsByTagName("a")[0].click();
  };
}

function isPlaying(record) {
  return (record.querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing").length > 0);
}

browser.runtime.onMessage.addListener(menu => {
  if      (menu.command === "run")    { run();    }
  else if (menu.command === "stop")   { stop();   }
  else if (menu.command === "pause")  { pause();  }
  else if (menu.command === "resume") { resume(); }
});

