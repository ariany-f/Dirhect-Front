import styles from './MainContainer.module.css'

function MainContainer({ children }) {
    return (
        <div className={styles.main}>
            {children}
        </div>
    )
}

export default MainContainer