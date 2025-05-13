const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : window.location.replace("/login");
  };
  
  export default PrivateRoute;
  