'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css'; 

// Datos de los enlaces de navegación
const navItems = [
    { name: 'Portada', href: '' },
    { name: 'Ligas', href: '/ligas' }, 
    { name: 'Resultados', href: '/resultados' },
    { name: 'Equipos', href: '/equipos' },
];

export default function SportSubNav({ sportNameId, sportDisplayName }) {
    const isLigasOpen = false; 
    const currentLigas = []; 

    return (
        <nav className={styles.subNavContainer}>
            <div className={styles.subNavHeader}>
                <span className={styles.subNavIcon}>{sportNameId === 'futbol' ? '⚽' : sportNameId === 'voleibol' ? '🏐' : '🏀'}</span>
                <span className={styles.subNavSportName}>{sportDisplayName}</span>
            </div>
            
            <div className={styles.subNavLinks}>
                {navItems.map((item) => (
                    <div 
                        key={item.name} 
                        className={styles.navItemWrapper}
                    
                    >
                        <Link 
                            href={`/${sportNameId}${item.href}`} 
                            className={`${styles.navItem} ${item.name === 'Portada' ? styles.activeNavItem : ''}`} 
                        >
                            {item.name}
                        </Link>

                    </div>
                ))}
            </div>
        </nav>
    );
}