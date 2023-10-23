import styles from './SubTitulo.module.css'

function SubTitulo({ children }) {
    return (
        <div className={styles.texto}>
            <p>{children}</p>
        </div>
    )
}

export default SubTitulo