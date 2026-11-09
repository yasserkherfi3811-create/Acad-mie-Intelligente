// Android/iOS (Capacitor) : remplace l'enregistrement de fichiers (PDF/CSV) par "écrire dans le cache + feuille de partage".
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  function toB64(data) {
    return new Promise(function (res, rej) {
      var blob = data instanceof Blob ? data : new Blob([data], { type: 'text/plain' });
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1]); };
      r.onerror = rej;
      r.readAsDataURL(blob);
    });
  }
  var downloads = {
    save: async function (o) {
      var P = C.Plugins, b64 = await toB64(o.data);
      var f = await P.Filesystem.writeFile({ path: o.filename, data: b64, directory: 'CACHE' });
      try { await P.Share.share({ title: o.filename, url: f.uri, dialogTitle: o.filename }); }
      catch (e) { throw { code: 'declined' }; }
      return { status: 'saved' };
    }
  };
  window.claude = { use: function (n) { return Promise.resolve(n === 'downloads' ? downloads : null); } };
})();
