
window.onload = () => {
  document.title = 'puppetcam';
  const injectedScript = document.createElement('script');
  injectedScript.src = chrome.extension.getURL('injected.js');
  (document.head || document.documentElement).appendChild(injectedScript);
}

const port = chrome.runtime.connect(chrome.runtime.id)

port.onMessage.addListener(msg => {
  if (({}).toString.call(msg) === '[object Object]' && msg.downloadState === 'complete') {
    document.querySelector('html').classList.add('downloadComplete')
  }
})

window.addEventListener("message", function(event) {
  if(Object.keys(event.data).length === 0) return;

  if (event.data.method) {
    if (['start', 'pause', 'resume', 'stop'].includes(event.data.method)) {
      port.postMessage(event.data)
    }
  }
}, false);