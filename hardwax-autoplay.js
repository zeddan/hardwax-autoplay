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
    if (!currentUrl || state != "running") {
      return;
    }
    state = "stopped"
    document.querySelector(`[href='${currentUrl}']`).click();
  }

  function pause() {
    if (!currentUrl || state != "running") {
      return;
    }
    state = "paused"
    document.querySelector(`[href='${currentUrl}']`).click();
  }

  function resume() {
    if (!currentUrl || state != "paused") {
      return;
    }
    state = "running"
    document.querySelector(`[href='${currentUrl}']`).click();
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
    let retries = 0;
    loopId = setInterval(() => {
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
