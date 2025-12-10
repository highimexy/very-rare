function Mines() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="text-center p-6">
          <h1 className="text-7xl font-pirata rounded-2xl cursor-crosshair hover:text-purple-600 no-underline hover:underline transition duration-200">
            Mines
          </h1>
        </div>
        <div className="flex grow items-center justify-center">
          <div className="flex flex-row gap-20">
            <div className="p-8 border-4 border-gray-600 rounded-lg shadow-xl">
              <h1>PANEL</h1>
            </div>
            <div className="p-8 border-4 border-gray-600 rounded-lg shadow-xl">
              <h1>GRA</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Mines;
