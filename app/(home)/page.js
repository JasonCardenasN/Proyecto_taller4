import styles from '../page.module.css';
import Link from 'next/link'; 

// Datos de las ligas
const ligasData = [
    { id: 'futbol', nombre: "Fútbol" },
    { id: 'voleibol', nombre: "Vóleibol" },
    { id: 'basquetbol', nombre: "Básquetbol" },
];

export default function HomePage() {
    return (
        <main className={styles.main}>
            
            <header className={styles.visualHeader}>
                <div className={styles.headerTitleContainer}>
                    <h1 className={styles.headerTitle}>Ligas Recreativas UACH</h1>
                    <p className={styles.headerSubtitle}>
                        todas las ligas, equipos, resultados y fechas de enfrentamientos de las ligas recreativas de la Universidad Austral de Chile.
                    </p>
                </div>
                
                {/* --- CONTENEDOR DE LOS BOTONES DE DEPORTE --- */}
                <div className={styles.sportSelectorContainer}>
                    {ligasData.map((liga) => (
                        <Link 
                            key={liga.id} 
                            href={`/${liga.id}`} 
                            className={`${styles.sportSelectorItem} ${styles[`sportItem${liga.id}`]}`}
                            role="button"
                        >
                            <span className={styles.sportButtonText}>{liga.nombre}</span>
                        </Link>
                    ))}
                </div>
            </header>
        </main>
    );
}