"use client"

import React, { useCallback, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import useRegisterModal from '@/hooks/useRegisterModal'
import useLoginModal from '@/hooks/useLoginModal'
import { User } from '@prisma/client'
import { onSignOutUser } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import useRentModal from '@/hooks/useRentModal'

interface UserMenuProps {
    currentUser?: User | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();

    

    const toggleOpen = useCallback(() => {
        setIsOpen(!isOpen)
    }, [isOpen])

    const signOutAction = useCallback(async () => {
        try {
            await onSignOutUser();
        } catch (error) {
            console.log('Error signing out', error)

        } finally {
            setIsOpen(false);
            router.refresh();
        }
    }, [router])

    const onRent = useCallback(() => {
        if (!currentUser) return loginModal.onOpen();

        isOpen && setIsOpen(false);
        rentModal.onOpen();

    }, [loginModal, rentModal, currentUser, isOpen])

    return (
        <div className='relative'>
            <div className='flex items-center gap-3'>
                <div
                    onClick={onRent}
                    className='hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer'>
                    Airbnb your home
                </div>

                <div
                    onClick={toggleOpen}
                    className='flex items-center gap-3 p-4 md:py-1 md:px-2 border border-neutral-200 rounded-full cursor-pointer hover:shadow-md transition'>
                    <AiOutlineMenu size={18} />

                    <div className='hidden md:block'>
                        <Avatar currentUser={currentUser} />

                    </div>
                </div>
            </div>

            {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-14 md:top-12 text-sm'>
                    <div className='flex flex-col cursor-pointer'>
                        {
                            currentUser
                                ? (
                                    <>
                                        <MenuItem
                                            onClick={() => { }}
                                            label='My trips'
                                        />

                                        <MenuItem
                                            onClick={() => { }}
                                            label='My favorites'
                                        />

                                        <MenuItem
                                            onClick={() => { }}
                                            label='My reservations'
                                        />

                                        <MenuItem
                                            onClick={() => { }}
                                            label='My properties'
                                        />

                                        <MenuItem
                                            onClick={onRent}
                                            label='Airbnb my home'
                                        />

                                        <hr />

                                        <MenuItem
                                            onClick={signOutAction}
                                            label='Logout'
                                        />

                                    </>
                                )
                                : (
                                    <>
                                        <MenuItem
                                            onClick={() => {
                                                setIsOpen(false);
                                                loginModal.onOpen()
                                            }}
                                            label='Login'
                                        />

                                        <MenuItem
                                            onClick={() => {
                                                setIsOpen(false);
                                                registerModal.onOpen()
                                            }}
                                            label='Sign up'
                                        />
                                    </>
                                )
                        }

                    </div>

                </div>
            )}

        </div>
    )
}

export default UserMenu