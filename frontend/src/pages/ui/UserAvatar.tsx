import { Avatar } from "@mui/material"


const UserAvatar = ({ image, sx } : { image : Admin['image'] | Customer['image'], sx?: Object }) => {
    const avatar = typeof  image === 'object' &&  image !== null && 'imageUrl' in  image
                ?  image?.imageUrl
                    : typeof  image === 'string'
                    ? image
                : ''
    return (
        <Avatar src={avatar} sx={sx}/>
    )
}

export default UserAvatar