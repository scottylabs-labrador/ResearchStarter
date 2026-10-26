import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlined from "@mui/icons-material/BookmarkBorderOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import FilterListOutlined from "@mui/icons-material/FilterListOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import MailOutlined from "@mui/icons-material/MailOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

export interface IconProps {
  /** Height of the visible glyph, in px. */
  size: number;
  className?: string;
}

/**
 * Material icons draw inside a 24-unit square with uneven blank margins (1–8 units a side), so spacing set
 * around that square never matches what you see. These icons, for use beside text, are cropped to each
 * glyph's ink box (measured from its path data): the box is the visible shape, and gaps and padding set
 * around it are ink to ink.
 *
 * Each sits in a wrapper that takes the surrounding font and line height, and hangs off that line's baseline
 * to centre on the capitals. Browsers round where text sits in its line differently at each zoom level, and
 * the wrapper's line is rounded the same way as the text beside it, so the two stay aligned at any zoom.
 */
const cropped = (Glyph: typeof AddOutlined, x: number, y: number, w: number, h: number) => {
  const Icon = ({ size, className }: IconProps) => (
    <span className="inline-block shrink-0">
      <Glyph
        viewBox={`${x} ${y} ${w} ${h}`}
        fontSize="inherit"
        className={className}
        style={{ width: (size * w) / h, height: size, overflow: "visible", verticalAlign: `calc((1cap - ${size}px) / 2)` }}
      />
    </span>
  );
  return Icon;
};

export const AccountBalanceIcon = cropped(AccountBalanceOutlined, 2, 1, 19, 20);
export const AccountCircleIcon = cropped(AccountCircleOutlined, 2, 2, 20, 20);
export const AddIcon = cropped(AddOutlined, 5, 5, 14, 14);
export const ApartmentIcon = cropped(ApartmentOutlined, 3, 3, 18, 18);
export const ArrowBackIcon = cropped(ArrowBack, 4, 4, 16, 16);
export const ArrowForwardIcon = cropped(ArrowForward, 4, 4, 16, 16);
export const BadgeIcon = cropped(BadgeOutlined, 2, 2, 20, 20);
export const BookmarkIcon = cropped(Bookmark, 5, 3, 14, 18);
export const BookmarkBorderIcon = cropped(BookmarkBorderOutlined, 5, 3, 14, 18);
export const CalendarIcon = cropped(CalendarTodayOutlined, 2, 1, 20, 22);
export const CheckCircleIcon = cropped(CheckCircleRounded, 2, 2, 20, 20);
// Rotates to show open and closed, so it is cropped to a square centred on the glyph.
export const ChevronDownIcon = cropped(KeyboardArrowDown, 6, 6.3, 12, 12);
export const ChevronLeftIcon = cropped(KeyboardArrowLeft, 8, 6, 7.41, 12);
export const CloseIcon = cropped(CloseOutlined, 5, 5, 14, 14);
export const DashboardIcon = cropped(DashboardOutlined, 3, 3, 18, 18);
export const DeleteIcon = cropped(DeleteOutlineOutlined, 5, 3, 14, 18);
export const EditIcon = cropped(EditOutlined, 3, 3, 18, 18);
export const FilterListIcon = cropped(FilterListOutlined, 3, 6, 18, 12);
export const HomeIcon = cropped(HomeOutlined, 2, 3, 20, 17);
export const LogoutIcon = cropped(LogoutOutlined, 3, 3, 18, 18);
export const MailIcon = cropped(MailOutlined, 2, 4, 20, 16);
export const MenuBookIcon = cropped(MenuBookOutlined, 1, 4.5, 22, 17);
export const OpenInNewIcon = cropped(OpenInNewOutlined, 3, 3, 18, 18);
export const PaidIcon = cropped(PaidOutlined, 2, 2, 20, 20);
export const PersonIcon = cropped(PersonOutlineOutlined, 4, 4, 16, 16);
export const ScheduleIcon = cropped(ScheduleOutlined, 2, 2, 20, 20);
export const SchoolIcon = cropped(SchoolOutlined, 1, 3, 22, 18);
export const SearchIcon = cropped(SearchOutlined, 3, 3, 17.49, 17.49);
