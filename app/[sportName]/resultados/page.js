import styles from '../../page.module.css';
import Link from 'next/link';
import SportSubNav from '../../../components/SportSubNav'; 

// Datos estáticos
const sportAppearanceData = {
    'futbol': { display: "Fútbol", deporte: "futbol"}, 
    'voleibol': { display: "Vóleibol", deporte: "voleibol"},
    'basquetbol': { display: "Básquetbol", deporte: "basquetbol"},
};

// ------------------------------------------------------------------
// API BASE
// ------------------------------------------------------------------

async function getSheetData(sheetIndex) {
    // 💡 CORRECCIÓN VERCEL: Usamos VERCEL_URL si estamos en producción
    const host = process.env.VERCEL_URL;
    
    const baseUrl = process.env.NODE_ENV === 'production' 
                    ? `https://${host}` 
                    : 'http://localhost:3000'; 
                    
    // Llamamos a la API con sheetIndex
    const res = await fetch(`${baseUrl}/api/ligas?sheetIndex=${sheetIndex}`, { 
        cache: 'no-store' 
    });

    if (!res.ok) {
        throw new Error(`Fallo al obtener datos de la hoja con índice ${sheetIndex}.`);
    }

    return res.json();
}

// ------------------------------------------------------------------
// UNIFICACIÓN DE EQUIPOS + PARTIDOS
// ------------------------------------------------------------------

async function getMatchesBySport(targetSportId) {
    const [equiposResult, partidosResult] = await Promise.all([
        getSheetData(0),
        getSheetData(1)
    ]);

    const equiposData = equiposResult.data || [];
    const partidosData = partidosResult.data || [];

    const teamNameMap = new Map();
    const teamSportMap = new Map();

    // Registrar nombres y deportes
    equiposData.forEach(equipo => {
        const id = equipo.ID_EQUIPO?.toString();
        if (id && equipo.Deporte) {
            teamSportMap.set(id, equipo.Deporte.toLowerCase());
            teamNameMap.set(id, equipo.Nombre_Equipo || equipo.Equipos || `ID ${id}`);
        }
    });

    // Filtrar por deporte
    const relevantMatches = partidosData.filter(match => {
        const id1 = match.equipo1?.toString();
        return teamSportMap.get(id1) === targetSportId;
    });

    // Reemplazar IDs por nombres
    const matchesWithNames = relevantMatches.map(match => ({
        ...match,
        equipo1_nombre: teamNameMap.get(match.equipo1?.toString()) || 'Equipo Desconocido',
        equipo2_nombre: teamNameMap.get(match.equipo2?.toString()) || 'Equipo Desconocido',
    }));

    return matchesWithNames;
}

// ------------------------------------------------------------------
// AGRUPACIÓN POR FECHA
// ------------------------------------------------------------------

function groupMatchesByDate(matches) {
    const grouped = {};

    matches.forEach(match => {
        const dateKey = match.fecha || 'Fecha Desconocida';
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(match);
    });

    return grouped;
}

// ------------------------------------------------------------------
// PÁGINA PRINCIPAL
// ------------------------------------------------------------------

export default async function ResultadosPage({ params }) {

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

    let relevantMatches = [];
    try {
        relevantMatches = await getMatchesBySport(appearanceData.deporte);
    } catch (error) {
        console.error("Error al unir datos:", error);
    }

    const groupedMatches = groupMatchesByDate(relevantMatches);
    const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    return (
        <main className={styles.main}>
            <div className={styles.whiteContentWrapper}> 
                
                {/* Header */}
                <header className={styles.secondaryHeader}>
                    <Link href="/" className={styles.backButton}>← Inicio</Link>
                    <h1 className={styles.headerCentralTitle}>Ligas Recreativas UACh</h1>
                    <div className={styles.headerRightTag}>INFO104</div>
                </header>

                {/* Subnav */}
                <SportSubNav 
                    sportNameId={sportId} 
                    sportDisplayName={appearanceData.display} 
                />

                {/* Calendario */}
                <section className={styles.sportDetails}>
                    <h2 className={styles.sportContentTitle}>
                        📅 Calendario de Partidos de {appearanceData.display}
                    </h2>
                    
                    <div className={styles.calendarContainer}>
                        {relevantMatches.length > 0 ? (
                            sortedDates.map(date => (
                                <div key={date} className={styles.dayGroup}>
                                    
                                    <h3 className={styles.dayTitle}>{date}</h3> 
                                    
                                    <ul className={styles.dailyMatchesList}>
                                        {groupedMatches[date].map((match, index) => (
                                            
                                            <Link 
                                                key={match.id || index} 
                                                href={`/${sportId}/resultados/${match.id || 'detalle'}`} 
                                                className={styles.matchCardLink}
                                            >
                                                <li className={styles.matchScheduleCard}>
                                                    
                                                    {/* Hora y Lugar */}
                                                    <div className={styles.scheduleInfo}>
                                                        <span className={styles.scheduleTime}>
                                                            {match.fecha?.split(' ')[1] || 'TBD'}
                                                        </span> 
                                                        <span className={styles.scheduleLocation}>
                                                            {match.lugar || 'Cancha Central'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Equipos */}
                                                    <div className={styles.scheduleTeams}>
                                                        <span className={styles.scheduleTeamName}>
                                                            {match.equipo1_nombre}
                                                        </span>
                                                        <span className={styles.scheduleScore}>
                                                            {match.score_equipo1 || '-'}
                                                        </span>
                                                    </div>

                                                    <div className={styles.scheduleTeams}>
                                                        <span className={styles.scheduleTeamName}>
                                                            {match.equipo2_nombre}
                                                        </span>
                                                        <span className={styles.scheduleScore}>
                                                            {match.score_equipo2 || '-'}
                                                        </span>
                                                    </div>

                                                    <div className={styles.scheduleStatus}>
                                                        {match.score_equipo1 || match.score_equipo2 ? 'Finalizado' : 'Pendiente'}
                                                    </div>
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                                No hay partidos registrados para {appearanceData.display}.
                            </p>
                        )}
                    </div>
                </section>
                
            </div>
        </main>
    );
}
