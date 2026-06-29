import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { IconButton } from '@material-ui/core';

const MyCarousel = ({ images }) => (
  <div className="sm:w-[500px] w-full h-[250px] flex justify-center items-center pt-4">
    <Carousel
      autoPlay
      infiniteLoop
      interval={2000} // Duration for each slide
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={onClickHandler}
            className="!absolute top-2/4 left-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </IconButton>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={onClickHandler}
            className="!absolute top-2/4 right-4 -translate-y-2/4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </IconButton>
        )
      }
    >
      {images.map((image, index) => (
        <div key={index} className="relative w-full h-full">
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="object-cover w-full h-full"
            width={500}
            height={250}
          />
        </div>
      ))}
    </Carousel>
  </div>
);

export default MyCarousel;
