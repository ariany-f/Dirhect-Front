import DepartamentoCard from '@components/DepartamentoCard';
import departments from '@json/departments.json'

function Departamentos() {
    return (
        <>
            {departments.map(department => {
                return (
                   <DepartamentoCard key={department.public_id} department={department}/>
                )
            })}
        </>
    )
}

export default Departamentos