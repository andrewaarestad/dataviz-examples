import Image from "next/image";
import Dashboard from "./dashboard";

export default function Home() {
  return (
    <div>
      <Dashboard
        timeRange={[new Date(), new Date()]}
      />
    </div>
  );
}
