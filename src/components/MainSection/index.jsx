import styles from './MainSection.module.css'

function MainSection({ children }) {
    return (
        <section className={styles.container}>
            {children}
        </section>
    )
}

export default MainSection