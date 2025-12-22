import buildServer from "./app";

const startServer = () => {
  const server = buildServer();
  const PORT = process.env.PORT || 3000;

  server.listen({ port: PORT, host: "0.0.0.0" }, () => {
    console.log(`Сервер запущен по адресу: http://localhost:${PORT}`);
    console.log(`API документация доступна по адресу: http://localhost:${PORT}/docs`);
  });
};

startServer();
