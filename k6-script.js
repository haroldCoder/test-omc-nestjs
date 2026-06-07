import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de la prueba de estrés
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Rampa de subida a 50 usuarios virtuales (VUs) en 30s
    { duration: '1m', target: 50 },   // Mantener 50 VUs por 1 minuto
    { duration: '30s', target: 100 }, // Rampa de subida a 100 VUs en 30s
    { duration: '1m', target: 100 },  // Mantener 100 VUs por 1 minuto
    { duration: '30s', target: 0 },   // Rampa de bajada a 0 VUs (enfriamiento)
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben ser menores a 500ms
  },
};

export default function () {
  // Ajusta esta URL según cómo estés exponiendo tu servicio.
  // Si haces un port-forward local (ej: kubectl port-forward svc/test-omc-nestjs-service 8080:80)
  // la URL sería http://localhost:8080
  const url = 'http://localhost:8080';

  // Opcional: Si tienes endpoints específicos, añádelos a la ruta (ej: /api/v1/health)
  const res = http.get(url);
  if (res.status !== 200) {
    console.log(`ERROR: ${res.body}`);
  }

  check(res, {
    'status es 200': (r) => r.status === 200 || r.status === 404, // Ajusta según qué devuelva tu ruta base
  });

  // Pausa corta entre peticiones para emular a un usuario real
  sleep(1);
}
