type IconProps = { className?: string };

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const SearchIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

export const SlidersIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

export const HelpIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.2a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4" />
    <path d="M12 17h.01" />
  </svg>
);

export const DownloadIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3v11" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M4 20h16" />
  </svg>
);

export const ExternalIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={14} height={14}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export const ArrowIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ShieldIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M12 3.2 5 6v5.4c0 4.3 2.9 7.6 7 9.4 4.1-1.8 7-5.1 7-9.4V6l-7-2.8Z" />
  </svg>
);

export const ChevronIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={14} height={14}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={14} height={14}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16} strokeWidth={2.25}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={14} height={14}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
  </svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
    <path d="M12 10v4" />
    <path d="M12 17h.01" />
  </svg>
);

export const FileIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z" />
    <path d="M13.5 3v5.5H19" />
  </svg>
);

export const GridIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect height="7" rx="1.5" width="7" x="3.5" y="3.5" />
    <rect height="7" rx="1.5" width="7" x="13.5" y="3.5" />
    <rect height="7" rx="1.5" width="7" x="3.5" y="13.5" />
    <rect height="7" rx="1.5" width="7" x="13.5" y="13.5" />
  </svg>
);

export const SignOutIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M15 4.5h3.5A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5H15" />
    <path d="M10 8l-4 4 4 4" />
    <path d="M6 12h9" />
  </svg>
);

export const SignInIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M9 4.5H5.5A1.5 1.5 0 0 0 4 6v12a1.5 1.5 0 0 0 1.5 1.5H9" />
    <path d="M15 8l4 4-4 4" />
    <path d="M19 12h-9" />
  </svg>
);

export const UserPlusIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="10" cy="8" r="3.5" />
    <path d="M3.5 19.5a6.5 6.5 0 0 1 13 0" />
    <path d="M18 4.5v5M20.5 7h-5" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </svg>
);

export const SendIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
);

export const ClipIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M19 11.5 12.4 18a4.1 4.1 0 0 1-5.8-5.8l6.9-6.9a2.7 2.7 0 0 1 3.9 3.9l-6.9 6.9a1.3 1.3 0 0 1-1.9-1.9l6.2-6.2" />
  </svg>
);

/* The assistant's own mark. Two strokes, so it reads as a spark at 14px and
   does not pretend to be a face or a robot. */
export const SparkIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M12 3.5 13.7 9 19 10.7 13.7 12.4 12 18l-1.7-5.6L5 10.7 10.3 9 12 3.5Z" />
    <path d="M18.5 16.5 19 18.4l1.9.6-1.9.6-.5 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" />
  </svg>
);

export const NewChatIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} width={16} height={16}>
    <path d="M20 12.8V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.4" />
    <path d="M15 4.5h5.5M17.75 2v5" />
  </svg>
);
