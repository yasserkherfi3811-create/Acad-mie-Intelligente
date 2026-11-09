// Prépare le dossier www/ : remplace les CDN par des fichiers locaux (fonctionnement 100 % hors ligne).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const root = path.join(__dirname, '..'), www = path.join(root, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

execSync('npx tailwindcss -i src/input.css -o www/tailwind.css --minify', { cwd: root, stdio: 'inherit' });

let html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
function swap(re, to) {
  if (!re.test(html)) { console.error('Motif introuvable :', re); process.exit(1); }
  html = html.replace(re, to);
}
swap(/<script src="https:\/\/cdn\.tailwindcss\.com[^"]*"><\/script>/, '<link rel="stylesheet" href="tailwind.css">');
swap(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/html2pdf[^"]*"><\/script>/, '<script src="html2pdf.bundle.min.js"></script>');
swap(/@import url\('https:\/\/fonts\.googleapis\.com[^']*'\);\s*/, '');
swap(/<\/head>/, '<script src="native-shim.js"></script>\n</head>');

fs.copyFileSync(path.join(root, 'node_modules/html2pdf.js/dist/html2pdf.bundle.min.js'), path.join(www, 'html2pdf.bundle.min.js'));
fs.copyFileSync(path.join(__dirname, 'native-shim.js'), path.join(www, 'native-shim.js'));
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('www/ prêt');
