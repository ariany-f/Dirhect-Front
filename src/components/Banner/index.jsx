import imagem from './cartoes-plataforma.png'
import styles from './Banner.module.css'

function Banner() {
    return (
        <img className={styles.banner} src={imagem} alt="Imagem Cartões"/>
    )
}

export default Banner