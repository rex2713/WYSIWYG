import React, { useRef, useState } from "react";
import "./assets/scss/main.scss";
import DOMPurify from "dompurify";

// 元件類型
type ComponentType = "text" | "image" | "carousel";

// append元件數據結構
interface ComponentData {
  type: ComponentType;
  props: Record<string, any>;
}

// 動態元件
// Todo: 處理XSS攻擊（dangerouslySetInnerHTML）
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

// 編輯元件
const EditComponent: React.FC<{
  type: "text" | "image" | "carousel";
  component: ComponentData;
  editingIndex: number;
  setComponent: (component: ComponentData) => void;
}> = ({ type, component, setComponent }) => {
  switch (type) {
    case "text":
      return (
        <div className="bg-white p-4 flex flex-col gap-2 rounded-md border border-title">
          <span>
            請輸入想顯示的內容
            <br />
            <span className="text-[12px] text-black">(支援HTML標籤)</span>
          </span>
          <textarea
            className="outline-none border min-h-80 h-full border-black/50 rounded-md px-2 py-1"
            value={component.props.value || ""}
            onChange={(e) => {
              component.props.value = e.target.value;
              setComponent(component);
            }}
          />
        </div>
      );
    case "image":
      return (
        <div className="bg-white p-4 flex flex-col gap-5 rounded-md border border-title">
          <div className="flex flex-col gap-y-1">
            <span>請輸入圖片連結</span>
            <input
              type="text"
              placeholder="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="outline-none border border-black/50 rounded-md px-2 py-1"
              value={component.props.src || ""}
              onChange={(e) => {
                component.props.src = e.target.value;
                setComponent(component);
              }}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <span>請輸入圖片描述</span>
            <input
              type="text"
              placeholder="請輸入描述訊息"
              className="outline-none border border-black/50 rounded-md px-2 py-1"
              value={component.props.alt || ""}
              onChange={(e) => {
                component.props.alt = e.target.value;
                setComponent(component);
              }}
            />
            <span className="text-[12px] text-black self-end">
              (僅連結失效時使用)
            </span>
          </div>
          <div className="flex gap-x-2">
            <span className="text-nowrap">圖片寬度</span>
            <input
              className="outline-none pl-2 border min-w-0 border-black/50 rounded-md"
              type="number"
              value={component.props.width || ""}
              onChange={(e) => {
                component.props.width = e.target.value;
                setComponent(component);
              }}
            />
            <span>px</span>
          </div>
          <div className="flex gap-x-2">
            <span className="text-nowrap">圖片高度</span>
            <input
              className="outline-none pl-2 border min-w-0 border-black/50 rounded-md"
              type="number"
              value={component.props.height || ""}
              onChange={(e) => {
                component.props.height = e.target.value;
                setComponent(component);
              }}
            />
            <span>px</span>
          </div>
          <div className="flex justify-between">
            <label className="flex gap-x-1">
              <input
                onChange={(e) => {
                  component.props.imagePosition = "start";
                  setComponent(component);
                }}
                name="imagePosition"
                value={component.props.imagePosition}
                type="radio"
              />
              <span>左</span>
            </label>
            <label className="flex gap-x-1">
              <input
                defaultChecked
                onChange={(e) => {
                  component.props.imagePosition = "center";
                  setComponent(component);
                }}
                name="imagePosition"
                value={component.props.imagePosition}
                type="radio"
              />
              <span>中</span>
            </label>
            <label className="flex gap-x-1">
              <input
                onChange={(e) => {
                  component.props.imagePosition = "end";
                  setComponent(component);
                }}
                name="imagePosition"
                value={component.props.imagePosition}
                type="radio"
              />
              <span>右</span>
            </label>
          </div>
        </div>
      );
    case "carousel":
      component.props.images = component.props.images || [];
      return (
        <div className="bg-white p-4 flex flex-col gap-5 rounded-md border border-title">
          <div className="flex flex-col gap-y-2">
            <span>請輸入圖片連結</span>
            {component.props.images.map((image: string, index: number) => (
              <input
                key={index}
                type="text"
                className="outline-none border border-black/50 rounded-md px-2 py-1"
                value={image}
                onChange={(e) => {
                  component.props.images[index] = e.target.value;
                  setComponent(component);
                }}
              />
            ))}
            <button
              className="bg-title rounded-md text-white text-sm px-2 py-1"
              onClick={() => {
                const newImages = [...component.props.images, ""];
                setComponent({
                  ...component,
                  props: { ...component.props, images: newImages },
                });
              }}
            >
              新增圖片
            </button>
          </div>
          <div className="flex gap-x-2">
            <span className="text-nowrap">圖片寬度</span>
            <input
              className="outline-none pl-2 border min-w-0 border-black/50 rounded-md"
              type="number"
              value={component.props.width || ""}
              onChange={(e) => {
                component.props.width = e.target.value;
                setComponent(component);
              }}
            />
            <span>px</span>
          </div>
          <div className="flex gap-x-2">
            <span className="text-nowrap">圖片高度</span>
            <input
              className="outline-none pl-2 border min-w-0 border-black/50 rounded-md"
              type="number"
              value={component.props.height || ""}
              onChange={(e) => {
                component.props.height = e.target.value;
                setComponent(component);
              }}
            />
            <span>px</span>
          </div>
        </div>
      );
  }
};

function App() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [draggingComponentType, setDraggingComponentType] =
    useState<ComponentType | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (type: ComponentType) => {
    setDraggingComponentType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingComponentType && previewRef.current) {
      const newComponent: ComponentData = {
        type: draggingComponentType,
        props: {
          value: "",
        },
      };
      setComponents([...components, newComponent]);
    }
    setDraggingComponentType(null);
  };

  return (
    <div className="flex h-screen">
      <div className="drop-shadow-sm shadow-xl w-1/4 h-full p-8 flex flex-col gap-y-5 items-center pb-20">
        {editingIndex === -1 ? (
          <>
            <span className="text-xl font-medium text-title">元件列表</span>
            <div
              draggable
              onDragStart={() => handleDragStart("text")}
              className="bg-main text-white rounded-md px-4 py-2 cursor-move"
            >
              文字元件
            </div>
            <div
              draggable
              onDragStart={() => handleDragStart("image")}
              className="bg-main text-white rounded-md px-4 py-2 cursor-move"
            >
              圖片元件
            </div>
            <div
              draggable
              onDragStart={() => handleDragStart("carousel")}
              className="bg-main text-white rounded-md px-4 py-2 cursor-move"
            >
              輪播元件
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-y-5 w-full">
            <span className="text-xl font-medium text-title">內容編輯</span>
            <EditComponent
              type={components[editingIndex].type}
              component={components[editingIndex]}
              editingIndex={editingIndex}
              setComponent={(component: ComponentData) =>
                setComponents([
                  ...components.slice(0, editingIndex),
                  component,
                  ...components.slice(editingIndex + 1),
                ])
              }
            />
          </div>
        )}
        <button
          onClick={() => setEditingIndex(-1)}
          className="bg-main text-white rounded-md px-4 py-2 mt-auto"
        >
          回到元件列表
        </button>
      </div>
      <div
        ref={previewRef}
        className="bg-white flex-1 h-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <span className="text-center w-full shadow-2xl text-black/50 border-b border-black/10 py-1">
          預覽頁面
        </span>
        {components.map((component, index) => (
          <div key={index} className="w-full">
            <PreviewComponent
              data={component}
              onClick={() => {
                setEditingIndex(index);
                //如果是文字元件，則autofocus到文字輸入框
                // if (textEditRef.current && component.type === "text")
                //   textEditRef.current.focus();
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
