import swaggerJSDoc from "swagger-jsdoc";
import { useRuntimeConfig } from "./env";
import { getIPV4 } from "./sys";

const config = useRuntimeConfig();
const projectRoot = process.cwd().replace(/\\/g, "/");

const ipv4 = getIPV4();

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CHL API Documentation",
      version: "1.0.0",
      description: "CHL 项目 API 接口文档",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "开发服务器",
      },
      ...ipv4.map((ip) => {
        return {
          url: `http://${ip}:${config.PORT}`,
          description: `${ip} 服务器`,
        };
      }),
    ],
  },
  apis: [`${projectRoot}/src/routes/**/*.ts`, `${projectRoot}/src/controller/**/*.ts`],
};

export const swaggerSpec = swaggerJSDoc(options);

export const isSwaggerEnabled = (): boolean => {
  if (config.SWAGGER_ENABLED === "false") return false;
  if (config.SWAGGER_ENABLED === "true") return true;
  return config.NODE_ENV !== "production";
};
