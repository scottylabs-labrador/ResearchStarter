import React from "react";
import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import logo from "../assets/logo.png";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

type TeamMember = {
  name: string;
  imgUrl?: string;
};

const aboutText =
  "We want to make a website that consolidates information about all the research and lab opportunities currently at CMU.";

const team: TeamMember[] = Array.from({ length: 8 }, () => ({
  name: "John Doe",
}));

const AboutPage: React.FC = () => {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-[#FCF8FF] font-sans text-black">
      <header className="border-b border-[#E6DEEF] bg-white">
        <div className="mx-auto flex h-[67px] max-w-[1200px] items-center justify-between px-6 lg:px-10">
          <Link to="/main" className="flex items-center">
            <img
              src={logo}
              alt="CMU Research logo"
              className="h-[42px] w-auto object-contain"
            />
          </Link>

          <nav className="flex items-center gap-7 text-[13px] text-[#111111]">
            <Link to="/dashboard" className="flex items-center gap-1.5">
              <HomeOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Dashboard</span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5">
              <SearchOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Search</span>
            </Link>
            <Link to="/saved" className="flex items-center gap-1.5">
              <BookmarkBorderOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Saved</span>
            </Link>
          </nav>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 rounded-full bg-[#F5F6FA] px-4 py-2 text-[11px] text-[#6B7280]"
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-67px)] max-w-[1200px] flex-col px-7 pt-8 sm:px-8 lg:px-10">
        <section>
          <h1 className="text-[20px] font-black leading-[40px] tracking-[-0.02em] text-black">
            About CMU Research...
          </h1>

          <p className="mt-1 max-w-none text-[12px] leading-[18px] text-[#55545A]">
            {aboutText}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[20px] font-black leading-[40px] tracking-[-0.02em] text-black">
            Meet the Team...
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full bg-[#FFFDFC]">
                  {member.imgUrl ? (
                    <img
                      src={member.imgUrl}
                      alt={member.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-black"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
                    </svg>
                  )}
                </div>

                <p className="mt-4 text-center text-[16px] font-normal text-[#222222]">
                  {member.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-[4px] bg-[#E3D2FF] px-10 py-5">
            <h3 className="text-[18px] font-black leading-[32px] text-black">
              Contact Us!!
            </h3>

            <div className="mt-1 text-[12px] leading-[18px] text-black">
              <p>
                <span className="font-bold">Email:</span>{" "}
                <span className="font-normal">CMUResearch@........</span>
              </p>
              <p>
                <span className="font-bold">Google Form:</span>{" "}
                <span className="font-normal">..........................</span>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-auto border-t border-[#E6DEEF] pt-3 pb-6" />
      </main>
    </div>
  );
};

export default AboutPage;
