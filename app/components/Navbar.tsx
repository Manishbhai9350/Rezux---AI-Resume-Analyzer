import { Link } from "react-router"


const Navbar = () => {
  return (
    <div className="fixed border-black/30 w-[90vw] h-fit flex justify-between items-center bg-white rounded-[50px] px-6 py-2 top-2  left-1/2 -translate-x-1/2 border  z-20">
        <Link to='/' className="heading-logo">
            <p className="font-bold text-2xl text-gradient">Rezux</p>
        </Link>

        <Link to='/upload' className="navbar-button primary-button w-fit">
            Upload Resume
        </Link>
    </div>
  )
}

export default Navbar