import styles from '../../page.module.css';
import Link from 'next/link';
import SportSubNav from '../../../components/SportSubNav'; 

// Datos estáticos
const sportAppearanceData = {
    'futbol': { display: "Fútbol", deporte: "futbol"}, 
    'voleibol': { display: "Vóleibol", deporte: "voleibol"},
    'basquetbol': { display: "Básquetbol", deporte: "basquetbol"},
};

// Función para obtener datos
async function getLigasData() {
    const baseUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://proyecto-taller4.vercel.app/' 
                    : 'http://localhost:3000'; 
                    
    const res = await fetch(`${baseUrl}/api/ligas`, { 
        cache: 'no-store' 
    }); 

    if (!res.ok) {
        throw new Error('Fallo al obtener datos de Google Sheets.');
    }

    return res.json();
}

export default async function EquiposPage({ params }) {

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
    
    // --- DATA ---
    let apiData = null;
    try {
        apiData = await getLigasData();
    } catch (error) {
        console.error("Error al obtener datos de API:", error);
        apiData = { data: [] };
    }

    const relevantTeams = apiData.data.filter(item => 
        item.Deporte && item.Deporte.toLowerCase() === appearanceData.deporte
    );

    return (
        <main className={styles.main}>
            <div className={styles.whiteContentWrapper}> 
                
                <header className={styles.secondaryHeader}>
                    <Link href="/" className={styles.backButton}>← Inicio</Link>
                    <h1 className={styles.headerCentralTitle}>Ligas Recreativas UACh</h1>
                    <div className={styles.headerRightTag}>INFO104</div>
                </header>

                <SportSubNav 
                    sportNameId={sportId} 
                    sportDisplayName={appearanceData.display} 
                />

                <section className={styles.sportDetails}>
                    <h2 className={styles.sportContentTitle}>
                        EQUIPOS DE {appearanceData.display}
                    </h2>
                    
                    <div className={styles.teamsListContainer}>
                        {relevantTeams.length > 0 ? (
                            <ul className={styles.teamsGrid}>
                                {relevantTeams.map((item, index) => (
                                    <li key={index} className={styles.teamCard}>
                                        
                                        <div className={styles.teamLogoPlaceholder}>
                                            {appearanceData.display[0]}
                                        </div>

                                        <div className={styles.teamName}>
                                            {item.Equipos || item.Nombre_Equipo || 'Equipo Desconocido'}
                                        </div>
                                        
                                        <span className={styles.teamDetail}>
                                            Liga: {item.Liga || 'Recreativa UACH'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                                No hay equipos registrados para {appearanceData.display}.
                            </p>
                        )}
                    </div>
                </section>
                
            </div>
        </main>
    );
}
