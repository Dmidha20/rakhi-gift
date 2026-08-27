import memory1 from "../assets/images/memory1.jpg";
import memory2 from "../assets/images/memory2.jpg";
import memory3 from "../assets/images/memory3.jpg";
import memory4 from "../assets/images/memory4.jpg";
import memory5 from "../assets/images/memory5.jpg";
import memory6 from "../assets/images/memory6.jpg";
import memory7 from "../assets/images/memory7.jpg";

export interface MemoryItem {
  id: number;
  title: string;
  caption: string;
  date?: string;
  image?: string;
}

export type CarouselMemoryData = {
  id: string;
  caption: string;
  imageSrc: string;
};

export const CAROUSEL_MEMORIES: CarouselMemoryData[] = [
  {
    id: "memory-1",
    caption: "Better Together ❤️",
    imageSrc: memory1,
  },
  {
    id: "memory-2",
    caption: "Officially a team of three 🫶",
    imageSrc: memory2,
  },
  {
    id: "memory-3",
    caption: "Hum Sath Sath Hai ... 🧿❤️",
    imageSrc: memory3,
  },
  {
    id: "memory-4",
    caption: "My forever annoying brother 😂",
    imageSrc: memory4,
  },
  {
    id: "memory-5",
    caption: "Before Marriage 😂",
    imageSrc: memory5,
  },
  {
    id: "memory-6",
    caption: "After Marriage 👑 ❤️ ",
    imageSrc: memory7,
  },
  {
    id: "memory-7",
    caption: "Partners in crime 👫",
    imageSrc: memory6,
  },
];

export const MEMORIES: MemoryItem[] = CAROUSEL_MEMORIES.map((item, index) => ({
  id: index + 1,
  title: item.caption,
  caption: item.caption,
  image: item.imageSrc,
}));
