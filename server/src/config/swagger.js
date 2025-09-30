const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KidConnect API",
      version: "1.0.0",
      description: "API untuk aplikasi KidConnect oleh Kelompok 13",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Upload: {
          type: "object",
          properties: {
            file: { type: "string", format: "binary", description: "File yang diunggah" },
            url: { type: "string", description: "URL file setelah diunggah" },
          },
          required: ["file"],
        },
        Student: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID mahasiswa" },
            name: { type: "string", description: "Nama mahasiswa" },
            email: { type: "string", description: "Email mahasiswa" },
            age: { type: "integer", description: "Umur mahasiswa" },
          },
          required: ["name", "email"],
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
