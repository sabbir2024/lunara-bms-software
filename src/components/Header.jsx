import { FaHome, FaEdit, FaFolderOpen, FaSearch } from "react-icons/fa";
import { IoChevronBackCircleSharp, IoChevronForwardCircle } from "react-icons/io5";
import { FcAddDatabase, FcDeleteDatabase, FcHome, FcPrint, FcSearch } from "react-icons/fc";
import { RxTextNone } from "react-icons/rx";
import { MdDelete } from "react-icons/md";

const Header = ({
    sectionName,
    searching,
    showHome,
    showBack,
    showForward,
    showOpen,
    showAdd,
    showEdit,
    showPrint,
    showDelete
}) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text w-full h-10 flex text-white text-center items-center justify-between px-4 py-2">
            {/* Left Section - Navigation & Actions */}
            <div className="flex items-center gap-3">

                <button className="p-1 hover:bg-blue-700 rounded transition-colors">
                    <IoChevronBackCircleSharp size={18} />
                </button>


                <button className="p-1 hover:bg-blue-700 rounded transition-colors">
                    <IoChevronForwardCircle size={18} />
                </button>
                {showHome && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Home">
                        <FcHome size={18} />
                    </button>
                )}
                {showOpen && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Open">
                        <FaFolderOpen size={16} />
                    </button>
                )}
            </div>

            {/* Center Section - Title */}
            <div className="flex items-center gap-3">
                <h3 className="font-mono ml-2 bg-white/20 px-2 py-1 rounded">{sectionName}</h3>
            </div>

            {/* Right Section - Tools & Actions */}
            <div className="flex items-center gap-3">
                {searching && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Search">
                        <FcSearch size={18} />
                    </button>
                )}
                {showAdd && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Add">
                        <FcAddDatabase size={18} />
                    </button>
                )}
                {showEdit && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Edit">
                        <FaEdit size={16} />
                    </button>
                )}
                {showPrint && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Print">
                        <FcPrint size={18} />
                    </button>
                )}
                {showDelete && (
                    <button className="p-1 hover:bg-blue-700 rounded transition-colors" title="Delete">
                        <FcDeleteDatabase size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;