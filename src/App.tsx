import React, { useRef, useState } from "react";
import "./assets/scss/main.scss";
import { ComponentType, ComponentData } from "./types/main";
import EditComponent from "./component/EditComponent";
import PreviewComponent from "./component/PreviewComponent";

function App() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [draggingComponentType, setDraggingComponentType] =
    useState<ComponentType | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState<"preview" | "edit" | null>(null);

  const handleDragStart = (type: ComponentType) => {
    setDraggingComponentType(type);
  };

  const handleDragOverPreview = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver("preview");
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
    setIsDragOver(null);
  };

  return (
    <div className="flex h-full">
      <div
        className={`drop-shadow-sm shadow-xl w-1/4 h-screen p-8 flex flex-col gap-y-5 items-center pb-20 fixed ${
          isDragOver === "edit" && "bg-main/10"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver("edit");
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(null);
        }}
        onDragLeave={() => {
          setIsDragOver(null);
        }}
      >
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
        className={`bg-white h-full flex flex-col items-center w-3/4 ml-auto min-h-screen ${
          isDragOver === "preview" && "bg-main/40"
        }`}
        onDragOver={handleDragOverPreview}
        onDrop={handleDrop}
        onDragLeave={() => setIsDragOver(null)}
      >
        <span className="text-center w-full shadow-2xl text-black/60 border-b bg-white border-black/10 py-1">
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
