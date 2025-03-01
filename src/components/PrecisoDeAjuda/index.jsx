import { Link } from "react-router-dom"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import styles from './PrecisoDeAjuda.module.css'
import { AiOutlineQuestionCircle } from "react-icons/ai"

function PrecisoDeAjuda() {
    return (
        <Frame alinhamento="center">
            <Link className={styles.link} to="/help">
                <Texto weight="800">
                    <AiOutlineQuestionCircle size={18} />
                    &nbsp;Preciso de ajuda
                </Texto>
            </Link>
        </Frame>
    )
}

export default PrecisoDeAjuda