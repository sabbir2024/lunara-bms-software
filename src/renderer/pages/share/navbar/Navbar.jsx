import { FaEdit, FaFolderOpen, FaBell } from "react-icons/fa";
import { IoChevronBackCircleSharp, IoChevronForwardCircle } from "react-icons/io5";
import { FcAddDatabase, FcDeleteDatabase, FcHome, FcPrint, FcSearch } from "react-icons/fc";
import { RxTextNone } from "react-icons/rx";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Calculator from "../../../components/calculator/Calculator";
import ConfigEditor from "../ConfigEditor";
import { useNav } from "../../../provider/NavProvider";
import Help from "../help/Help";

const Navbar = () => {
    const [config, setConfig] = useState([]);
    const { newCreate, setNewCreate, editing, setEditing, deleteitem, setDeleteitem, setPrinting, printing } = useNav();


    // query search options
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");


    useEffect(() => {
        if (query) {
            setSearchParams({ search: query });
        } else {
            setSearchParams({});
        }
    }, [query, setSearchParams]);


    const handleClear = () => {
        setQuery("");
        setSearchParams({});
    };

    const navigate = useNavigate();
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/v1/config');
                const data = await res.json();
                setConfig(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        loadConfig();
    }, []);
    return (
        <div className={'flex items-center gap-5 text-2xl'}>
            <button onClick={() => setNewCreate(!newCreate)}><FcAddDatabase title="New" /></button>
            <Link to={'/dashboard'}><FcHome title="Home" /></Link>
            <button onClick={() => navigate(-1)} className="text-info"><IoChevronBackCircleSharp title="Back" /></button>
            <button onClick={() => navigate(+1)} className="text-info"><IoChevronForwardCircle title="Forward" /></button>
            <button onClick={handleClear}><RxTextNone title='Clear' /></button>
            <label htmlFor="my-drawer"><FaFolderOpen title="Open" className="text-info" /></label>

            {
                editing ?
                    <button onClick={() => setEditing(!editing)} className="text-gray-400"><FaEdit title="Edit" /></button> :
                    <button onClick={() => setEditing(!editing)} className="text-info"><FaEdit title="Edit" /></button>

            }
            {
                deleteitem ?
                    <button onClick={() => setDeleteitem(!deleteitem)}><FcDeleteDatabase title="Delete" /></button> :
                    <button onClick={() => setDeleteitem(!deleteitem)}><MdDelete title="Delete" className="text-red-500" /></button>
            }



            {/* Search input */}
            <div className="dropdown">
                <div tabIndex={0} role="button" className="cursor-pointer" ><FcSearch title="Search" /></div>
                <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <div className="join">
                        <input type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="input join-item" placeholder="Search" />
                        <button onClick={handleClear} className="btn join-item">Clear</button>
                    </div>
                </div>
            </div>
            <Calculator />
            <button onClick={() => {
                setPrinting(!printing)
            }}><FcPrint /></button>

            <Help />
        </div>
    );
};

export default Navbar;