(function() {
  "use strict";

  let records = [];
  let currentRecordIdx = -1;
  let currentUrl = undefined;
  let loopId = undefined;
  let state = "stopped";

  function run() {
    currentRecordIdx = 0;
    records = document.querySelectorAll('*[id^="record"]');
    if (isPlaying(records[currentRecordIdx])) { return; }
    addClickListeners(records);
    state = "running"
    playFirstTrackOfRecord(records[currentRecordIdx]);
    runLoop();
  }

  function stop() {
    state = "stopped"
    stopLoop();
    document.querySelector("a.playing")?.click()
  }

  function pause() {
    state = "paused"
    document.querySelector("a.playing")?.click()
  }

  function resume() {
    state = "running"
    document.querySelector(`[href='${currentUrl}']`)?.click();
  }

  function addClickListeners(records) {
    let tracks = document.querySelectorAll(".download_listen");
    for (let track of tracks) {
      track.addEventListener("click", function() {
        if (track.href === currentUrl && state != "running") {
          stopLoop();
          if (state != "paused") {
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
    if (loopId) { return; }
    loopId = setInterval(() => {
      if (currentRecordIdx < records.length) {
        if (!isPlaying(records[currentRecordIdx])) {
          currentRecordIdx += 1;
          playFirstTrackOfRecord(records[currentRecordIdx]);
        };
      } else {
        stopLoop();
      };
    }, 5000);
  }

  function stopLoop() {
    clearInterval(loopId);
    loopId = undefined;
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
})();
