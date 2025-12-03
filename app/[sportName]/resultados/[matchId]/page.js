import styles from '../../../page.module.css';
import Link from 'next/link';
import SportSubNav from '../../../../components/SportSubNav'; 

// Datos estáticos
const sportAppearanceData = {
    'futbol': { display: "Fútbol", deporte: "futbol"}, 
    'voleibol': { display: "Vóleibol", deporte: "voleibol"},
    'basquetbol': { display: "Básquetbol", deporte: "basquetbol"},
};

async function getSheetData(sheetIndex) {
    const baseUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://proyecto-taller4.vercel.app/' 
                    : 'http://localhost:3000'; 
                    
    const res = await fetch(`${baseUrl}/api/ligas?sheetIndex=${sheetIndex}`, { 
        cache: 'no-store' 
    }); 

    if (!res.ok) {
        throw new Error(`Fallo al obtener datos de la hoja con índice ${sheetIndex}.`);
    }
    return res.json();
}

// --------------------------------------------------------------------
// OBTENER TODOS LOS PARTIDOS + NOMBRES DE EQUIPOS
// --------------------------------------------------------------------
async function getFullMatchData() {
    try {
        const [equiposResult, partidosResult] = await Promise.all([
            getSheetData(0), // Equipos
            getSheetData(1)  // Partidos
        ]);

        const equiposData = equiposResult.data || [];
        const partidosData = partidosResult.data || [];
        
        const teamNameMap = new Map();

        // Mapeamos ID -> Nombre de equipo
        equiposData.forEach(equipo => {
            const id = equipo.ID_EQUIPO?.toString();
            if (id) {
                teamNameMap.set(id, equipo.Nombre_Equipo || equipo.Equipos || `Equipo ${id}`);
            }
        });
        
        // Unir nombres
        const matchesWithNames = partidosData.map(match => {
            const id = match.id?.toString();  
            return {
                ...match,
                equipo1_nombre:
                    teamNameMap.get(match.equipo1?.toString()) ||
                    match.equipo1 ||
                    'Local Desconocido',

                equipo2_nombre:
                    teamNameMap.get(match.equipo2?.toString()) ||
                    match.equipo2 ||
                    'Visitante Desconocido',

                matchId: id   
            };
        });

        return matchesWithNames;

    } catch (e) {
        console.error("Failed to fetch full match data:", e);
        return [];
    }
}

