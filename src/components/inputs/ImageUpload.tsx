"use client"

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback } from 'react';
import { TbPhonePlus, TbPhotoPlus } from 'react-icons/tb';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {


  const handleUpload = useCallback((result: CloudinaryUploadWidgetResults | undefined) => {
    //@ts-ignore
    onChange(result?.info?.secure_url)
  }, [onChange])

  return (
    <CldUploadWidget
    onSuccess={(result, { widget }) => {
      handleUpload(result); // { public_id, secure_url, etc }
      widget.close();
    }}
      options={{
        maxFiles: 1
      }}
      uploadPreset='rpf3pou4'
    >
      {({ open }) => {
        function handleOnClick() {
          handleUpload(undefined);
          open?.();
        }
        return (
          <button
            onClick={handleOnClick}
            className='relative flex items-center justify-center gap-4 hover:opacity-70 transition rounded-xl border-dashed border-2 p-20 border-neutral-400 text-neutral-600'>
            <TbPhotoPlus size={40} />

            <div className='font-semibold text-lg'>
              Click to upload
            </div>

            {value && (
              <div className='absolute inset-0 w-full h-full'>
                <Image
                  alt='Upload'
                  src={value}
                  fill
                  className='object-cover rounded-xl'
                />
              </div>
            )}
          </button>
        );
      }}
    </CldUploadWidget>
  )
}

export default ImageUpload