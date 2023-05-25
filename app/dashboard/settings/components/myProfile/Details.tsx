import React from "react";

interface DetailsProps {
  data: any[];
}

const Details: React.FC<DetailsProps> = ({data}) => {
  return (
    <div className="flex flex-col pt-1 md:pt-2 text-dark dark:text-light">
      <div className="grid grid-cols-2">
        {data.map((item, index) => (
          <div key={item.id} className={`flex flex-col ${index > 1 ? "pt-1" : ""}`}>
            <p className="text-sm font-light">{item.label}</p>
            <p
              className={`font-medium ${
                item.label === "Email address" && "mr-1 overflow-hidden font-medium text-ellipsis"
              }`}
            >
              {item.value || "Undefined"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
