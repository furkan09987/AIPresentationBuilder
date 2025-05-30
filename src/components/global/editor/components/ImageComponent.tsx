import React from "react";
import Image from "next/image";
import premium from "@/assets/premium.png";
import UploadImage from "./UploadImage";

type Props = {
  src: string;
  alt: string;
  className?: string;
  isPreview?: boolean;
  contentId: string;
  onContentChange: (contentId: string, newContent: string | string[] | string[][]) => void;
  isEditable?: boolean;
};

const CustomImage = ({
  src,
  alt,
  className,
  isPreview = false,
  contentId,
  onContentChange,
  isEditable = true,
}: Props) => {
  //WIP: ADD OPEN AI IMAGE
  return (
    <div className={`relative group w=full h=full rounded-lg`}>
      <Image
        src={premium}
        width={isPreview ? 48 : 800}
        height={isPreview ? 48 : 800}
        alt={alt}
        className={`object=cover w=full h=full rounded-lg $
    {className}`}
      />

      {!isPreview && isEditable && (
        <div
          className="absolute top-0 left-0 hidden
    group-hover:block"
        >
          <UploadImage contentId={contentId} onContentChange={onContentChange} />
        </div>
      )}
    </div>
  );
};

export default CustomImage;
