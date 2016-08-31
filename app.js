const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io').listen(httpServer);

var pins;

var messages = {
  cmd: ['Commande stoppée', 'Commande lancée'],
  close: ['Porte non fermée', 'Porte fermée'],
  open: ['Porte non ouverte', 'Porte ouverte'],
  sec1: ['Cellules int. libre', 'Détection cellules int.'],
  sec2: ['Cellules ext. libre', 'Détection cellules ext.'],
  sec3: ['Tranche palpeuse libre', 'Détection tranche palpeuse'],
  btn: ['Enclenchement bouton d\'arrêt', 'Remise ne route de la porte'],
  pwr: ['Coupure de courant', 'Alimentation OK']
};

io.on('connection', (socket) => {
  const log = (message) => {
    console.log(message);
    socket.emit('log', message);
  }
  socket.on('init', (data) => {
    pins = data;
    log('Initialisation');
  });

  socket.on('simulator', (datas) => {
    if (datas.val != pins[datas.pin]) {
      pins[datas.pin] = datas.val;
      log('[' + datas.pin + ':' + datas.val + '] ' + messages[datas.pin][datas.val]);
      io.sockets.emit(datas.pin, datas.val);
    }
  });
});

app.use(express.static(__dirname + '/public.src'));

httpServer.listen(3000, () => {
  console.log('Listening port 3000');
});