// --------------------------------------------------------------------
// PÁGINA DE DETALLE DE UN PARTIDO
// --------------------------------------------------------------------
export default async function MatchDetailPage(props) {
    const params = await props.params;  
    const sportName = params.sportName;
    const matchId   = params.matchId.toString();
    const appearanceData = sportAppearanceData[sportName];
    if (!appearanceData) {
        return (
            <main className={styles.main}>
                <div className={styles.whiteContentWrapper}>
                    <h2>Deporte no válido</h2>
                </div>
            </main>
        );
    }

    // Obtener todos los partidos
    let allMatches = [];
    try {
        allMatches = await getFullMatchData();
    } catch (err) {
        console.error("Error fetching match detail data:", err);
    }
    
    // Buscar el partido por ID
    const match = allMatches.find(m => m.matchId === matchId);

    if (!match) {
        return (
            <main className={styles.main}>
                <div className={styles.whiteContentWrapper}>
                    <div className={styles.errorContainer}>
                        <h2>Partido no encontrado</h2>
                        <p>No se encontró el partido con ID: {matchId}</p>
                        <Link href={`/${sportName}/resultados`} className={styles.welcomeButton}>
                            Volver al Calendario
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const matchStatus =
        match.score_equipo1 || match.score_equipo2
            ? 'Partido Finalizado'
            : 'Próximo Partido';

    const matchTime = match.fecha?.split(' ')[1] || 'Hora no definida';

    return (
        <main className={styles.main}>
            <div className={styles.whiteContentWrapper}>
                
                {/* 1. ENCABEZADO SUPERIOR */}
                <header className={styles.secondaryHeader}>
                    <Link href={`/${sportName}/resultados`} className={styles.backButton}>← Volver a Calendario</Link>
                    <h1 className={styles.headerCentralTitle}>Ligas Recreativas UACh</h1>
                    <div className={styles.headerRightTag}>INFO104</div>
                </header>

                {/* 2. SUB-NAVEGACIÓN */}
                <SportSubNav 
                    sportNameId={sportName} 
                    sportDisplayName={appearanceData.display} 
                />

                {/* 3. CONTENIDO PRINCIPAL: DETALLE DEL PARTIDO */}
                <section className={styles.matchDetailSection}>
                    <div className={styles.matchDetailCard}>
                        
                        {/* DETALLE SUPERIOR - FECHA, HORA, ESTADO */}
                        <div className={styles.matchDetailHeader}>
                            <p className={styles.matchStatusBig}>
                                {matchStatus}
                            </p>
                        </div>

                        {/* MARCADOR Y EQUIPOS */}
                        <div className={styles.matchScoreboard}>
                            {/* Equipo 1 */}
                            <div className={styles.detailTeamBlock}>
                                <h2 className={styles.detailTeamName}>
                                    {match.equipo1_nombre}
                                </h2>
                            </div>

                            {/* Marcador Central */}
                            <div className={styles.scoreCenter}>
                                <p className={styles.scoreTotal}>
                                    {match.score_equipo1 || '-'} - {match.score_equipo2 || '-'}
                                </p>
                                <p className={styles.detailVs}>
                                    {match.score_equipo1 || match.score_equipo2 ? 'Final' : 'VS'}
                                </p>
                            </div>

                            {/* Equipo 2 */}
                            <div className={`${styles.detailTeamBlock} ${styles.visitor}`}>
                                <h2 className={styles.detailTeamName}>
                                    {match.equipo2_nombre}
                                </h2>
                            </div>
                        </div>
                        
                        {/* INFORMACIÓN ADICIONAL (GRID) */}
                        <div className={styles.detailInfoBar}>
                            <p className={styles.detailInfoItem}>
                                Fecha: <span>{match.fecha || 'N/A'}</span>
                            </p>
                            <p className={styles.detailInfoItem}>
                                Hora: <span>{matchTime}</span>
                            </p>
                            <p className={styles.detailInfoItem}>
                                Lugar: <span>{match.lugar || 'Cancha Principal'}</span>
                            </p>
                        </div>

                    </div>
                    
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Link href={`/${sportName}/resultados`} className={styles.welcomeButton}>
                            ← Volver al Calendario
                        </Link>
                    </div>

                </section>
                
                {/* 💡 BARRA DE COMENTARIOS FALSA */}
                <section className={styles.commentsSection}>
                    <div className={styles.commentsContainer}>
                        <h2 className={styles.commentTitle}>Comentarios</h2>

                        {/* Área para ingresar un nuevo comentario (Falsa) */}
                        <div className={styles.commentInputGroup}>
                            <textarea 
                                className={styles.commentTextArea} 
                                placeholder="Escribe tu comentario aquí..."
                            ></textarea>
                            <button className={styles.commentButton}>
                                Publicar Comentario
                            </button>
                        </div>
                        
                        {/* Lista de comentarios existentes (Datos Falsos) */}
                        <ul className={styles.commentList}>
                            <li className={styles.commentItem}>
                                <span className={styles.commentAuthor}>UsuarioX</span>
                                <span className={styles.commentTime}>hace 5 minutos</span>
                                <p className={styles.commentText}>¡Gran partido! La defensa de {match.equipo1_nombre} estuvo impresionante.</p>
                            </li>
                            <li className={styles.commentItem}>
                                <span className={styles.commentAuthor}>INFO104-Admin</span>
                                <span className={styles.commentTime}>hace 1 hora</span>
                                <p className={styles.commentText}>Próximo partido se juega el jueves a las 20:00.</p>
                            </li>
                        </ul>
                    </div>
                </section>
                
            </div>
        </main>
    );
}