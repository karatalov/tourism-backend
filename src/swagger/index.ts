import path from "path";
import fs from "fs";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

const swaggerPath = path.resolve(process.cwd(), "src/swagger/swagger.yaml");

const file = fs.readFileSync(swaggerPath, "utf8");
const swaggerDocument = YAML.parse(file);

const customCss = `
  body { background-color: #fafafa; }
`;

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerDocument, {
  customCss,
  customSiteTitle: "Tourism API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
  },
  explorer: true,
});
