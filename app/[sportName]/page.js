import styles from '../page.module.css';
import Link from 'next/link';
import SportSubNav from '../../components/SportSubNav'; 

// Datos estáticos que definen la apariencia de la sección
const sportAppearanceData = {
    'futbol': { 
        display: "Fútbol", 
        sportClass: styles.sportFutbol, 
        icon: '⚽',
        deporte: "futbol"
    }, 
    'voleibol': { 
        display: "Vóleibol", 
        sportClass: styles.sportVoleibol, 
        icon: '🏐',
        deporte: "voleibol"
    },
    'basquetbol': { 
        display: "Básquetbol", 
        sportClass: styles.sportBasquetbol, 
        icon: '🏀',
        deporte: "basquetbol"
    },
};

// Función para obtener datos de la API
async function getLigasData() {
    const baseUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://tu-dominio.com' 
                    : 'http://localhost:3000'; 
                    
    const res = await fetch(`${baseUrl}/api/ligas`, { 
        cache: 'no-store' 
    }); 

    if (!res.ok) {
        throw new Error('Fallo al obtener datos de Google Sheets.');
    }

    return res.json();
}


export default async function SportPage({ params }) {

    const { sportName: sportId } = await params;

    const appearanceData = sportAppearanceData[sportId];

    if (!appearanceData) {
        return (
            <main className={styles.main}>
                <div className={styles.errorContainer}>
                    <h1>Error 404</h1>
                    <p>Deporte no encontrado.</p>
                </div>
            </main>
        );
    }
    
    // --- LÓGICA DE DATOS ---
    try {
        await getLigasData();
    } catch (error) {
        console.error("Error al obtener datos de API:", error);
    }

    return (
        <main className={styles.main}>
            <div className={styles.whiteContentWrapper}> 
                
                {/* 1. ENCABEZADO SUPERIOR */}
                <header className={styles.secondaryHeader}>
                    <Link href="/" className={styles.backButton}>← Inicio</Link>
                    <h1 className={styles.headerCentralTitle}>Ligas Recreativas UACh</h1>
                    <div className={styles.headerRightTag}>INFO104</div>
                </header>

                {/* 2. SUB-NAVEGACIÓN DE DEPORTE */}
                <SportSubNav 
                    sportNameId={sportId} 
                    sportDisplayName={appearanceData.display} 
                />

                {/* CONTENIDO PRINCIPAL */}
                <section 
                    className={styles.sportDetails} 
                    style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}
                >
                    <h2 style={{ color: 'var(--color-espn-dark)' }}>
                        {appearanceData.icon} {appearanceData.display} {appearanceData.icon}
                    </h2>

                    <p style={{ color: 'var(--color-espn-gray)' }}>
                        Bienvenido al apartado de {appearanceData.display}.
                        Por favor, utiliza la barra de navegación superior para acceder a los resultados y equipos.
                    </p>
                    
                    <div style={{ marginTop: '50px' }}>
                        <Link href={`/${sportId}/resultados`} className={styles.welcomeButton}>
                            Ver Calendario y Resultados Ahora
                        </Link>
                    </div>
                </section>
                
            </div>
        </main>
    );
}
