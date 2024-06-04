import { Fragment, useEffect, useState } from "react";
import { OCRBox, Rectangle } from "../../types/ComputerVision";
import { ComputerVisionDto } from "../../types/Card";

type Props = {
  poolImageUrl: string;
  cvDto: ComputerVisionDto;
};

const OCRPoolImage = ({ poolImageUrl, cvDto }: Props) => {
  const [viewboxWidth, setViewboxWidth] = useState<number>(0);
  const [viewboxHeight, setViewboxHeight] = useState<number>(0);
  const [ocrBoxes, setOcrBoxes] = useState<OCRBox[]>([]);

  useEffect(() => {
    if (cvDto) {
      generateBoxes(cvDto);
    }
  }, [cvDto]);

  const generateBoxes = async (dto: ComputerVisionDto) => {
    if (dto.imageHeight && dto.imageWidth) {
      setViewboxWidth(dto.imageWidth);
      setViewboxHeight(dto.imageHeight);
    }
    const rects: Rectangle[] = [];
    const ocr: OCRBox[] = [];
    for (const obj of dto.cvCards) {
      let x, y, width, height;
      // in order to handle landscape and portrait images, set width/height according to the larger of two options
      if (
        obj.polygon[1].x - obj.polygon[0].x >
        obj.polygon[0].x - obj.polygon[3].x
      ) {
        width = obj.polygon[1].x - obj.polygon[0].x;
      } else {
        width = obj.polygon[0].x - obj.polygon[3].x;
      }
      if (
        obj.polygon[3].y - obj.polygon[0].y >
        obj.polygon[1].y - obj.polygon[0].y
      ) {
        height = obj.polygon[3].y - obj.polygon[0].y;
      } else {
        height = obj.polygon[1].y - obj.polygon[0].y;
      }
      // use width:height ratio to determine if text in image is vertical (if) or horizontal (else)
      if (width > height) {
        x = obj.polygon[0].x;
        y = obj.polygon[0].y;
      } else {
        x = obj.polygon[3].x;
        y = obj.polygon[3].y;
      }
      const rect: Rectangle = {
        x: x,
        y: y,
        width: width,
        height: height,
        match: obj.matchFound,
      };
      if (rect.width > 0 && rect.height > 0) {
        if (obj.listedCard) {
          ocr.push({ rectangle: rect, text: obj.listedCard.card.name });
        } else {
          ocr.push({ rectangle: rect, text: obj.text });
        }
        rects.push(rect);
      }
    }
    setOcrBoxes(ocr);
  };

  return (
    <div className="pool-wrapper">
      <img src={poolImageUrl} draggable="false" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={"0, 0," + viewboxWidth + ", " + viewboxHeight}
        preserveAspectRatio="xMinYMin meet"
      >
        {ocrBoxes.map((box, index) => (
          <Fragment key={index}>
            <rect
              key={index + "-r"}
              x={box.rectangle.x}
              y={box.rectangle.y}
              width={box.rectangle.width}
              height={box.rectangle.height}
              className={box.rectangle.match ? "is-match" : "not-match"}
            />
            <text
              key={index + "-t"}
              x={box.rectangle.x}
              y={
                box.rectangle.width > box.rectangle.height
                  ? box.rectangle.y + box.rectangle.height
                  : box.rectangle.y
              }
              transform={
                box.rectangle.width > box.rectangle.height
                  ? ""
                  : "rotate(90, " +
                    box.rectangle.x +
                    ", " +
                    box.rectangle.y +
                    ")"
              }
            >
              {box.text}
            </text>
          </Fragment>
        ))}
      </svg>
    </div>
  );
};

export default OCRPoolImage;
