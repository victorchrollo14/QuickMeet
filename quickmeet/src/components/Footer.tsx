import logo from "../assets/images/Logo.svg";

function Footer() {
  return (
    <footer>
      <div id="footer" className={`container flex justify-between py-10`}>
        <a>
          <img src={logo} />
        </a>
        <a href="">Github</a>
        <a href="">Email</a>
        <a href="">Twitter</a>
      </div>
    </footer>
  );
}
export default Footer;
