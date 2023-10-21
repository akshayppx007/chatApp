import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { logoutUser } from "../../actions/userActions";
import toast from "react-hot-toast";
import { LOGOUT_USER_RESET } from "../../constants/userConstants";

const Home = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, loggedOut, isAuthenticated } = useSelector(
    (state) => state.persistedReducer.user
  );
  const [value, setValue] = useState("");
  const [username, setUsername] = useState();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [write, setWrite] = useState(false);
  const writeFunction = () => setWrite(true);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUsername(`${user.firstName} ${user.lastName}`);
    }
  }, [user]);

  const handleSubmit = () => {
    socket.emit("message", {
      value,
      user: username,
    });
    setWrite(false);
  };

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setMessages([...messages, data]);
      if (!onlineUsers.includes(data.user)) {
        setOnlineUsers([...onlineUsers, data.user]);
      }
    });
  }, [socket, messages, onlineUsers]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("logged out");
  };

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/");
  //     toast.success("logged out");
  //     // dispatch({
  //     //   type: LOGOUT_USER_RESET,
  //     // });
  //   }
  // }, [isAuthenticated]);

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo">
          ChatApp
        </Link>

        <button className="signOutBtn" onClick={() => handleLogout()}>
          Sign out
        </button>
      </nav>

      {!write ? (
        <main className="chat">
          <div className="chat__body">
            <div className="chat__content">
              {messages.map((message, index) =>
                message.user === username ? (
                  <div style={{ float: "right", margin: "7px 0" }} key={index}>
                    <p style={{ textAlign: "right", fontSize: "13px" }}>
                      {message.user}
                    </p>
                    <div className="sender__message">{message.value}</div>
                  </div>
                ) : (
                  <div style={{ margin: "7px 0" }} key={index}>
                    <p style={{ fontSize: "13px" }}>{message.user}</p>
                    <div className="recipient__message">{message.value}</div>
                  </div>
                )
              )}
              <div ref={lastMessageRef} />
            </div>
            <div className="chat__input">
              <div className="chat__form">
                <button className="createBtn" onClick={writeFunction}>
                  Write message
                </button>
              </div>
            </div>
          </div>
          <aside className="chat__bar">
            <h3>Active users</h3>
            <ul>
              {onlineUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </aside>
        </main>
      ) : (
        <main className="editor">
          <header className="editor__header">
            <button className=" editorBtn" onClick={handleSubmit}>
              SEND MESSAGE
            </button>
          </header>

          <div className="editor__container">
            <textarea
              rows="4"
              cols="50"
              onChange={(e) => setValue(e.target.value)}
              style={{ border: "groove" }}
            ></textarea>
          </div>
        </main>
      )}
    </div>
  );
};

export default Home;
