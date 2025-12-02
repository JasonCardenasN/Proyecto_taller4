// components/SportSection.js
import Image from 'next/image';
import styles from '../app/page.module.css'; 
import Link from 'next/link';

export default function SportSection({ 
    sportName, 
    imageSrc, 
    imageAlt, 
    sectionClass, 
    buttonClass 
}) {
  return (
    <section className={`${styles.sportSection} ${sectionClass}`}>
        {/* Puntos Izquierda */}
        <div className={styles.pointsContainer}>
            {[...Array(4)].map((_, index) => (
                <div key={index} className={styles.point}></div>
            ))}
        </div>
        
        {/* Cancha y Botón */}
        <div className={styles.courtContainer}>
            <Image 
                src={imageSrc} 
                alt={imageAlt} 
                width={400} 
                height={180} 
                className={styles.courtImage} 
                sizes="(max-width: 768px) 90vw, 400px"
                priority={false}
            />
            <Link 
                href={`/${sportName.toLowerCase()}/partidos`} 
                className={styles.matchesButton}
            >
                Partidos y Resultados
            </Link>
        </div>
        
        {/* Puntos Derecha */}
        <div className={styles.pointsContainer}>
            {[...Array(4)].map((_, index) => (
                <div key={index + 4} className={styles.point}></div>
            ))}
        </div>
    </section>
  );
}