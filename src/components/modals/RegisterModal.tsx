"use client"

import useRegisterModal from "@/hooks/useRegisterModal"
import Modal from "./Modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { UserRegistrationAction, onSignInGithubUser, onSignInGoogleUser } from "@/actions/auth";
import { useCallback } from "react";
import useLoginModal from "@/hooks/useLoginModal";


const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
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

            //TODO Register Form
            const registered = await UserRegistrationAction(
                data.name,
                data.email,
                data.password
            )

            console.log("registered: ", registered)

            toast.success("Registered Successfully")

        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        } finally {
            registerModal.onClose();
        }

    }

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to Airbnb"
                subtitle="Create an account!"
            />

            <Input
                id="name"
                label="Name"
                disabled={isSubmitting}
                register={register}
                errors={errors}
                required
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
                        Already have an account?
                    </div>

                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )


    return (
        <Modal
            isOpen={registerModal.isOpen}
            disabled={isSubmitting}
            title="Log in or sign up"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal