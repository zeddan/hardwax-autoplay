playRecord = (record) => {
  if (record) {
    record.querySelectorAll("ul.tracklisting")[0].children[0].getElementsByTagName("a")[0].click();
  };
};

isPlaying = (record) => {
  return (record.querySelectorAll("ul.tracklisting")[0].querySelectorAll("li.playing").length > 0);
};

stopPlaying = (interval) => {
  clearInterval(interval);
};

let currentRecordIdx = 0;
let records = document.querySelectorAll('*[id^="record"]');
playRecord(records[currentRecordIdx]);

let counter = 0;

let i = setInterval(() => {
  if (currentRecordIdx < records.length || counter > 5) {
    if (!isPlaying(records[currentRecordIdx])) {
      currentRecordIdx += 1;
      counter += 1;
      playRecord(records[currentRecordIdx]);
    };
  } else {
    console.log("slut");
    clearInterval(i);
  };
}, 5000);

