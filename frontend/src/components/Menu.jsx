import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <button onClick={() => {}}>Rules</button>
        </li>
      </ul>
    </>
  );
};

export default Menu;
