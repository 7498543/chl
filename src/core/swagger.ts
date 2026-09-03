import swaggerJSDoc from "swagger-jsdoc";
import { useRuntimeConfig } from "./env";

const config = useRuntimeConfig();
const projectRoot = process.cwd().replace(/\\/g, "/");

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
