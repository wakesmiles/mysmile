import Navbar from "./navbar";
import Head from "next/head";

/** Temporary UI for loading while fetching data client-side */
const Loading = () => {
  return (
    <div>
      <Head>
        <title>MySmile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <Navbar />
        <div className="container p-10">
          <div className="shadow sm:rounded-lg w-4/5"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
