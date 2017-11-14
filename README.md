# chatbotRecastai
ChatBot Recastai &amp; socketio

#INSTALACION

1. Realizar un clone del repositorio.
2. Ejecutar el comando `$npm install -save`
3. Ejecutar el programa `$node index.js`
4. Abrir http://localhost:3000


El ejemplo del chatBot esta creado con RECAST.AI y el [SDK Node Recast.ai](https://github.com/RecastAI/SDK-NodeJS) y [Socket.io](https://github.com/socketio/socket.io/) es solo la version 1, la idea es agregar conexión con base de datos y API adicionales.

** Ademas estoy pensado en agregar un modulo de autoaprendizaje del bot para ver como se comporta.

Si quieren ver la demo del bot puede entrar a testing de ejemplo [IR A DEMO](lnavarro.cl:3000)

## CODIGO --- > Ver 1.0

Para funcionar requiere los modulos de express, socket.io, y recast SDK ademas agregue axios para futuras consultas.

``` [Javascript]
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  var recastai = require('recastai').default;
  var axios = require('axios');
```


Funciones de Socket Io:

``` [Javascript]
io.on('connection', function(socket){

  //Indica cuando un usuario se ha desconectado.
  socket.on('disconnect');
  
  //entrega el mensaje al servidor
  socket.on('chat message')
  
  //Entrega la respuesta del Chat
  socket.emit('bot message')
  
})
```


Para la configuracion incial de RECAST.AI se utiliza el SDK y se coloca el token.

``` [Javascript]
var requestToken = 'cebe67ce008e1fd9bcb79b37b3813b38';
const client = new recastai(requestToken);
```

Ademas para realizar el request de las "intenciones" configuradas en el AI se utiliza el siguiente comando:

``` [Javascript]
  client.request.converseText('TEXT')
  .then((res) => {
     console.log(res) // entrega la respuesta correcta de Recast.io
  }).catch((error) => {
      console.log(error) // entrega el erro por si falla de Recast.io
  })
```


Para saber las intenciones y las respuestas que necesito realizo un case y luego en un objeto coloco las respuestas que necesito dependiendo de la intencion.

** Aqui un ejemplo cuando la intencion es saludar al bot.

``` [Javascript]
function RespuestaPredefinidas(intents,res){
  case 'greetings':
        var resp = greetingsResponse[getRandomInt(0,greetingsResponse.length)]
        return resp;
        break;
  // en el caso que no encuentre la intencion retorna una respuesta defauld aleatoria.
  default:
        var resp = defauldResponse[getRandomInt(0,defauldResponse.length)]
        return resp;
        break;
}

```



 Para las respuesta simplemente generamos un objeto con los datos que queremos devolver en el caso que se cumpla la condicion de la intencion.


``` [Javascript]
var defauldResponse = [
    'No entiendo muy bien tu pregunta, tal vez no me han configurado para esto.',
    'Por el momento no puedo entenderte, pero puedes preguntarme que hacer para mostrarte mis capacidades.',
    'No puedo entenderte, mis capacidades son limitadas :('
];

```

para obtener respuestas aleatorias tienen que utilizar getRandomInt().
de la siguiente manera.

``` [Javascript]
 defauldResponse[getRandomInt(0,defauldResponse.length)]
```

## LISTO DIFRUTA XD


