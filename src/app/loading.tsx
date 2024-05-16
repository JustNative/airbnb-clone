import { Spinner } from '@/components/Spinner'

const loading = () => {
    return (
        <div className="flex justify-center items-center h-screen z-10">
            <Spinner />
        </div>
    )
}

export default loading