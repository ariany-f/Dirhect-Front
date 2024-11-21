import '@components/BadgeStatusBalance/BadgeStatusBalance.css'

const statuses = [
    {
        "id": 1,
        "name": "Aprovado",
        "className": "green"
    },
    {
        "id": 12,
        "name": "Aguardando pagamento",
        "className": "yellow"
    },
    {
        "id": 3,
        "name": "Cancelado",
        "className": "red"
    },
]

function BadgeStatusBalance({ status }) {
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

export default BadgeStatusBalance