import PlayerProvider from "@/components/listen/PlayerProvider";

export default function ListenLayout({ children }: { children: React.ReactNode }) {
  return <PlayerProvider>{children}</PlayerProvider>;
}
