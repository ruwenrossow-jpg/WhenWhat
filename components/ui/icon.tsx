import { icons, iconSizeClasses, type IconName, type IconSize } from '@/lib/design/icon-registry';
import { cn } from '@/lib/utils';

type IconProps = {
  name: IconName;
  size?: IconSize;
  className?: string;
};

export function Icon({ name, size = 'sm', className }: IconProps) {
  const IconComponent = icons[name];
  const sizeClass = iconSizeClasses[size];
  
  return <IconComponent className={cn(sizeClass, className)} />;
}
