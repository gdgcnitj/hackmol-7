import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { teamData } from "@/data/team";
import { FaLinkedin, FaInstagram, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "./team.css";

function TeamCard({
  name,
  designation,
  image,
  linkedin,
  twitter,
  instagram,
  portfolio,
}: (typeof teamData)[number]) {
  const hasProfiles = linkedin || twitter || instagram || portfolio;

  return (
    <article className="team-card">
      <div className="team-image-wrap">
        <Image src={image} alt={name} width={360} height={360} className="team-image" />
      </div>

      <div className="team-card-content">
        <h3 className="team-name cinzel-font">{name}</h3>
        <p className="team-role cinzel-font">{designation}</p>
      </div>

      <div className="team-socials" aria-label={`${name} social profiles`}>
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label={`${name} LinkedIn`}>
            <FaLinkedin />
          </a>
        )}
        {twitter && (
          <a href={twitter} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label={`${name} Twitter`}>
            <FaXTwitter />
          </a>
        )}
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label={`${name} Instagram`}>
            <FaInstagram />
          </a>
        )}
        {portfolio && (
          <a href={portfolio} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label={`${name} Portfolio`}>
            <FaGlobe />
          </a>
        )}
        {!hasProfiles && <span className="team-social-placeholder">Profiles updating soon</span>}
      </div>
    </article>
  );
}

export default function Team() {
  const leadRow = teamData.slice(0, 2);
  const coreRow = teamData.slice(2);

  return (
    <section className="team-section" id="team">
      <SectionHeading
        title="ORGANIZING"
        highlight="TEAM"
        highlightPosition="after"
        description="The team building HackMol 7.0 from the ground up."
      />

      <div className="team-layout">
        <div className="team-row team-row-leads">
          {leadRow.map((member, index) => (
            <TeamCard key={`lead-${member.name}-${index}`} {...member} />
          ))}
        </div>

        <div className="team-row team-row-core">
          {coreRow.map((member, index) => (
            <TeamCard key={`core-${member.name}-${index}`} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}