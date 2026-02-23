import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";
import { contacts } from "@/data/contact";
import "./contact.css";

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
                width={46}
                height={46}
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
