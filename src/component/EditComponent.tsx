import { ComponentData } from "../types/main";

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

export default EditComponent;
