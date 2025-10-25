import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button size="sm" asChild>
      <Link href={href}>
        <ArrowLeftIcon /> {label}
      </Link>
    </Button>
  );
}
