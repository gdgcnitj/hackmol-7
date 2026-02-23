import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";
import "./contact.css";

const contacts = [
  {
    name: "Adesh Anurag",
    image: "/images/adesh.png",
    linkedin: "https://www.linkedin.com/in/adesh-anurag-176a44254/",
  },
  {
    name: "Chahat Kesharwani",
    image: "/images/chahat.png",
    linkedin: "https://www.linkedin.com/in/chahatkesharwani/",
  },
];

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-label-group">
          <p className="contact-tagline">Any doubt or query?</p>
        </div>

        <div className="contact-cards">
          {contacts.map((person) => (
            <a
              key={person.name}
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              aria-label={`LinkedIn profile of ${person.name}`}
            >
              <Image
                src={person.image}
                alt={person.name}
                width={40}
                height={40}
                className="contact-avatar"
              />
              <div className="contact-info">
                <p className="contact-name">{person.name}</p>
                <span className="contact-linkedin">
                  <FaLinkedinIn size={10} />
                  LinkedIn
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
