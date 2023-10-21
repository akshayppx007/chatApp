import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../layouts/loader";
import toast from "react-hot-toast";
import { clearErrors, loginUser } from "../../../actions/userActions";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, isAuthenticated } = useSelector(
    (state) => state.persistedReducer.user
  );

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      toast.error("please enter email id and password");
    } else {
      event.preventDefault();
      dispatch(loginUser(email, password));
    }
    setValidated(true);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (isAuthenticated == true && user && user.isAdmin == true) {
      navigate("/admin");
      toast.success("welcome admin");
    } else if (isAuthenticated == true && user && user.isAdmin == false) {
      navigate("/home");
      toast.success(`welcome ${user.firstName}`);
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, user, navigate, dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          encType="application/json"
        >
          <Row className="mt-5 justify-content-md-center">
            <Col md={6}>
              <h1>Login</h1>
              <Form.Group controlId="validationCustom01" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  value={email}
                  placeholder="email"
                  onChange={handleEmail}
                />
              </Form.Group>

              <Form.Group controlId="validationCustom02" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handlePassword}
                />
              </Form.Group>

              <Button type="submit" className="mt-4">
                Login
              </Button>
              <p className="mt-3">
							don't have an account?
							<Link to="/register">
								<span>register</span>
							</Link>
						</p>

            </Col>
          </Row>
        </Form>
      )}
    </>
  );
}

export default Login;
