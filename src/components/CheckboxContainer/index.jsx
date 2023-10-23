import Texto from "../Texto";
import styles from './CheckboxContainer.module.css'

function CheckboxContainer() {
    return (
        <div className={styles.checkboxContainer}>
            <input type="checkbox"></input>
            <Texto weight="800">Lembrar de mim</Texto>
        </div>
    )
}

export default CheckboxContainer