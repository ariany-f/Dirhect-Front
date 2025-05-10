import imagem from './background-dirhect.jpg'
import styles from './Banner.module.css'
import logo from '@imagens/logo.png'
import { RiShoppingCartFill, RiBusFill, RiTrophyFill, RiOpenArmFill } from 'react-icons/ri'
import { PiForkKnifeFill, PiFirstAidKitFill } from 'react-icons/pi'
import { BiSolidBook } from 'react-icons/bi'
import { CgPill } from 'react-icons/cg'
import { MdComputer } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useRef, useState } from 'react'

function BannerMini() {

    const [image, setImage] = useState(false)
    const [logotipo, setLogotipo] = useState(false)
    const ref = useRef(null)
    const refLogo = useRef(null)

    useEffect(() => {
        if(imagem){
            setImage(true)
        }
        if(logo){
            setLogotipo(true)
        }
    }, [imagem, logo])

    return (
        <div className={styles.container}>
           
           {image ?
                <img ref={ref} className={styles.banner} src={imagem} alt="Imagem"/>
                : <Skeleton variant="rectangular" width={300} height={980} />
            }
            <Link to="/login" className={styles.logo} >
                {logotipo ?
                    <img width="200" src={logo} ref={refLogo} alt="Logo"/>
                    : ''
                }
            </Link>
        </div>
    )
}

export default BannerMini