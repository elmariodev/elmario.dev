import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaThreads,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const socialHandle = "@elmariodev";

export type SocialLink = {
  href: string;
  label: string;
  icon: IconType;
};

export const socialLinks: SocialLink[] = [
  { href: "https://github.com/elmariodev", label: "GitHub", icon: FaGithub },
  { href: "https://linkedin.com/in/elmariodev", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://www.youtube.com/@elmariodev", label: "YouTube", icon: FaYoutube },
  { href: "https://www.instagram.com/elmariodev", label: "Instagram", icon: FaInstagram },
  { href: "https://www.tiktok.com/@elmariodev", label: "TikTok", icon: FaTiktok },
  { href: "https://x.com/elmariodev", label: "X", icon: FaXTwitter },
  { href: "https://www.threads.com/@elmariodev", label: "Threads", icon: FaThreads },
  { href: "https://www.facebook.com/elmariodev", label: "Facebook", icon: FaFacebook },
];
