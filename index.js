var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var recastai = require('recastai').default;
var axios = require('axios');


/** Variables declaradas */
var datehour = "";
/** RECAST SDK */
var requestToken = 'cebe67ce008e1fd9bcb79b37b3813b38';
const client = new recastai(requestToken);
// abrir el archivo de html para mostra 
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

/** INICIA CONEXION CON EL SOCKET DE CHAT */
io.on('connection', function(socket){
    
    //indicar que existe una conexion de un usuario
    io.emit('chat message', 'Se ha conectado un usuario : ' + socket.id, datehour);

    console.log('a user connected : ' + socket.id);
    //socket.emit('idconnection',socket);

    socket.on('disconnect', function(){
      console.log('user disconnected : ' + socket.id);
      io.emit('chat message', 'Se ha Desconectado un usuario : ' + socket.id, datehour);
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg, datehour);
        client.request.converseText(msg)
        .then((res) => {
            var slug = 'defauld';
            if(res.intents.length > 0){
                slug = res.intents[0].slug;
            }
            console.log('Tipo Pregunta : ' + slug);
            socket.emit('bot message', RespuestaPredefinidas(slug,res));
        }).catch((error) => {
            console.log(error)
        })
    });

  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/**
 * Funciones Adicionales para el uso interno del aplicativo.
 */

setInterval(function(){
	var d = new Date,
	dformat = [d.getFullYear(),d.getMonth()+1,d.getDate(),].join('-')+' '+
			  [d.getHours(),
			   d.getMinutes(),
			   d.getSeconds()].join(':');
	//console.log(dformat);
	dformat = dformat.toString();
	datehour = dformat
},1);

/**
 * Entrega respuestas segun las intenciones configuradas.
 * @param {string} intents 
 * @param {object} res 
 */

function RespuestaPredefinidas(intents,res){
    switch (intents) {
        case 'greetings':
            var resp = greetingsResponse[getRandomInt(0,greetingsResponse.length)]
            return resp;
            break;
        case 'ask-creator':
            var resp = creatorResponse[getRandomInt(0,creatorResponse.length)]
            return resp;
            break;
        case 'ask-feeling':
            var resp = feelingsResponse[getRandomInt(0,feelingsResponse.length)]
            return resp;
            break;
        case 'get-time':
            var resp = 'La fecha exacta es ' + datehour;
            return resp;
            break;
        case 'agendar':
            var resp = agendarReponseNotTime[getRandomInt(0,agendarReponseNotTime.length)]
            if(typeof res.entities.datetime !== 'undefined'){
                resp = 'Perfecto agendo para el ' + res.entities.datetime[0].formatted;
            }
            return resp;
            break;
        default:
            var resp = defauldResponse[getRandomInt(0,defauldResponse.length)]
            return resp;
            break;
    }
}
/**
 * Entrega un random entre un numero minimo y maximo.
 * @param {number} min 
 * @param {number} max 
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Repuestas predefinidas del BOT utilizar con getRandomInt();
 * example = agendarReponseNotTime[getRandomInt(0,agendarReponseNotTime.length)]
 */
var defauldResponse = [
    'No entiendo muy bien tu pregunta, tal vez no me han configurado para esto.',
    'Por el momento no puedo entenderte, pero puedes preguntarme que hacer para mostrarte mis capacidades.',
    'No puedo entenderte, mis capacidades son limitadas :('
];

var greetingsResponse = [
    'Hola mi nombre es DocBot, preguntame lo que puedes hacer',
    'Hola, Soy un Doctor Robot, Puedo agendar tus horas con un doctor real si me lo pides.',
    'Hola, dime en que te puedo ayudar.'
];

var creatorResponse = [
    'Mis Creadores son Luis Navarro, soy una demo de un doctor virtual para ayudar a los niños de la teleton.',
    'Vengo de una internet muy lejana y no te puedes imaginar con que tecnologia estoy programado!!! :D',
    'Me creo Luis Navarro, te dejo el link de su web para que los veas http://lnavarro.cl'
]

var feelingsResponse = [
    'Estoy muy bien gracias',
    'Mis bytes estan desordenados.',
    'Tengo un corto circuito que no me permite estar al 100% de funcionamiento',
    'Creo que mis ram estan trabajando mucho, asi que me siento algo cansado.'
];

//Agendar respuestas

var agendarReponseNotTime = [
    'Ningun problema, necesito que me digas en la fecha y la hora para agendar.',
    'Claro, me puedes indicar el horario que quieres agendar?.',
    'Obvio dime la fecha que quieres agendar.'
];



