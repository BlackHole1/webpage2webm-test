let recorder = null;
let filename = null;

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.method) {
      case 'stop':
        recorder.stop();
        break;
      case 'pause':
        recorder.pause();
        break;
      case 'resume': 
        recorder.resume();
        break;
      case 'start':
        if(recorder){
          return;
        }
        
        if (!msg.filename) {
          return;
        }

        filename = msg.filename;

        chrome.desktopCapture.chooseDesktopMedia(['tab', 'audio'], streamId => {
          navigator.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
                maxWidth: 1920,
                minWidth: 1920,
                maxHeight: 1080,
                minHeight: 1080
              }
            }
          }, stream => {
            let chunks=[];
            recorder = new MediaRecorder(stream, {
                videoBitsPerSecond: 2500000,
                ignoreMutedMedia: true,
                mimeType: 'video/webm'
            });

            recorder.ondataavailable = function (event) {
              if (event.data.size > 0) {
                chunks.push(event.data);
              }
            };

            recorder.onstop = function () {
              let superBuffer = new Blob(chunks, {
                  type: 'video/webm'
              });

              chrome.downloads.download({
                url: URL.createObjectURL(superBuffer),
                filename: `${filename}.webm`
              });
            }

            recorder.start();
          }, error => console.error(error))
        })
        break;
      default:
        break;
    }
  })

  chrome.downloads.onChanged.addListener(function(delta) {
    if (!delta.state) return;

    port.postMessage({downloadState: delta.state.current});
  });
})
