import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SocialLinkProps {
  Icon: LucideIcon;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ Icon, href }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-accent transition-colors"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
};

export default SocialLink;