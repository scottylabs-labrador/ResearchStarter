import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import DetailsTable, { DetailRow } from "../ui/DetailsTable";

interface ProfessorProfileDetailsProps {
  college: string[];
  department: string[];
  email: string;
}

const notSet = <span className="text-ink-muted">Not set</span>;

const ProfessorProfileDetails = ({ college, department, email }: ProfessorProfileDetailsProps) => {
  const rows: DetailRow[] = [
    {
      label: "College",
      value: college.length > 0 ? college.join(", ") : notSet,
      icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 15 }} />,
    },
    {
      label: "Department",
      value: department.length > 0 ? department.join(", ") : notSet,
      icon: <ApartmentOutlinedIcon sx={{ fontSize: 15 }} />,
    },
    {
      label: "Email",
      value: email ? (
        <a
          href={`mailto:${email}`}
          className="break-all rounded-[4px] font-mono text-meta text-accent underline decoration-accent/35 underline-offset-[3px] transition-colors duration-150 hover:text-accent-strong hover:decoration-accent-strong/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
        >
          {email}
        </a>
      ) : (
        notSet
      ),
      icon: <MailOutlinedIcon sx={{ fontSize: 15 }} />,
    },
  ];

  return <DetailsTable rows={rows} />;
};

export default ProfessorProfileDetails;
