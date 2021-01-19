let records = [];
let currentRecordIdx = -1;
let currentUrl;
let runningId;
let pausing = false;
let resuming = false;
let started = false;

function playFirstTrackOfRecord(record) {
  if (record) {
    record.querySelectorAll('ul.tracklisting a')[0].click();
  }
}

function isPlaying(record) {
  return !!record.querySelector('ul.tracklisting li.playing');
}

function stopLoop() {
  clearInterval(runningId);
  runningId = undefined;
}

function runLoop() {
  if (runningId) { return; }
  pausing = false;
  resuming = false;
  let retries = 0;
  runningId = setInterval(() => {
    if (currentRecordIdx < records.length || retries > 5) {
      if (!isPlaying(records[currentRecordIdx])) {
        currentRecordIdx += 1;
        retries += 1;
        playFirstTrackOfRecord(records[currentRecordIdx]);
      }
    } else {
      stopLoop();
    }
  }, 5000);
}

function getRecordByTrack(child) {
  let { parentElement } = child;
  while (parentElement.id !== 'content') {
    if (parentElement.id.startsWith('record')) {
      return parentElement;
    }
    parentElement = parentElement.parentElement;
  }
  return undefined;
}

function getRecordIdx(track) {
  return Array.from(records).indexOf(getRecordByTrack(track));
}

function setCurrentUrl(url) {
  currentUrl = url;
}

function setCurrentRecordIdx(idx) {
  currentRecordIdx = idx;
}

function getCurrentUrl() {
  return currentUrl;
}

function isResuming() {
  return resuming;
}

function isPausing() {
  return pausing;
}

function addClickListeners() {
  const tracks = document.querySelectorAll('.download_listen');
  for (let i = 0; i < tracks.length; i += 1) {
    tracks[i].addEventListener('click', () => {
      if (tracks[i].href === getCurrentUrl() && !isResuming()) {
        stopLoop();
        if (!isPausing()) {
          setCurrentUrl(undefined);
        }
      } else {
        setCurrentUrl(tracks[i].href);
        setCurrentRecordIdx(getRecordIdx(tracks[i]));
        runLoop();
      }
    });
  }
}

function run() {
  currentRecordIdx = 0;
  records = document.querySelectorAll('*[id^="record"]');
  if (isPlaying(records[currentRecordIdx])) { return; }
  if (!started) {
    addClickListeners();
    started = true;
  }
  playFirstTrackOfRecord(records[currentRecordIdx]);
  runLoop();
}

function stop() {
  if (!currentUrl) { return; }
  if (pausing) { currentUrl = undefined; return; }
  document.querySelector(`[href='${currentUrl}']`).click();
}

function pause() {
  if (!currentUrl) { return; }
  pausing = true;
  document.querySelector(`[href='${currentUrl}']`).click();
}

function resume() {
  if (!currentUrl) { return; }
  if (isPlaying(records[currentRecordIdx])) { return; }
  resuming = true;
  document.querySelector(`[href='${currentUrl}']`).click();
}

// eslint-disable-next-line no-undef
browser.runtime.onMessage.addListener((menu) => {
  if (menu.command === 'run') {
    run();
  } else if (menu.command === 'stop') {
    stop();
  } else if (menu.command === 'pause') {
    pause();
  } else if (menu.command === 'resume') {
    resume();
  }
});
