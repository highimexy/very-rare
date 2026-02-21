import { FaRegUserCircle } from "react-icons/fa";

function User() {
  const currentBalance = "HighImExy";

  return (
    <>
      <div className="w-40 text-center">
        <h1 className="font-bold text-white mb-1">User</h1>
        <div className="bg-[#1e0b37] p-1 rounded-sm flex flex-col gap-2">
          <div className="flex items-center">
            <div className="relative grow">
              <div className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none">
                <FaRegUserCircle className="text-[20px]" />
              </div>
              <div
                className="
                  p-2 pl-10 pr-4 bg-[#10061f] outline-none rounded-sm w-full text-white
                  flex items-center h-full text-sm truncate
                "
              >
                {currentBalance}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
