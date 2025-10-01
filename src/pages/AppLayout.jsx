// import AppNav from "../Components/AppNav";
// import PageNav from "../Components/PageNav";
import { useEffect } from "react";
import Map from "../Components/Map";
import SideBar from "../Components/SideBar";
import User from "../Components/User";
import styles from "./AppLayout.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";

function AppLayout() {
  const navigate = useNavigate();
  const {isAuthenticated}=useAuth();
  
  useEffect(function(){
    if(!isAuthenticated){
      navigate('/');
    }
  },[isAuthenticated])

  return (
    <div className={styles.app}>
      <User/>
      <SideBar />
      <Map />
    </div>
  );
}

export default AppLayout;
