"use strict";

function playRecord(record) {
  if (record) {
    record.querySelectorAll("ul.tracklisting")[0].children[0].getElementsByTagName("a")[0].click();
  };
}

function isPlaying(record) {
  return (record.querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing").length > 0);
}

function stop() {
  let currentTrack = records[currentRecordIdx].querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing")

  if (currentTrack.length > 0) {
    currentTrack[0].getElementsByTagName("a")[0].click();
  }

  clearInterval(runningId);
}

let runningId = -1;
let currentRecordIdx = -1;
let records = []

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

browser.runtime.onMessage.addListener(menu => {
  if      (menu.command === "run")   { run();	  }
  else if (menu.command === "stop")  { stop();  }
  else if (menu.command === "pause") { pause(); }
  else if (menu.command === "reset") { reset(); }
});

