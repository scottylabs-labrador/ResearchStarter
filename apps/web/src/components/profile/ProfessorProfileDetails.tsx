import DetailsTable, { DetailRow } from "../ui/DetailsTable";
import { cx } from "../ui/cx";
import { AccountBalanceIcon, ApartmentIcon, MailIcon } from "../ui/icons";
import { linkUnderline } from "../ui/linkClass";

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
      icon: <AccountBalanceIcon size={12} />,
    },
    {
      label: "Department",
      value: department.length > 0 ? department.join(", ") : notSet,
      icon: <ApartmentIcon size={12} />,
    },
    {
      label: "Email",
      value: email ? (
        <a
          href={`mailto:${email}`}
          className={cx(linkUnderline, "break-all rounded-[4px] font-mono text-meta text-accent-strong decoration-accent/35 transition-colors duration-150 hover:text-accent-strong hover:decoration-accent-strong/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent")}
        >
          {email}
        </a>
      ) : (
        notSet
      ),
      icon: <MailIcon size={10.5} />,
    },
  ];

  return <DetailsTable rows={rows} />;
};

export default ProfessorProfileDetails;
