"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./speakers.css";

// Asset imports
import maskCorner from "../../../public/images/Maskgroup.png";
import speaker1 from "../../../public/images/speakerDummy.jpg";

const speakersData = Array(6).fill({
  name: "DR. RAKESH SHARMA",
  title: "ELDER SPEAKER",
  description: "A GUIDE OF MANY PATHS, KNOWN FOR SHAPING MINDS AND IGNITING IDEAS.",
  tags: ["INNOVATION", "INNOVATION", "INNOVATION"],
  image: speaker1,
});

export default function Speakers() {
  return (
    <div className="speakers-section">
      {/* HEADER SECTION */}
      <SectionHeading
        title="JUDGES &"
        highlight="MENTORS"
        highlightPosition="after"
        description="The ancients of the hollow. Shaped by the depths — here to guide you through yours."
      />

      {/* SLIDER SECTION */}
      <div className="slider-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          grabCursor={true}
          navigation={{
            nextEl: ".nav-btn.next",
            prevEl: ".nav-btn.prev",
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          breakpoints={{
            640: { slidesPerView: 1.5, centeredSlides: true },
            1024: { slidesPerView: 2.5, centeredSlides: false },
            1280: { slidesPerView: 3, centeredSlides: false },
          }}
          className="speaker-swiper"
        >
          {speakersData.map((person, index) => (
            <SwiperSlide key={index} className="speaker-slide">
              <div className="speaker-card">
                <div className="relative">
                  <Image src={maskCorner.src} fill alt="" className="card-corner top-l" />
                </div>
                <div className="relative">
                  <Image src={maskCorner.src} fill alt="" className="card-corner bottom-r" />
                </div>

                <div className="avatar-wrapper">
                  <div className="glow-effect"></div>
                  <div className="image-border">
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={160}
                      height={160}
                      className="avatar-img"
                    />
                  </div>
                </div>

                <h3 className="cinzel-font card-name">{person.name}</h3>
                <p className="cinzel-font card-title">{person.title}</p>

                <div className="divider">
                  <div className="line l"></div>
                  <div className="diamond"></div>
                  <div className="line r"></div>
                </div>

                <p className="cinzel-font card-desc">{person.description}</p>

                <div className="tag-list">
                    {person.tags.map((tag: string, i: number) => (
                    <span key={i} className="tag-pill">{tag}</span>
                    ))}
                </div>

                <button className="cinzel-font view-btn">View Entry</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* COMBINED CONTROLS FOR MOBILE & DESKTOP */}
        <div className="swiper-controls-wrapper">
          <button className="nav-btn prev">‹</button>
          <div className="custom-pagination"></div>
          <button className="nav-btn next">›</button>
        </div>
      </div>
    </div>
  );
}