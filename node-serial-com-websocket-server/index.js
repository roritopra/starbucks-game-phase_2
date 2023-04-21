import { express, Server, cors, SerialPort, ReadlineParser } from './dependencies.js'

const PORT = 5050; // No cambiar
const IPaddress ='192.168.10.18'; // Cambiar por la IP del computador
const SERVER_IP = IPaddress;

const app = express();
app.use(cors({ origin: "*" })); // Esta linea de codigo es para seguridad
app.use(express.json());
app.use('/app', express.static('public-app'));
app.use('/display', express.static('public-display'));

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    console.table({ 
        'Client Endpoint' : `http://${SERVER_IP}:${PORT}/app`,
        'Mupi Endpoint': `http://${SERVER_IP}:${PORT}/display` });
});
// Run on terminal: ngrok http 5050;

/**    Correr en localhost    */
const ioServer = new Server(httpServer);

/**    Correr en Ngrok    */
//const ioServer = new Server(httpServer, { path: '/real-time' });

app.post('/user', (request, response) => {
    console.log('----- USER -----');
    console.log(request.body);
    response.end();
})
//============================================ END

//⚙️ SERIAL COMMUNICATION SETUP -------------------------------------------------
const protocolConfiguration = { // *New: Defining Serial configurations
    path: 'COM4', //*Change this COM# or usbmodem#####
    baudRate: 9600
};
const port = new SerialPort(protocolConfiguration);
/*port.on('data', (arduinoData)=>{
    console.log(arduinoData);
})*/

const parser = port.pipe(new ReadlineParser);

//============================================ END

/* 🔄 SERIAL COMMUNICATION WORKING___________________________________________
Listen to the 'data' event, arduinoData has the message inside*/

parser.on('data', (arduinoData)=>{

        ioServer.sockets.emit('arduino-button');
/*         ioServer.sockets.emit('display-salto');
        ioServer.sockets.emit('change-display-screen'); */
        console.log(arduinoData)
    /*
    ioServer.emit('arduinoMessage',arduinoData);
    console.log(arduinoData);*/
});

/* 🔄 WEBSOCKET COMMUNICATION __________________________________________

1) Create the socket methods to listen the events and emit a response
It should listen for directions and emit the incoming data.*/

ioServer.on('connection', (socket) => {
    console.log("Connected")

    socket.on('sendToArduino', (message) => {
      parser.write(message); 
    });
  });


/* 🔄 HTTP COMMUNICATION ___________________________________________

2) Create an endpoint to POST user score and print it
_____________________________________________ */

