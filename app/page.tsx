import { SiAuthelia } from "react-icons/si";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center font-bold text-center mx-4 flex-col gap-4">
      <SiAuthelia className="size-16" />
      Welcome to the full stack Authentication system.
    </div>
  );
}
