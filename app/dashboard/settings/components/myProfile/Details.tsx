import React from "react";

interface DetailsProps {
  data: any[];
}

const Details: React.FC<DetailsProps> = ({data}) => {
  return (
    <div className="flex flex-col pt-3 md:pt-6 text-dark dark:text-light ">
      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          <p className="text-sm font-light">{data[0].label}</p>
          <p className="font-medium">{data[0].value}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-light">{data[1].label}</p>
          <p className="font-medium">{data[1].value}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 pt-2">
        <div className="flex flex-col">
          <p className="text-sm font-light">{data[2].label}</p>
          <p className="mr-1 overflow-hidden font-medium text-ellipsis">{data[2].value}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-light">{data[3].label}</p>
          <p className="font-medium">{data[3].value}</p>
        </div>
      </div>
    </div>
  );
};

export default Details;
