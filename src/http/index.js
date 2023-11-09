import axios from "axios"

const http = axios.create({
    baseURL: 'https://beta-aqbeneficios.aqbank.com.br/'
})

export default http