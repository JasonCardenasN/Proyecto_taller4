import styles from '../../page.module.css';
import Link from 'next/link';
import SportSubNav from '../../../components/SportSubNav'; 

// Datos estáticos
const sportAppearanceData = {
    'futbol': { display: "Fútbol", deporte: "futbol"},
    'voleibol': { display: "Vóleibol", deporte: "voleibol"},
    'basquetbol': { display: "Básquetbol", deporte: "basquetbol"},
};

// Función para obtener datos de la API 
async function getLigasData() {
    const baseUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://proyecto-taller4.vercel.app/' 
                    : 'http://localhost:3000'; 
                    
    const res = await fetch(`${baseUrl}/api/ligas?sheetIndex=0`, { 
        cache: 'no-store' 
    }); 

    if (!res.ok) {
        throw new Error('Fallo al obtener datos de Google Sheets.');
    }

    return res.json();
}

export default async function LigasPage({ params }) {

    
    const { sportName: sportId } = await params;

    const appearanceData = sportAppearanceData[sportId];

    if (!appearanceData) { return null; }
    
    
    let apiData = null;
    try {
        apiData = await getLigasData();
    } catch (error) {
        console.error("Error al obtener datos de API:", error);
        apiData = { data: [] }; 
    }

    // 1. Filtrar equipos por deporte
    const relevantEquipos = apiData.data.filter(item => 
        item && item.Deporte && item.Deporte.toLowerCase() === appearanceData.deporte
    );
    
    // 2. Extraer Nombres de Liga Únicos
    const ligasUnicas = Array.from(new Set(relevantEquipos.map(item => item.Liga).filter(name => name)));


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

                {/* 3. CONTENIDO PRINCIPAL: LISTA DE LIGAS */}
                <section className={styles.sportDetails}>
                    <h2 className={styles.sportContentTitle}>🏆 Ligas Disponibles en {appearanceData.display}</h2>
                    
                    <div className={styles.teamsListContainer}>
                        {ligasUnicas.length > 0 ? (
                            <ul className={styles.teamsGrid}>
                                {ligasUnicas.map((ligaNombre, index) => (
                                    <li key={index} className={styles.ligaCard}>
                                        <div className={styles.teamLogoPlaceholder}>L</div>
                                        <div className={styles.teamName}>{ligaNombre}</div>
                                        <Link 
                                            href={`/${sportId}/equipos`} 
                                            className={styles.ligaButton}
                                        >
                                            Ver Equipos
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                                No hay ligas registradas para {appearanceData.display} en la hoja de cálculo.
                            </p>
                        )}
                    </div>
                </section>
                
            </div>
        </main>
    );
}
