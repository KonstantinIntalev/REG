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

    const toMysqlFormatWithMillis = (date) => 
      `${date.toISOString().split('T').join(' ').slice(0, 22)}`;// функция для конвертации времени

    
    console.log(`name: ${a.name}`);
    console.log(`Пароль: ${a.password}`);
/*
    connection.connect(function(err){
      if (err) {
        return console.error("Ошибка: " + err.message);
      } else {
        connection.query(`INSERT INTO sessions_active (id, host, connectionId, time_start) VALUES (NULL, '${connection.config.host}', '${connection.connectionId}', '${toMysqlFormatWithMillis(new Date())}');`), function(err, results, fields) {console.log(err)}
        //connection.query(`INSERT INTO `sessions_active` (`id`, `host`, `connectionId`, `time_start`) VALUES (NULL, 'awd', '123', '2024-12-03');`), function(err, results, fields) {console.log(err)}
        console.log("Подключение к серверу MySQL успешно установлено");
    }});*/


    var string;

    function setValue(value) {
      string = value;
    }
/*
        // функция проверки
        connection.query(`SELECT * FROM users WHERE name = '${a.name}'`, function(err, results, fields) {
          //console.log(err);
          //console.log(results); // собственно данные
          //console.log(fields); // мета-данные полей 
         if ( results[0].password==a.password ){
            console.log(`Вы вошли в систему под именем ${a.name}`) 
            setValue(results);
          } else {console.log("Отказано в доступе")}
        });
      
        // функция задач
        connection.query(`SELECT * FROM users_tasks WHERE user_id = '1'`, function(err, results, fields) {
          //console.log(err);
          //console.log(results); // собственно данные
          //console.log(fields); // мета-данные полей 
            console.log(`Вам разрешен доступ к ${results[0].task_id}`)
        });
console.log(string);
*/


        function query(sql) {
          return new Promise((resolve, reject) => {
            connection.query(sql, (err, rows) => {
              if (err) {
                reject(err);
                }
              else
                resolve(rows);
                setValue(rows)
                console.log(string);
            });
          });
        }

       query(`select * from users WHERE user_id ='1'`);
        
    
/*
  function del(){
    
    connection.query(`INSERT INTO sessions_old(id, host, time, connectionId, time_start, time_end) VALUES (NULL, '${string[0].host}', '1','${string[0].host}', '${time_start[0].time_start}', '${toMysqlFormatWithMillis(new Date())}');`), function(err, results, fields) {console.log()}
    
    connection.query(`DELETE FROM sessions_active WHERE connectionId ='${connection.connectionId}';`), function(err, results, fields) {
      if (err){
        console.log(err)
      }}
  }

   //del(console.log(1));
   //const time_start =[];
   //query(`SELECT time_start FROM sessions_active WHERE connectionId ='${connection.connectionId}';`, function(err, results, fields) {setValue(results)})

*/


   connection.end(function(err) {
        if (err) {
          return console.log("Ошибка: " + err.message);
        } else {
            console.log("Подключение к БД закрыто");
          }
    });
});


  socket.on('close', () => {
    console.log('Соединение закрыто');
    });
  });

console.log('Сервер WebSocket запущен на порту 8080');