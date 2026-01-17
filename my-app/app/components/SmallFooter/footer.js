import Link from 'next/link';
import './footer.css'
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="Footer">
          <div className="Footer-in">
            <p> &#169; {currentYear} All rights Reserved by <Link href="https://www.linkedin.com/company/zeroonecodeclub/mycompany/">ZeroOne Code Club</Link> , Department of Student Activity Center, K L Deemed to be University | Content owned by Smart Village Revolution Club.</p>
          </div>
        </div>
      );
}
 
export default Footer;
