"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Heart,
  Coffee,
  Laptop,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import DonationClicker from "@/components/ui/game";
// Updated Image Collage Component
const ImageCollage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const images = [
    "/images/cooked1.jpg",
    "/images/cooked2.jpg",
    "/images/cooked3.jpg",
    "/images/cooked4.jpg",
    "/images/cooked5.jpg",
    "/images/cooked6.jpg",
  ];

  const handlePrevious = () => {
    setSelectedImage((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : images.length - 1) : null
    );
  };

  const handleNext = () => {
    setSelectedImage((prev) =>
      prev !== null ? (prev < images.length - 1 ? prev + 1 : 0) : null
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={src}
              alt={`Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-4xl">
            <Image
              src={images[selectedImage]}
              alt={`Selected Image ${selectedImage + 1}`}
              width={800}
              height={600}
              objectFit="contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const DonatePage: React.FC = () => {
  const [showQR, setShowQR] = useState<boolean>(false);

  useEffect(() => {
    if (showQR) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showQR]);

  return (
    <div
      className={`min-h-screen bg-black text-white flex flex-col w-auto px-4 lg:px-28 pt-2 ${
        showQR ? "overflow-hidden" : ""
      }`}
    >
      <div
        className={`flex justify-center flex-col lg:pt-16 sm:pt-0 w-auto ${
          showQR ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-4xl md:text-6xl text-center font-bold mb-8 animate-pulse">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Support Our Cause
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="w-full backdrop-blur-md mb-4 border border-white/20 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="font-bold text-white text-2xl mb-4 flex items-center">
              <Laptop className="mr-2" /> Urgent Appeal
            </h3>
            <p className="text-pretty mb-6">
              Dear amazing supporters! My trusty laptop has decided to retire
              early, leaving me in a digital pickle. As I can't afford a new one
              right now, I'm reaching out to you wonderful folks for a helping
              hand. If you've enjoyed your time here or appreciate the work put
              into this site, consider contributing to help me get back on
              track. Your generosity, big or small, means the world to me! 🌟
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => setShowQR(true)}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <QrCode className="mr-2" />
                Donate with QR Code
              </button>
              <p className="text-sm italic">Current setup: Borrowed device</p>
            </div>
          </div>

          <ImageCollage />
        </div>

        <DonationClicker />

        {/* Ad Placeholder coponent remains unchanged */}
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg items-center justify-center flex flex-col max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Scan to Donate
            </h2>
            <div className="relative">
              <Image
                src="/images/qr.jpg"
                alt="QR Code"
                width={250}
                height={250}
                objectFit="cover"
                className="mx-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                <p className="text-white text-center p-4">
                  Thank you for your support!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
            <div className="mt-6 text-center">
              <p className="font-semibold">Alternative Contact:</p>
              <p>Phone: 9842134149</p>
              <p>Email: Pokhrelsumit36@gmail.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonatePage;
