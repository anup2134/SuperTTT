const Rules = ({ setShowRules }) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <button
        className="float-right pt-2 pr-4 text-xl font-sans "
        onClick={() => {
          setShowRules(false);
        }}
      >
        <p className="border border-[#04d9ff] rounded-full h-8 w-8">X</p>
      </button>
      <ul
        className="border border-[#04d9ff] rounded-lg w-max p-3 pt-6 bg-black "
        style={{
          boxShadow: "0 0 20px #04d9ff, 0 0 40px rgba(4, 217, 255, 0.5)",
        }}
      >
        <li className="mb-3">
          <h2 className="text-2xl">Gameplay rules:</h2>
          <ul>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
              The game starts with X making the first move in any of the 81
              empty spots.
            </li>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
              The opponent (O) must play in the small board corresponding to the
              location of the previous move.
            </li>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
              The next player's board is determined by the spot played by the
              previous player.
            </li>
          </ul>
        </li>
        <li className="mb-3">
          <h2 className="text-2xl">Winning and Board Control:</h2>
          <ul>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>A player
              wins a small board by the standard Tic-Tac-Toe rules.
            </li>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>A won
              small board is marked as won by the player in the larger board.
            </li>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
              No more moves can be played in a won or completely filled small
              board.
            </li>
          </ul>
        </li>
        <li className="mb-3">
          <h2 className="text-2xl">Special Cases:</h2>

          <ul>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
              If a player is sent to a won or filled board, they can play in any
              other available board.
            </li>
          </ul>
        </li>
        <li className="mb-3">
          <h2 className="text-2xl">Game End Conditions:</h2>

          <ul>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>The game
              ends when a player wins the larger board.
            </li>
            <li className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-white mr-1"></div>The game
              is a draw if there are no legal moves remaining.
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Rules;
