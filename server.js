async function qwe(){
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const mysql = require("mysql2/promise");






server.on('connection', (socket) => {
  console.log('Новое соединение установлено');

  socket.on('message', async function (message) { 

    const connection = await mysql.createConnection({
      host: "MySQL-5.7",
      user: "root",
      database: "test_1",
      password: ""
    });


    const a = JSON.parse(message); //данные из полей ввода

    const toMysqlFormatWithMillis = (date) => 
      `${date.toISOString().split('T').join(' ').slice(0, 22)}`;// функция для конвертации времени
   
    function sqlToJsDate(sqlDate) {
      // sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
      var sqlDateArr1 = sqlDate.split("-");
      var sYear = sqlDateArr1[0];
      var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
   
      var sqlDateArr2 = sqlDateArr1[2].split(" ");
      var sDay = sqlDateArr2[0];
   
      var sqlDateArr3 = sqlDateArr2[1].split(":");
      var sHour = sqlDateArr3[0];
      var sMinute = sqlDateArr3[1];
   
      var sqlDateArr4 = sqlDateArr3[2].split(".");
      var sSecond = sqlDateArr4[0];
      var sMillisecond = sqlDateArr4[1];
   
      return new Date(sYear, sMonth, sDay, (sHour/1+3), sMinute, sSecond, sMillisecond);
   }
    
    console.log(`name: ${a.name}`);
    console.log(`Пароль: ${a.password}`);


    async function ses_st(connection){
      let date = new Date();
      connection.query(`INSERT INTO sessions_active (id, host, connection_Id, time_start) VALUES (NULL, '${connection.config.host}', '${connection.connection.connectionId}', '${toMysqlFormatWithMillis(date)}');`);
    }

    await ses_st(connection)
      .then(
        res => console.log('Сессия открыта'), 
        error => console.log('err_start')
      );

    let session = await connection.query(`SELECT * FROM sessions_active WHERE connection_Id = '${connection.connection.connectionId}'`)




      let quant = [];
        

        // функция проверки
          let string_name = await connection.query(`SELECT * FROM users WHERE name = '${a.name}'`)
          if ( string_name[0][0].password==a.password ){
            console.log(`Вы вошли в систему под именем ${a.name}`) 
          } else {console.log("Отказано в доступе")}
        // функция задач
          let tasks = await connection.query(`SELECT * FROM users_tasks WHERE user_id = '${string_name[0][0].user_id}'`)
          if (tasks[0].length != 0) {
            for (let i=0;i<tasks[0].length;i++){
              console.log(`Вам разрешен доступ к ${tasks[0][i].task_id}`)
              quant.push(tasks[0][i].task_id)
            }
          } else {console.log(`Вам разрешен доступ к ${tasks[0][0].task_id}`)}
           
        // имя задчи
        let task =[];
        for(let i=0;i<quant.length;i++){
          let name = await connection.query(`SELECT * FROM tasks WHERE task_id = '${quant[i]}'`)
          task.push(name[0][0].name_task)
        }

async function ses_end(){
    let date = new Date();
    connection.query(`INSERT INTO sessions_old(id, host, time, connection_Id, time_start, time_end) VALUES (NULL, '${session[0][0].host}', '${(new Date() - sqlToJsDate(session[0][0].time_start))/1000}', '${session[0][0].connection_Id}', '${session[0][0].time_start}', '${toMysqlFormatWithMillis(date)}');`);
    connection.query(`DELETE FROM sessions_active WHERE connection_Id ='${connection.connection.connectionId}';`)
    socket.send(JSON.stringify([{data:task, type:'task'}, {data:"hello", type:'text'}]))
    console.log("Сессия закрыта")
}

ses_end().then(
  await connection.end()
)
   
  });


  socket.on('close', () => {
    console.log('Соединение закрыто');
    });
  });

console.log('Сервер WebSocket запущен на порту 8080');}

qwe();