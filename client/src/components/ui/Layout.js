import { Outlet } from "react-router-dom"
import ResponsiveDrawer from "./ResponsiveDrawer"
import { useContext } from "react";
import CaptionContext from "../../context/CaptionProvider";
import Caption from "./Caption";
import Notification from "./Notification";

const Layout = () => {

    const { caption, href } = useContext(CaptionContext);

    return (
        <main className="App">
            <Outlet />
            <ResponsiveDrawer />
            <Caption href={href}>{caption}</Caption>
            <Notification />
        </main>
    )
}

export default Layout