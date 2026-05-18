// init-mongo.js
// Script de inicialización y sembrado de datos para MongoDB.
// Crea la base de datos, define las reglas de validación JSON Schema para la colección 'leads',
// crea un índice único para el campo 'email', e inserta 10 registros de ejemplo.

// Cambiar al contexto de la base de datos destino
db = db.getSiblingDB('omc_leads_db');

print('--- Iniciando inicialización de la base de datos omc_leads_db ---');

// Eliminar la colección leads si ya existe para evitar errores en reinicios limpios
db.leads.drop();

// Crear la colección 'leads' con validaciones de esquema JSON (JSON Schema Validator)
// Esto de forma estricta a nivel de base de datos
db.createCollection('leads', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'source'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'El nombre del lead es obligatorio y debe ser de tipo string.'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'El email es obligatorio, debe ser de tipo string y tener un formato de correo electrónico válido.'
        },
        phone: {
          bsonType: 'string',
          description: 'El teléfono es opcional y debe ser de tipo string.'
        },
        source: {
          enum: ['instagram', 'facebook', 'landing_page', 'referred', 'other'],
          description: 'La fuente de procedencia es obligatoria y debe ser uno de los siguientes valores: "instagram", "facebook", "landing_page", "referred", "other".'
        },
        productInterest: {
          bsonType: 'string',
          description: 'El producto de interés es opcional y debe ser de tipo string.'
        },
        budget: {
          bsonType: 'number',
          description: 'El presupuesto estimado es opcional y debe ser un número flotante o entero en USD.'
        }
      }
    }
  }
});

print('Colección "leads" creada exitosamente con esquema de validación.');

// Crear un índice único en el campo 'email' para asegurar que sea único a nivel de base de datos
db.leads.createIndex({ email: 1 }, { unique: true });
print('Índice único creado exitosamente en el campo "email".');

// Sembrado de 10 leads de ejemplo altamente realistas y estructurados
const sampleLeads = [
  {
    name: 'Alejandro Pérez',
    email: 'alejandro.perez@example.com',
    phone: '+573001234567',
    source: 'instagram',
    productInterest: 'Curso Avanzado de NestJS',
    budget: 250.00
  },
  {
    name: 'Beatriz Gómez',
    email: 'beatriz.gomez@example.com',
    phone: '+5491123456789',
    source: 'facebook',
    productInterest: 'Mentoría Backend Pro',
    budget: 500.00
  },
  {
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@example.com',
    phone: '+525512345678',
    source: 'landing_page',
    productInterest: 'Taller de Arquitectura Limpia',
    budget: 150.00
  },
  {
    name: 'Diana Restrepo',
    email: 'diana.restrepo@example.com',
    phone: '+573109876543',
    source: 'referred',
    productInterest: 'Curso Avanzado de NestJS',
    budget: 250.00
  },
  {
    name: 'Eduardo Silva',
    email: 'eduardo.silva@example.com',
    phone: '+13055550199',
    source: 'other',
    productInterest: 'Consultoría Corporativa',
    budget: 1200.00
  },
  {
    name: 'Fernanda López',
    email: 'fernanda.lopez@example.com',
    phone: '+56987654321',
    source: 'instagram',
    productInterest: 'Curso Avanzado de NestJS',
    budget: 250.00
  },
  {
    name: 'Gabriel Torres',
    email: 'gabriel.torres@example.com',
    phone: '+51987654321',
    source: 'landing_page',
    productInterest: 'Taller de Microservicios',
    budget: 350.00
  },
  {
    name: 'Helena Ruiz',
    email: 'helena.ruiz@example.com',
    phone: '+34600123456',
    source: 'referred',
    productInterest: 'Mentoría Backend Pro',
    budget: 500.00
  },
  {
    name: 'Ignacio Ortiz',
    email: 'ignacio.ortiz@example.com',
    phone: '+593987654321',
    source: 'facebook',
    productInterest: 'Taller de Arquitectura Limpia',
    budget: 150.00
  },
  {
    name: 'Juana Guerrero',
    email: 'juana.guerrero@example.com',
    phone: '+573151234567',
    source: 'other',
    productInterest: 'Curso Avanzado de NestJS',
    budget: 250.00
  }
];

// Insertar los leads de ejemplo
db.leads.insertMany(sampleLeads);

print('Se han sembrado exitosamente 10 registros de ejemplo en la colección "leads".');
print('--- Proceso de inicialización de base de datos finalizado ---');
