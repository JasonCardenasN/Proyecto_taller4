// environment.d.ts (En la raíz del proyecto)

// Extiende el namespace global de Node.js para incluir las variables de entorno.
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_SHEETS_CLIENT_EMAIL: string;
    GOOGLE_SHEETS_PRIVATE_KEY: string;
    GOOGLE_SHEET_ID: string;

  }
}