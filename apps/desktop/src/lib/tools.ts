import {
  Combine,
  FileAudio,
  FileImage,
  FileSearch,
  FileText,
  FileVideo,
  Fingerprint,
  Minimize2,
  PenLine,
  Repeat,
  ScanText,
  ShieldOff,
  Tags,
  type LucideIcon,
} from "lucide-react";

export type ToolItem = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  path: string;
  available: boolean;
};

export type SingleTool = {
  id: string;
  type: "single";
  nameKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  path: string;
  available: boolean;
};

export type ToolGroup = {
  id: string;
  type: "group";
  nameKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  items: ToolItem[];
};

export type ToolEntry = SingleTool | ToolGroup;

export const toolEntries: ToolEntry[] = [
  {
    id: "file-converter",
    type: "group",
    nameKey: "tools.fileConverter.name",
    descriptionKey: "tools.fileConverter.description",
    icon: Repeat,
    items: [
      {
        id: "image",
        nameKey: "tools.fileConverter.image.name",
        descriptionKey: "tools.fileConverter.image.description",
        icon: FileImage,
        path: "/converter/image",
        available: true,
      },
      {
        id: "document",
        nameKey: "tools.fileConverter.document.name",
        descriptionKey: "tools.fileConverter.document.description",
        icon: FileText,
        path: "/converter/document",
        available: false,
      },
      {
        id: "audio",
        nameKey: "tools.fileConverter.audio.name",
        descriptionKey: "tools.fileConverter.audio.description",
        icon: FileAudio,
        path: "/converter/audio",
        available: false,
      },
      {
        id: "video",
        nameKey: "tools.fileConverter.video.name",
        descriptionKey: "tools.fileConverter.video.description",
        icon: FileVideo,
        path: "/converter/video",
        available: false,
      },
    ],
  },
  {
    id: "pdf-tools",
    type: "group",
    nameKey: "tools.pdfTools.name",
    descriptionKey: "tools.pdfTools.description",
    icon: FileText,
    items: [
      {
        id: "pdf-merge-split",
        nameKey: "tools.pdfTools.mergeSplit.name",
        descriptionKey: "tools.pdfTools.mergeSplit.description",
        icon: Combine,
        path: "/pdf/merge-split",
        available: false,
      },
      {
        id: "pdf-compress",
        nameKey: "tools.pdfTools.compress.name",
        descriptionKey: "tools.pdfTools.compress.description",
        icon: Minimize2,
        path: "/pdf/compress",
        available: false,
      },
      {
        id: "pdf-edit",
        nameKey: "tools.pdfTools.edit.name",
        descriptionKey: "tools.pdfTools.edit.description",
        icon: PenLine,
        path: "/pdf/edit",
        available: false,
      },
    ],
  },
  {
    id: "ocr",
    type: "group",
    nameKey: "tools.ocr.name",
    descriptionKey: "tools.ocr.description",
    icon: FileSearch,
    items: [
      {
        id: "ocr-image",
        nameKey: "tools.ocr.image.name",
        descriptionKey: "tools.ocr.image.description",
        icon: ScanText,
        path: "/ocr/image",
        available: false,
      },
      {
        id: "ocr-pdf",
        nameKey: "tools.ocr.pdf.name",
        descriptionKey: "tools.ocr.pdf.description",
        icon: FileText,
        path: "/ocr/pdf",
        available: false,
      },
    ],
  },
  {
    id: "metadata",
    type: "group",
    nameKey: "tools.metadata.name",
    descriptionKey: "tools.metadata.description",
    icon: Fingerprint,
    items: [
      {
        id: "metadata-strip",
        nameKey: "tools.metadata.strip.name",
        descriptionKey: "tools.metadata.strip.description",
        icon: ShieldOff,
        path: "/metadata/strip",
        available: true,
      },
      {
        id: "metadata-edit",
        nameKey: "tools.metadata.edit.name",
        descriptionKey: "tools.metadata.edit.description",
        icon: Tags,
        path: "/metadata/edit",
        available: true,
      },
    ],
  },
];
