"use client";
import Image from "next/image";
import {useCallback} from "react";
import {CldUploadWidget} from "next-cloudinary";
import {TbPhotoPlus} from "react-icons/tb";
import {AiFillDelete} from "react-icons/ai";
declare global {
  var cloudinary: any;
}
interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  small?: Boolean;
}
const ImageUpload: React.FC<ImageUploadProps> = ({label, value, onChange, small}) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );
  const handleDelete = useCallback(() => {
    onChange("");
  }, [onChange]);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between">
        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900 ">
          {label}
        </label>
        {value && (
          <p onClick={handleDelete} className="cursor-pointer text-dark dark:text-light">
            <AiFillDelete />
          </p>
        )}
      </div>
      <CldUploadWidget onUpload={handleUpload} uploadPreset="jzzfccfq" options={{maxFiles: 1}}>
        {({open}) => {
          return (
            <div
              onClick={() => open?.()}
              className={`relative flex flex-col items-center justify-center gap-4 ${
                small ? "p-4" : "p-16"
              } transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600`}
            >
              <TbPhotoPlus size={50} />
              <div className="text-lg font-semibold">Click to upload</div>
              {value && (
                <div className="absolute inset-0 w-full h-full">
                  <Image alt="Upload" fill className="object-contain object-center" src={value} />
                </div>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
