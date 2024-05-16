"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import qs from 'query-string'

interface CategorieBoxProps {
    label: string;
    children: React.ReactNode;
    selected?: boolean
}

const CategoryBox: React.FC<CategorieBoxProps> = ({
    label,
    children,
    selected = false
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        const updateQuery: any = {
            ...currentQuery,
            category: label
        }

        if (params?.get('category') === label) {
            delete updateQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updateQuery
        }, {
            skipNull: true
        })

        router.push(url);

    }, [label, params, router])


    return (
        <div
            onClick={handleClick}
            className={`flex flex-col items-center gap-2 p-3 border-b-2 hover:text-neutral-800 
                         transition cursor-pointer
                        ${selected
                    ? 'border-b-neutral-800 text-neutral-800'
                    : 'border-transparent text-neutral-500 hover:border-b-neutral-300'}
             `}>

            {children}
            <div className="font-medium text-sm">
                {label}
            </div>
        </div>
    )
}

export default CategoryBox