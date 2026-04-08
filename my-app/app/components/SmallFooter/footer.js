import Link from 'next/link';
import './footer.css'
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="Footer">
          <div className="Footer-in">
            <p> &#169; {currentYear} KLEF - <Link href="https://sac.kluniversity.in/" target="_blank" rel="noopener noreferrer">Student Activity Center</Link> | <Link href="https://www.linkedin.com/company/zeroonecodeclub/" target="_blank" rel="noopener noreferrer">ZeroOne Code Club</Link> | Designed & Developed by <Link href="https://www.linkedin.com/in/dinesh-korukonda-513855271/" target="_blank" rel="noopener noreferrer">Dinesh Korukonda</Link> & <Link href="https://www.linkedin.com/in/singananischal/" target="_blank" rel="noopener noreferrer">Nischal Singana</Link></p>
          </div>
        </div>
      );
}
 
export default Footer;
