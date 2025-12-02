import './globals.css';

export const metadata = {
  title: 'Ligas Recreativas UACH - Interactivo',
  description: 'Descubre y participa en las ligas deportivas recreativas de la Universidad Austral de Chile (UACH).',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es"> 
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}