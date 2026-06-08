"use client";

import { motion } from "framer-motion";
import {
  Gavel,
  Users,
  Scale,
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
  FileSearch,
  Building2,
  AlertOctagon,
  BadgeCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const contentIcons = {
  Gavel,
  Users,
  Scale,
  Shield,
  AlertTriangle,
  FileText,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
  FileSearch,
  Building2,
  AlertOctagon,
  BadgeCheck,
  ShieldCheck,
} as const;

type ContentIconName = keyof typeof contentIcons;

interface LegalContentBlockProps {
  icon: ContentIconName;
  title: string;
  children: React.ReactNode;
  index?: number;
}

export function LegalContentBlock({
  icon,
  title,
  children,
  index = 0,
}: LegalContentBlockProps) {
  const Icon: LucideIcon = contentIcons[icon];
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-[#163300]/8 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#9FE870]/25">
          <Icon className="size-5 text-[#163300]" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#163300]">{title}</h2>
      </div>
      <div className="space-y-3 text-[#163300]/70 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5">
        {children}
      </div>
    </motion.article>
  );
}
