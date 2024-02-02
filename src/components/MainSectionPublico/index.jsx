import styles from './MainSection.module.css'

function MainSectionPublico({ children }) {
    return (
        <section className={styles.container}>
            {children}
        </section>
    )
}

export default MainSectionPublico