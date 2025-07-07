import Editor from "../components/Editor";

const Room = () => {
  return (
    <div className="flex flex-col h-screen">
      <h2 className="text-xl text-center mt-4 font-bold">Pair Programming Room</h2>
      <Editor />
    </div>
  );
};


export default Room;
