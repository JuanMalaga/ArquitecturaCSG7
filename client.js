const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const END = "CERRAR";

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const connect = (host, port) => {
  console.log(`Connecting to ${host}:${port}`);

  const socket = new Socket();
  socket.connect({ host, port });
  socket.setEncoding("utf-8");

  socket.on("connect", () => {
    console.log("Connected");

    readline.question("Choose your username: ", (username) => {
      socket.write(username);
      console.log(`Escribe el mensaje para enviar, digita ${END} para finalizar la conexion`);
    });

    readline.on("line", (message) => {
      socket.write(message);
      if (message === END) {
        socket.end();
      }
    });

    socket.on("data", (data) => {
      console.log(data);
    });
  });

  socket.on("error", (err) => error(err.message));

  socket.on("close", () => {
    console.log("Desconectado");
    process.exit(0);
  });
};

const main = () => {
  if (process.argv.length !== 4) {
    error(`Usage: node ${__filename} host port`);
  }

  let [, , host, port] = process.argv;
  if (isNaN(port)) {
    error(`Puerto invalido ${port}`);
  }
  port = Number(port);

  connect(host, port);
};

if (module === require.main) {
  main();
}
