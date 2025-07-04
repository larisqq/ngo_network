import Slider from "react-slick";

interface Props {
  images: string[];
}

const GalleryCarousel: React.FC<Props> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={img}
            alt={`Gallery ${index + 1}`}
            className="gallery-image w-100"
            style={{
              borderRadius: "2px",
              height: "350px",
              width: "100%",
              maxWidth: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Overlay layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "3px",
              backgroundColor: "rgba(59, 177, 65, 0.25)", // semi-transparent black
              pointerEvents: "none",
              opacity: 0.011,
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default GalleryCarousel;
