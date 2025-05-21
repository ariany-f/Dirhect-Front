import styles from './MainSection.module.css'

function MainSectionPublico({ children }) {
    return (
        <section className={styles.container} onClick={aoClicar}>
            {children}
        </section>
    )
}

export default MainSectionPublico