import Head from "next/head";
import GameManager from "../src/Displays/Gameplay/GameManager";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Big Brain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <GameManager />
      </main>
    </div>
  );
}
