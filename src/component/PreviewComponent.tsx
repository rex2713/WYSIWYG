import DOMPurify from "dompurify";
import { ComponentData } from "../types/main";
import { useState } from "react";

// 動態元件
const PreviewComponent: React.FC<{
  data: ComponentData;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ data, onClick }) => {
  const [classes, setClasses] = useState<string>("");

  // 使用DOMPurify過濾HTML標籤(防止XSS攻擊)
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "a",
      "ul",
      "li",
      "ol",
      "code",
      "pre",
      "code",
      "div",
      "table",
      "td",
      "tr",
      "th",
    ],
    ALLOWED_ATTR: ["href", "target"],
  };
  const sanitizedHTML = DOMPurify.sanitize(data.props.value, sanitizeConfig);

  switch (data.type) {
    case "text":
      return (
        <button
          className={`py-2 px-4 w-full outline-none ${classes}`}
          onClick={(e) => {
            e.preventDefault();
            setClasses(
              "border relative border-main rounded-md after:bg-main after:top-0 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2 after:content-['文字元件'] after:absolute after:w-20 after-h-5 after:rounded-sm after:text-sm after:text-white"
            );
            onClick(e);
          }}
          onBlur={(e) => {
            setClasses("");
          }}
        >
          <div className="px-4 py-2 flex flex-col">
            <div
              onClick={(e) => e.stopPropagation()}
              className="textContent inline-block bg-black/5 w-full"
              dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            ></div>
            {data.props.value === "" && <span>文字元件</span>}
          </div>
        </button>
      );
    case "image":
      return (
        <button
          className={`w-full outline-none flex ${classes}`}
          style={{ justifyContent: data.props.imagePosition || "center" }}
          onClick={(e) => {
            e.preventDefault();
            setClasses(
              "border relative border-main rounded-md after:bg-main after:top-0 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2 after:content-['圖片元件'] after:absolute after:w-20 after-h-5 after:rounded-sm after:text-sm after:text-white"
            );
            onClick(e);
          }}
          onBlur={(e) => {
            e.preventDefault();
            setClasses("");
          }}
        >
          <img
            src={
              data.props.src ||
              "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            }
            alt={data.props.alt || "圖片敘述"}
            className={`cursor-pointer object-cover w-[500px]`}
            style={{
              width: data.props.width + "px",
              height: data.props.height + "px",
            }}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
          />
        </button>
      );
    case "carousel":
      const [currentIndex, setCurrentIndex] = useState(0);

      const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      };

      const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) =>
          Math.min(prevIndex + 1, data.props.images.length - 1)
        );
      };
      return (
        <button
          className={`w-full min-h-20 outline-none items-center flex justify-center ${classes}`}
          onClick={(e) => {
            e.preventDefault();
            setClasses(
              "border relative border-main rounded-md after:bg-main after:top-0 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2 after:content-['輪播元件'] after:absolute after:w-20 after-h-5 after:rounded-sm after:text-sm after:text-white"
            );
            onClick(e);
          }}
          onBlur={() => setClasses("")}
        >
          <div
            className="overflow-hidden relative w-[500px] h-[300px]"
            style={{
              width: data.props.width + "px",
              height: data.props.height + "px",
            }}
          >
            <div
              className="flex transition-transform duration-500 h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {data.props.images && data.props.images.length !== 0 ? (
                data.props.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    className="flex-shrink-0 w-[500px] h-[300px] object-cover"
                    style={{
                      width: data.props.width + "px",
                      height: data.props.height + "px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onClick(e);
                    }}
                  />
                ))
              ) : (
                <div className="text-black flex justify-center items-center h-full w-full">
                  輪播元件-請先新增圖片
                </div>
              )}
            </div>
            {data.props.images && data.props.images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 -translate-y-1/2 left-0 bg-black/50 text-white z-10 p-2 rounded-r"
                >
                  ❮
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 -translate-y-1/2 right-0 bg-black/50 text-white z-10 p-2 rounded-l"
                >
                  ❯
                </button>
              </>
            )}
          </div>
        </button>
      );
    default:
      return null;
  }
};

export default PreviewComponent;
