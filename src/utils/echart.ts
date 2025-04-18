import * as echarts from 'echarts/core'

/** 
引入需要的图表，需要什么就加什么
*/
import { BarChart, LineChart, PieChart,MapChart } from 'echarts/charts'

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent
} from 'echarts/components'
// import chinaMap from "@/assets/china.json";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件，上面引入的都需要在此注册
echarts.use([
  ToolboxComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,  
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  VisualMapComponent
])
export const onLoadMap = async () => { 
  const chinaMap = await import('@/assets/china.json');
  echarts.registerMap('china', chinaMap.default as any)
}

// 导出
export default echarts

