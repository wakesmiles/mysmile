import Navbar from "./navbar";

const Loading = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="container p-10">
        <div className="shadow sm:rounded-lg w-4/5"></div>
      </div>
    </div>
  );
};

export default Loading;
