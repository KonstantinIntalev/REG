const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "MySQL-5.7",
	user: "root",
	database: "test_1",
	password: ""
});




server.on('connection', (socket) => {
  console.log('Новое соединение установлено');

  socket.on('message', (message) => { 
    
    const a = JSON.parse(message); //данные из полей ввода
    console.log(`name: ${a.name}`);
    console.log(`Пароль: ${a.password}`);

    connection.connect(function(err){
      if (err) {
        return console.error("Ошибка: " + err.message);
      } else {
        console.log("Подключение к серверу MySQL успешно установлено");
      }
    });

        /*connection.query(`INSERT INTO first(id, name, password) VALUES (NULL, '${a.name}', '${a.password}');`, function(err, results, fields) {
          if (err){
            console.log(err)
          }
        });*/

        // функция проверки
        connection.query(`SELECT * FROM first WHERE name = '${a.name}'`, function(err, results, fields) {
          //console.log(err);
          //console.log(results); // собственно данные
          //console.log(fields); // мета-данные полей 
          if ( results[0].password==a.password ){
            console.log("Вы вошли в систему") 
          } else {console.log("Отказано в доступе")}
        });
        


    connection.end(function(err) {
      if (err) {
        return console.log("Ошибка: " + err.message);
      }
      console.log("Подключение к БД закрыто");
    });

});


  socket.on('close', () => {
    console.log('Соединение закрыто');
  });
});

console.log('Сервер WebSocket запущен на порту 8080');