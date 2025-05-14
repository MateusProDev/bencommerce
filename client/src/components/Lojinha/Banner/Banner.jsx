import React from "react";
import "./Banner";

const Banner = ({ banners }) => (
  <div className="lojinha-banner">
    {banners.map((img, idx) => (
      <img key={idx} src={img} alt={`Banner ${idx + 1}`} />
    ))}
  </div>
);

export default Banner;