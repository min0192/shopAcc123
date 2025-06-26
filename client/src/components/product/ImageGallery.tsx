"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative w-full aspect-[16/9] cursor-pointer"
        onClick={() => setIsPreviewOpen(true)}
      >
        <Image
          src={selectedImage}
          alt={title}
          fill
          className="object-contain rounded-lg"
        />
      </div>

      {/* Thumbnail List with Navigation */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image: string, index: number) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 cursor-pointer border-2 rounded-md overflow-hidden ${
                selectedImage === image
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent   className="w-[80vw] h-[80vh] max-w-[80vw] max-h-[80vh] p-0">
          <DialogTitle>
            <VisuallyHidden>Preview image: {title}</VisuallyHidden>
          </DialogTitle>
          <div className="relative w-full h-[50vh]">
            <Image
              src={selectedImage}
              alt={title}
              fill
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
