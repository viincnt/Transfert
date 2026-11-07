import { FileText, Image as ImageIcon, Music, SquarePlay } from "lucide-react";

export const examples = {
  images: {
    icon: ImageIcon,
    extension: "HEIC",
    formats: ["JPG", "PNG", "WebP"],
    sizes: ["4.8 MB", "3.2 MB", "5.1 MB"],
  },
  videos: {
    icon: SquarePlay,
    extension: "MOV",
    formats: ["MP4", "WebM"],
    sizes: ["48 MB", "32 MB", "71 MB"],
  },
  audio: {
    icon: Music,
    extension: "WAV",
    formats: ["MP3", "FLAC"],
    sizes: ["12 MB", "8.4 MB", "24 MB"],
  },
  documents: {
    icon: FileText,
    extension: "DOCX",
    formats: ["PDF", "TXT"],
    sizes: ["2.1 MB", "840 KB", "3.6 MB"],
  },
};

export type Category = keyof typeof examples;
export const categories: Category[] = [
  "images",
  "videos",
  "audio",
  "documents",
];

/** Three crops of the one landscape, so sample files don't all look alike. */
export const photoCrops = [
  "origin-[50%_48%]",
  "origin-[85%_38%]",
  "origin-[22%_88%]",
];
