const cv = require('opencv4nodejs');

async function detectAndTrackPlayers(videoFilename) {
  const cap = new cv.VideoCapture(videoFilename);
  const frameRate = cap.get(cv.CAP_PROP_FPS);
  const playerTracker = new cv.MultiTracker();

  while (true) {
    const frame = cap.read();
    if (frame.empty) break;

    const players = await detectPlayers(frame);
    playerTracker.update(frame, players);

    cv.imshow('Player Tracking', frame);
    cv.waitKey(1000 / frameRate);
  }
}

async function detectPlayers(frame) {
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

  const grayFrame = frame.bgrToGray();
  const { objects } = await classifier.detectMultiScaleAsync(grayFrame);

  const players = objects.map(([x, y, w, h]) => new cv.Rect(x, y, w, h));
  return players;
}

module.exports = detectAndTrackPlayers;