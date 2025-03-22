import { Carousel } from "antd";

const CustomCarousel = () => {
  const contentStyle: React.CSSProperties = {
    height: "200px",
    color: "#fff",
    lineHeight: "200px",
    textAlign: "center",
    background: "#364d79",
  };

  const data = [
    { label: "Slide 1", value: 1 },
    { label: "Slide 2", value: 2 },
    { label: "Slide 3", value: 3 },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="w-2/3 h-auto">
        <Carousel arrows className="rounded-lg shadow-lg overflow-hidden">
          {data.map((item) => (
            <div key={item.value}>
              <h3 style={contentStyle}>{item.label}</h3>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CustomCarousel;
