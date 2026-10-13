export default function Navbar()
{

    return (
        <nav className="w-full h-[80px] bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex justify-between items-center h-full">
                <h1 className="card-title ml-5 font-bold text-2xl">
                    Pokedex Project
                </h1>
                <div className="mr-5">
                    <a href="/login"> 
                    <button className="btn btn-dash">Login</button>
                    </a>
                </div>
            </div>
        </nav>
    )
}