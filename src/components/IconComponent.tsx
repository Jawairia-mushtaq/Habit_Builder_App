/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Lucide from 'lucide-react';

interface IconComponentProps {
  name: string;
  className?: string;
  size?: number;
}

export default function IconComponent({ name, className = '', size = 20 }: IconComponentProps) {
  // Cast icon names safely from the Lucide module imports
  const Component = (Lucide as any)[name];
  
  if (!Component) {
    // Fallback icon if not found
    return <Lucide.HelpCircle className={className} size={size} />;
  }
  
  return <Component className={className} size={size} />;
}
