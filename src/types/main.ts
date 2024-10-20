// 元件類型
type ComponentType = "text" | "image" | "carousel";

// append元件數據結構
interface ComponentData {
  type: ComponentType;
  props: Record<string, any>;
}

export type { ComponentData, ComponentType };
