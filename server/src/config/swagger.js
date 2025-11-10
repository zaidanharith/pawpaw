const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KidConnect API',
      version: '1.0.0',
      description: 'API Documentation for KidConnect Application'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Student: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64b5f72a9c9f2a001c23a8f5' },
            name: { type: 'string', example: 'Agatha' },
            gender: { type: 'string', enum: ['MALE', 'FEMALE'], example: 'FEMALE' },
            address: { type: 'string', example: 'Jl. Mawar No. 1' },
            birthDate: { type: 'string', format: 'date', example: '2015-05-10' },
            classroomId: { type: 'string', example: '64b5f72a9c9f2a001c23a8f5' },
            isActive: { type: 'boolean', example: true },
            classroom: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                teacher: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
