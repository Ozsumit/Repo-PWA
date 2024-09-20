"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useState, useEffect } from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Iframe from "@/components/ui/iframe";
import { Breadcrumb } from "@/components/ui/breadcrumbs";
import Footer from "@/components/ui/footer";
const MyPage = () => {
  const [visibleLessons, setVisibleLessons] = useState<string | null>(null);
  const [currentIdentifier, setCurrentIdentifier] = useState<string>("default");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const toggleLessons = (subjectTitle: string) => {
    setVisibleLessons((currentVisible) =>
      currentVisible === subjectTitle ? null : subjectTitle
    );
  };

  const handleCardClick = (title: string) => {
    setCurrentIdentifier(title);
  };

  const items = [
    {
      title: "Class 9",
      description: "Unavailable!!",
      link: "##",
    },
    {
      title: "Class 10",
      description: "Available",
      link: "##",
    },
    {
      title: "Class 11",
      description: "Available",
      link: "##",
    },
    {
      title: "Class 12",
      description: "Unavailable!!",
      link: "##",
    },
  ];

  const lessons = [
    {
      title: "Unit 1",
      description: "Bir Purkha",
      link: "#pdf",
    },
    {
      title: "Unit 2",
      description: "Gaun Ko Maya",
      link: "#pdf",
    },
    {
      title: "Unit 3",
      description: "Sanskriti Ko Naya Yatra",
      link: "#pdf",
    },
    {
      title: "Unit 4 ",
      description: "Yogmaya",
      link: "#pdf",
    },
    {
      title: "Unit 5",
      description: "Sathilai Chhithi",
      link: "#pdf",
    },
    {
      title: "Unit 6",
      description: "Tyo Feri Farkela",
      link: "#pdf",
    },
    {
      title: "Unit 7",
      description: "Paryaparyatan Ka Sambhawana Ra Aayam",
      link: "#pdf",
    },
    {
      title: "Unit 8",
      description: "Lau Aayo Taja  Khabar",
      link: "#pdf",
    },
    {
      title: "Unit 9 ",
      description: "Safalata Ko Katha",
      link: "#pdf",
    },
    {
      title: "Unit 10",
      description: "Krishishalama Ek Din",
      link: "#pdf",
    },
  ];
  const pagination = [
    { label: "Home", href: "/" },
    { label: "Class 11", href: "/class11/" },
    { label: "Nepali", href: "/app/pages/class11/Nepali" },
  ];
  return (
    <main>
      <div className=" h-screen rounded-md bg-black flex flex-col w-auto lg:px-28 sm:px-4 pt-2">
        <div className="hero flex justify-center flex-col pt-16 w-auto">
          <Breadcrumb className=" z-10" items={pagination} />

          <ShootingStars />
          <StarsBackground />
          <HoverEffect
            items={items}
            className="hidden"
            onCardClick={handleCardClick}
          />
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-5xl">
              {[...Array(13)].map((_, index) => (
                <Skeleton
                  key={index}
                  height={150}
                  className="mb-4 rounded-7xl"
                  baseColor="#000000"
                  highlightColor="#383838"
                />
              ))}
            </div>
          ) : (
            <HoverEffect
              items={lessons}
              className="lesson"
              onCardClick={handleCardClick}
            />
          )}
          <div
            id="pdf"
            className="flex justify-center items-center my-16 rounded-4xl"
          >
            {isLoading ? (
              <Skeleton
                height={400}
                width="100%"
                className="mb-4 rounded-7xl"
                baseColor="#000000"
                highlightColor="#383838"
              />
            ) : (
              <Iframe identifier={currentIdentifier} />
            )}
          </div>
          <Footer items={lessons} />
        </div>
      </div>
    </main>
  );
};

export default MyPage;
