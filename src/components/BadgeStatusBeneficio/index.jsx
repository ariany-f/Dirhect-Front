import '@components/BadgeStatusBeneficio/BadgeStatusBeneficio.css'

const statuses = [
    {
        "id": 1,
        "name": "Aprovado",
        "className": "green"
    },
    {
        "id": 2,
        "name": "Aguardando pagamento",
        "className": "yellow"
    },
    {
        "id": 3,
        "name": "Cancelado",
        "className": "red"
    },
]

function BadgeStatusBeneficio({ status }) {
    return (
        statuses.map(item => {
            if(item.id == status)
            {
                return (
                    <div key={item.id} className={item.className}>
                        <p>{item.name}</p>
                    </div>
                )
            }
        })
    )
}

export default BadgeStatusBeneficio