import Head from "next/head";

export default function CustomHead() {
  return (
    <Head>
      <link
        rel="shortcut icon"
        type="image/png"
        href="/icon/icon-512x512.png"
      />
      <link rel="icon" type="image/png" href="/icon/icon-512x512.png" />
      <link rel="apple-touch-icon" href="/ios-icon/ios-icon-180x180.png" />

      <title>General Purpose Bot</title>

      <meta name="author" content="Christof Reimers" />
      <meta
        name="description"
        content="The Homepage of the General-Purpose-Discord-Bot, short GPD-Bot. Login with Discord to gain advanced access."
      />
    </Head>
  );
}
