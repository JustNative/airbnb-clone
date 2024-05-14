import { User } from '@prisma/client';
import Image from 'next/image'

interface AvatarProps {
    currentUser?: User | null;
}

const Avatar: React.FC<AvatarProps> = ({ currentUser }) => {

    return (
        <Image
            className='rounded-full'
            height={30}
            width={30}
            alt='Avatar'
            src={currentUser?.image || '/images/placeholder.png'}

        />
    )
}

export default Avatar