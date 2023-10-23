import styled from "styled-components"

const ListItem = styled.li`
    font-size: 12px;
`

function Item({ children }) {
    return (
        <ListItem>{children}</ListItem>
    )
}

export default Item