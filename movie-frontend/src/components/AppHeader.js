import "antd/dist/antd.css";
import img_walle from "../assets/images/logo.jpeg";

function AppHeader() {
  return (
    <>
      <img
        src={img_walle}
        alt="walle"
        id="header_avatar"
        style={{
          height: 60,
        }}
      />
      <span>
        <h2
          style={{ display: "inline-block", color: "#ffffff", margin: "10px" }}
        >
          Movie recommender
        </h2>
      </span>
      <span>
        <h6
          style={{ display: "inline-block", color: "#999999", margin: "10px" }}
        >
            love what you like
        </h6>
      </span>
    </>
  );
}

export default AppHeader;