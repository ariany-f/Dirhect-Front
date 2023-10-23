import styles from './ContainerPrincipal.module.css'

function ContainerPrincipal({ children }) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default ContainerPrincipal