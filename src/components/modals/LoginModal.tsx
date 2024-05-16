"use client"


import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { onLoginUser, onSignInGithubUser, onSignInGoogleUser } from "@/actions/auth";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import RegisterModal from "./RegisterModal";
import useRegisterModal from "@/hooks/useRegisterModal";


const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const loginWithGoogle = useCallback(async () => {
        try {
            await onSignInGoogleUser();
        } catch (error) {
            console.log('Error signing out', error)
        }
    }, [])

    const loginWithGithub = useCallback(async () => {
        try {
            await onSignInGithubUser();
        } catch (error) {
            console.log('Error signing out', error)
        }
    }, [])

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {

            await onLoginUser(
                data.email,
                data.password
            )

            router.refresh();

            loginModal.onClose();
            toast.success("Login Successfully")

        } catch (error: any) {
            // console.log(error);
            toast.error(error.message)
        }

    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])


    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to Airbnb"
            />

            <Input
                id="email"
                label="Email"
                disabled={isSubmitting}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="password"
                label="Password"
                disabled={isSubmitting}
                register={register}
                errors={errors}
                required
                type="password"
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />

            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={loginWithGoogle}
            />

            <Button
                outline
                label="Continue with Github"
                icon={FaGithub}
                onClick={loginWithGithub}
            />

            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex items-center justify-center gap-2">
                    <div>
                        First time using Airbnb?
                    </div>

                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Sign up
                    </div>
                </div>
            </div>
        </div>
    )


    return (
        <Modal
            isOpen={loginModal.isOpen}
            disabled={isSubmitting}
            title="Log in or sign up"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal