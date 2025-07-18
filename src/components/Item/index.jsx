import styled from "styled-components"

const ListItem = styled.li`
    font-size: 12px;
`

function Item({ children, style }) {
    return (
        <ListItem style={style}>{children}</ListItem>
    )
}

export default Item