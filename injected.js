window.webpage2webm = Object.create(null);

['start', 'pause', 'resume', 'stop'].forEach(m => {
  window.webpage2webm[m] = filename => {
    const msg = {
      'method': m,
    }

    if (typeof filename === 'string' && m === 'start') {
      msg.filename = filename
    }

    window.postMessage(msg, '*');
  }
})