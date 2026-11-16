/// <reference types="vite/client" />

declare module 'lucide-react' {
  import type { SVGProps } from 'react'
  type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }
  type IconComponent = (props: IconProps) => JSX.Element
  export const AlertCircle: IconComponent
  export const ArrowDownWideNarrow: IconComponent
  export const Check: IconComponent
  export const CheckCircle2: IconComponent
  export const ClipboardList: IconComponent
  export const Clock3: IconComponent
  export const Filter: IconComponent
  export const LoaderCircle: IconComponent
  export const Plus: IconComponent
  export const RefreshCw: IconComponent
  export const Send: IconComponent
  export const X: IconComponent
}
