import { Route } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = (props) => {
  const { history } = props;
  const jwtToken = Cookies.get("jwt_token");
  const isAuthenticated = jwtToken !== undefined;

  if (!isAuthenticated) {
    history.replace("/login");
    return null;
  }
  return <Route {...props} />;
};

export default ProtectedRoute;
