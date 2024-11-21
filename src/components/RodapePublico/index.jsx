import { Link } from 'react-router-dom'
import styles from './RodapePublico.module.css'
import logotransparent from './logo-transparent.png'

function RodapePublico() {
    return (
        <footer className={styles.footer}>
            <img src={logotransparent}></img>
            <Link className={styles.link}>Termos de uso</Link>
            <Link className={styles.link}>Política de privacidade</Link>
        </footer>
    )
}

export default RodapePublico