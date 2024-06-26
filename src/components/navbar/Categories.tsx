"use client"

import Container from '../Container'
import { TbBeach, TbMountain } from 'react-icons/tb'
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiVanillaFlower, GiWindmill } from 'react-icons/gi'
import CategoryBox from './CategoryBox'
import { usePathname, useSearchParams } from 'next/navigation'
import { FaSkiing } from 'react-icons/fa'
import { BsSnow } from 'react-icons/bs'
import { IoDiamond } from 'react-icons/io5'


export const categories = [
    { label: 'Beach', icon: TbBeach, description: 'This property is close to the beach!' },
    { label: 'Windmills', icon: GiWindmill, description: 'This property has windmills!' },
    { label: 'Modern', icon: GiVanillaFlower, description: 'This property has modern!' },
    { label: 'Countryside', icon: TbMountain, description: 'This property is in the countryside!' },
    { label: 'Pools', icon: TbMountain, description: 'This property has pools!' },
    { label: 'Islands', icon: GiIsland, description: 'This property is in an islands!' },
    { label: 'Lake', icon: GiBoatFishing, description: 'This property is close to a lake!' },
    { label: 'Skiing', icon: FaSkiing, description: 'This property has skiing activities!' },
    { label: 'Castles', icon: GiCastle, description: 'This property is in a castle!' },
    { label: 'Camping', icon: GiForestCamp, description: 'This property is camping activities!' },
    { label: 'Arctic', icon: BsSnow, description: 'This property is arctic activities!' },
    { label: 'Cave', icon: GiCaveEntrance, description: 'This property is in a cave!' },
    { label: 'Desert', icon: GiCactus, description: 'This property is in the desert!' },
    { label: 'Barns', icon: GiBarn, description: 'This property is in the barn!' },
    { label: 'Lux', icon: IoDiamond, description: 'This property is luxurious!' }
]


const Categories = () => {
    const params = useSearchParams();
    const pathname = usePathname();

    const isMainPage = pathname === '/';

    if (!isMainPage) return null;


    return (
        <Container>
            <div className='flex items-center justify-between pt-4 overflow-x-auto'>
                {categories.map((categorie) => (
                    <CategoryBox
                        key={categorie.label}
                        label={categorie.label}
                        selected={categorie.label === params?.get('category') || false}
                    >
                        <categorie.icon size={26} />
                    </CategoryBox>

                ))}
            </div>
        </Container>
    )
}

export default Categories